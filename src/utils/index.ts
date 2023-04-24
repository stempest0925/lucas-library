// 判断JSON是否为空
export function jsonIsEmpty(json: Record<string, any>) {
  return JSON.stringify(json) === "{}" || Object.keys(json).length === 0;
}

// 获取JSON序列化字符串
export function jsonSerialize(
  json: Record<string, string | number | null>
): string {
  if (jsonIsEmpty(json)) return "";

  const searchParams = new URLSearchParams();
  for (let key in json) {
    searchParams.append(key, json[key] ? (json[key] as string) : "");
  }
  return searchParams.toString();
}
export function jsonSerialize_v2(json: Record<string, string | number | null>) {
  if (jsonIsEmpty(json)) return "";

  // const _concatTuple = (tuple: [string, string | number | null]) =>
  //   `${tuple[0]}=${tuple[1] === null ? "" : tuple[1]};`;

  // Object.entries(json).reduce((previous, current) => {
  //   const suffix = _concatTuple(current);
  //   if (typeof previous === "string") {
  //     return previous + suffix;
  //   }
  //   return _concatTuple(previous) + suffix;
  // });

  const getJoinStr = (key: string) => {
    return `${key}=${json[key] === null ? "" : json[key]}&`;
  };

  Object.keys(json).reduce((previous, current, index) => {
    if (index === 1) {
      return getJoinStr(previous) + getJoinStr(current);
    }
    return previous + getJoinStr(current);
  });
}
