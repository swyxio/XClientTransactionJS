import { sha256 } from "js-sha256";
import { Cubic } from './cubicCurve.js';
import { interpolate } from './interpolate.js';
import { convertRotationToMatrix } from './rotation.js';
import { MathUtil, floatToHex, isOdd, base64Encode, validateResponse } from './utils.js';
import { INDICES_REGEX, ADDITIONAL_RANDOM_NUMBER, DEFAULT_KEYWORD } from './constants.js';

export class ClientTransaction {
  constructor(homePageResponse, ondemandFileResponse, randomKeyword = null, randomNumber = null) {
    validateResponse(homePageResponse);
    validateResponse(ondemandFileResponse);
    this.homePageResponse = homePageResponse;
    this.ondemandFileResponse = ondemandFileResponse;
    this.randomKeyword = randomKeyword || DEFAULT_KEYWORD;
    this.randomNumber = randomNumber || ADDITIONAL_RANDOM_NUMBER;
    const indices = this.getIndices(this.ondemandFileResponse);
    this.rowIndex = indices[0];
    this.keyBytesIndices = indices.slice(1);
    this.key = this.getKey(this.homePageResponse);
    this.keyBytes = this.getKeyBytes(this.key);
    this.animationKey = this.getAnimationKey(this.keyBytes, this.homePageResponse);
  }

  getIndices(ondemandFileResponse) {
    const matches = [...ondemandFileResponse.matchAll(INDICES_REGEX)];
    if (matches.length === 0) {
      throw new Error("Couldn't get KEY_BYTE indices");
    }
    const indices = matches.map(m => parseInt(m[2], 10));
    return [indices[0], ...indices.slice(1)];
  }

  getKey(homePageResponse) {
    const match = homePageResponse.match(/<meta[^>]*name=['"]twitter-site-verification['"][^>]*content=['"]([^'"]+)['"]/);
    if (!match) {
      throw new Error("Couldn't get [twitter-site-verification] key from the page source");
    }
    return match[1];
  }

  getKeyBytes(key) {
    if (typeof Buffer !== 'undefined') {
      return Array.from(Buffer.from(key, 'base64'));
    }
    const binary = atob(key);
    return Array.from(binary, c => c.charCodeAt(0));
  }

  getFrames(homePageResponse) {
    const regex = /id=['"]loading-x-anim-\d+['"][^>]*>.*?<path[^>]*d=['"]([^'"]+)['"]/gs;
    const frames = [];
    let m;
    while ((m = regex.exec(homePageResponse)) !== null) {
      frames.push(m[1]);
    }
    return frames;
  }

  get2dArray(keyBytes, homePageResponse, frames = null) {
    if (frames === null) {
      frames = this.getFrames(homePageResponse);
    }
    const path = frames[keyBytes[5] % 4];
    const pieces = path.slice(9).split('C');
    return pieces.map(item => item.replace(/[^\d]+/g, ' ').trim().split(/\s+/).map(Number));
  }

  solve(value, minVal, maxVal, rounding) {
    const result = value * (maxVal - minVal) / 255 + minVal;
    return rounding ? Math.floor(result) : Math.round(result * 100) / 100;
  }

  animate(frames, targetTime) {
    const fromColor = frames.slice(0,3).map(Number).concat([1]);
    const toColor = frames.slice(3,6).map(Number).concat([1]);
    const fromRotation = [0.0];
    const toRotation = [this.solve(frames[6], 60.0, 360.0, true)];
    frames = frames.slice(7);
    const curves = frames.map((v, i) => this.solve(v, isOdd(i), 1.0, false));
    const cubic = new Cubic(curves);
    const val = cubic.getValue(targetTime);
    let color = interpolate(fromColor, toColor, val);
    color = color.map(v => Math.max(0, Math.min(255, v)));
    const rotation = interpolate(fromRotation, toRotation, val);
    const matrix = convertRotationToMatrix(rotation[0]);
    const strArr = color.slice(0,3).map(v => Math.round(v).toString(16));
    for (const value of matrix) {
      let rounded = Math.round(value * 100) / 100;
      if (rounded < 0) rounded = -rounded;
      const hexValue = floatToHex(rounded);
      strArr.push(hexValue.startsWith('.') ? `0${hexValue}`.toLowerCase() : hexValue || '0');
    }
    strArr.push('0','0');
    const animationKey = strArr.join('').replace(/[.-]/g, '');
    return animationKey;
  }

  getAnimationKey(keyBytes, homePageResponse) {
    const totalTime = 4096;
    const rowIndex = keyBytes[this.rowIndex] % 16;
    const frameTime = this.keyBytesIndices.reduce((a,i)=>a*(keyBytes[i]%16),1);
    const roundedFrameTime = MathUtil.round(frameTime/10)*10;
    const arr = this.get2dArray(keyBytes, homePageResponse);
    const frameRow = arr[rowIndex % arr.length];
    const targetTime = roundedFrameTime / totalTime;
    return this.animate(frameRow, targetTime);
  }

  generateTransactionId(method, path, homePageResponse=null, key=null, animationKey=null, timeNow=null) {
    timeNow = timeNow || Math.floor((Date.now() - 1682924400000) / 1000);
    const timeBytes = [(timeNow>>0)&0xFF, (timeNow>>8)&0xFF, (timeNow>>16)&0xFF, (timeNow>>24)&0xFF];
    key = key || this.key || this.getKey(homePageResponse);
    const keyBytes = this.getKeyBytes(key);
    animationKey = animationKey || this.animationKey || this.getAnimationKey(keyBytes, homePageResponse);
    const hashBytes = sha256.array(`${method}!${path}!${timeNow}${this.randomKeyword}${animationKey}`);
    const randomNum = Math.floor(Math.random()*256);
    const bytesArr = [...keyBytes, ...timeBytes, ...hashBytes.slice(0,16), this.randomNumber];
    const out = [randomNum, ...bytesArr.map(b => b ^ randomNum)];
    return base64Encode(Uint8Array.from(out)).replace(/=+$/, '');
  }
}
