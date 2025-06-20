export function convertRotationToMatrix(rotation) {
  const rad = rotation * Math.PI / 180;
  return [Math.cos(rad), -Math.sin(rad), Math.sin(rad), Math.cos(rad)];
}
