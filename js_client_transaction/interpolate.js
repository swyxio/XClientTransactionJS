export function interpolate(fromList, toList, f) {
  const len = Math.min(fromList.length, toList.length);
  const out = [];
  for (let i = 0; i < len; i++) {
    out.push(interpolateNum(fromList[i], toList[i], f));
  }
  return out;
}

export function interpolateNum(fromVal, toVal, f) {
  if (typeof fromVal === 'number' && typeof toVal === 'number') {
    return fromVal * (1 - f) + toVal * f;
  }
  if (typeof fromVal === 'boolean' && typeof toVal === 'boolean') {
    return f < 0.5 ? fromVal : toVal;
  }
}
