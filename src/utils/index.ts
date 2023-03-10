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
