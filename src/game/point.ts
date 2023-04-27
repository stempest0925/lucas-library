import { toAngle } from "../utils/math";

type Type2DAxis = { x: number; y: number };

/**
 * 获取坐标系当中两点之间的距离
 * @param axis1 点1
 * @param axis2 点2
 * @returns
 * @referFormula 勾股定理
 */
function getDistance_2D(axis1: Type2DAxis, axis2: Type2DAxis) {
  return Math.sqrt(
    Math.pow(axis2.x - axis1.x, 2) + Math.pow(axis2.y - axis1.y, 2)
  );
}

/**
 * 获取点1到点2的弧度/角度
 * @param axis1 点1
 * @param axis2 点2
 * @param useAngle 使用角度
 * @returns
 */
function getRadian_2D(
  axis1: Type2DAxis,
  axis2: Type2DAxis,
  useAngle: boolean = false
): number {
  const dx = axis2.x - axis1.x,
    dy = axis2.y - axis1.y;
  const radian = Math.atan2(dy, dx);

  if (useAngle) {
    return toAngle(radian);
  }
  return radian;
}

/**
 * 获取坐标系当中两点之间的任意一点
 * @param axis1 点1
 * @param axis2 点2
 * @param t 0-1之间的实数
 * @returns
 * @referFormula 线性插值公式
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

/**
 * 检查坐标系当中一个点是否在另外一个点的圆形范围内
 * @param checkAxis 检查点
 * @param referAxis 参照点
 * @param r 半径
 * @referFormula 勾股定理
 */
function isInPointRange(
  checkAxis: Type2DAxis,
  referAxis: Type2DAxis,
  r: number
) {
  const distance = getDistance_2D(referAxis, checkAxis);
  return distance <= r ? true : false;
}

/**
 * 二维坐标系中，从一个点移动到另外一个点
 * @param startAxis
 * @param endAxis
 * @param speed
 * @ps 默认按照60/30FPS标准来决定渲染循环定时器间隔
 * @remarks
 *  1. 这里只是演示，没有代入更新。
 *  2. 由于是预先计算，因此终点移动不会进行跟踪。
 *  3. 暂未代入角度，需要结合三角函数。
 *  4. 其实可以通过getAnyPoint，来获取到目标的每个点路径。
 */
function cf_demo(startAxis: Type2DAxis, endAxis: Type2DAxis, speed: number) {
  const distance = getDistance_2D(startAxis, endAxis);
  if (speed >= distance) {
    return [endAxis];
  } else {
    const moveAxisData: Type2DAxis[] = [];
    const count = Math.ceil(distance / speed);
    for (let i = 1; i <= count; i++) {
      //可以在这里根据角度/弧度使用三角函数计算坐标
      moveAxisData.push({
        x: startAxis.x + i * speed,
        y: startAxis.y + i * speed,
      });
    }
    return moveAxisData;
  }
}
