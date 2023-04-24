/**
 * 弧度转角度
 * @param radian 弧度
 * @returns
 */
export function toAngle(radian: number): number {
  return (180 / Math.PI) * radian;
}

/**
 * 角度转弧度
 * @param angle 角度
 * @returns
 */
export function toRadian(angle: number): number {
  return (Math.PI / 180) * angle;
}

/**
 * 获取圆周长
 * @param r 半径
 * @returns
 */
export function getPerimeter(r: number): number {
  return 2 * Math.PI * r;
}

/**
 * 获取范围内的值
 * @param value 当前值
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function getInRangeValue(
  value: number,
  min: number,
  max: number
): number {
  value = Math.min(max, value);
  value = Math.max(min, value);
  return value;
}
