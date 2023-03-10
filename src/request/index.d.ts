/** @remarks HTTP类基本配置 */
type THttpOptions = {
  baseUrl: string;
  timeout: number;
};

/** @remarks 声明HTTP请求需要用到的Headers类型 */
type THeaders = {
  Authorization: string;
  "Content-Type":
    | "application/json; charset=utf-8"
    | "multipart/form-data; charset=utf-8"
    | "application/octet-stream; charset=utf-8";
};

/**
 * @remarks HTTP类控制请求缓冲池
 * @param id 唯一值，过滤参考值，由url & 序列化params组成
 * @param timestamp 时间戳，过滤间隔
 * @param abortController 中止控制器，用来取消请求
 */
type TBufferPool = {
  id: string;
  timestamp: number;
  abortController: AbortController;
};

/**
 * @remarks HTTP类请求参数
 * @param useOtherUrl 是否使用外部url.
 * @param expectReturnType 预期返回类型.
 */
type TRequestPayload = {
  params: Record<string, any>;
  method: "GET" | "POST";
  headers: THeaders;

  useOtherUrl: boolean;
  expectReturnType: "json" | "blob" | "arrayBuffer";
};
