// 物品质量
const itemsQuality = ["劣质", "普通", "精良", "稀有", "史诗", "传说"];
// 物品阶段爆率矩阵
const itemsOddsMatrix = [
  [10, 6, 3, 1, 0.3, 0.1],
  [6, 10, 3, 1, 0.3, 0.1],
  [3, 10, 6, 1, 0.3, 0.1],
  [1, 10, 6, 3, 0.3, 0.1],
  [0, 6, 10, 3, 0.3, 0.1],
  [0, 3, 10, 6, 0.3, 0.1],
  [0, 1, 6, 6, 0.6, 0.3],
  [0, 0, 6, 6, 1.6, 0.6],
];
// 混合数据
let itemsMixin: { quality: string; rate: number }[][] = [];
for (let i = 0; i < itemsOddsMatrix.length; i++) {
  const itemsOdds = itemsOddsMatrix[i].map((item, index) => ({
    quality: itemsQuality[index],
    rate: item,
  }));
  itemsMixin.push(itemsOdds);
}

/**
 * 
 * @param phase 
 * @returns 
 * @remark 直接使用对应品质的概率，会导致概率覆盖，举例:
 * - 先判断普通品质，那么高级品质，就永远出不来。
 * - 如果先判断高级品质，则普通品质的概率会降低，因为被抢走了份额。
 * 解决方案: 概率累加，先判断普通品质的概率，再判断普通-高级品质的概率，这样保持在范围区间，就是唯一的概率。
 * 举例: 普通是12%，高级是6%，随机数是15%，因为大于12%，所以不是普通装备，但是保持在12-18%的唯一概率当中，即高级装备。
 * 举例2: 史诗装备的概率0.3%，例如区间是12-12.3%，只有随机数达到这个唯一范围，才算是爆出史诗装备。
 */
function getItem(phase: number) {
  if (phase > itemsOddsMatrix.length) throw new Error("下标溢出");

  const random = Math.random() * 100;
  let index = 0;

  function findItem() {
    const now = itemsMixin[phase][index];

    let rate: number;
    if (index === 0) {
      rate = now.rate;
    } else {
      rate = itemsMixin[phase]
        .slice(0, index + 1)
        .map((item) => item.rate)
        .reduce((previous, current) => previous + current);
    }

    if (random < rate) {
      return now.quality;
    } else {
      if (index + 1 === itemsMixin.length) {
        return null;
      } else {
        index++;
        return findItem();
      }
    }
  }

  return findItem();
}

// 三十次爆装测试
console.log("【阶段1】");
for (let num = 0; num < 30; num++) {
  setTimeout(() => {
    const result = getItem(0);
    result ? console.log("爆出" + result + "装备") : console.log("没有装备");
  }, num * 300);
}

// 目前的爆装函数不够完善，没有系数（单位等级等）、没有幸运值等，最好实现中间件进行处理