type Type2DAxis = { x: number; y: number };

/**
 * 获取坐标系当中两点之间的距离
 * @param axis1 点1
 * @param axis2 点2
 * @returns
 */
function getDistance_2D(axis1: Type2DAxis, axis2: Type2DAxis) {
  return Math.sqrt(
    Math.pow(axis2.x - axis1.x, 2) + Math.pow(axis2.y - axis1.y, 2)
  );
}

/**
 * 获取坐标系当中两点之间的任意一点
 * @param axis1 点1
 * @param axis2 点2
 * @param t 0-1之间的实数
 * @returns
 * @remarks 线性插值公式
 */
function getAnyPoint_2D(
  axis1: Type2DAxis,
  axis2: Type2DAxis,
  t: number
): Type2DAxis {
  if (t <= 0) {
    return axis1;
  }
  if (t >= 1) {
    return axis2;
  }
  return {
    x: (1 - t) * axis1.x + t * axis2.x,
    y: (1 - t) * axis1.y + t * axis2.y,
  };
}

/**
 * 获取标系当中两点之间的中点(可用getRandomPoint_2d，t = 0.5实现)
 * @param axis1 点1
 * @param axis2 点2
 * @returns
 */
function getMiddlePoint_2D(axis1: Type2DAxis, axis2: Type2DAxis): Type2DAxis {
  return {
    x: (axis1.x + axis2.x) / 2,
    y: (axis1.y + axis2.y) / 2,
  };
}

/**
 * 获取坐标系当中两点之间的多个平均点
 * @param axis1 点1
 * @param axis2 点2
 * @param num 点数量
 * @ps 段落数量等于点数量+1，如取10个平均点，则有11个段落
 */
function getManyAvgPoints_2D(
  axis1: Type2DAxis,
  axis2: Type2DAxis,
  num: number
): Type2DAxis[] {
  let points: Type2DAxis[] = [];
  for (let i = 1; i <= num; i++) {
    points.push(getAnyPoint_2D(axis1, axis2, i / (num + 1)));
  }
  return points;
}
