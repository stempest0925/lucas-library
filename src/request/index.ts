import { jsonSerialize } from "../utils";

/** 基于Fetch的封装，实现超时时间，主动取消，过滤重复请求、拦截器等拓展功能。*/
class Http {
  private static httpSingle: Http;
  private static httpOptions: THttpOptions = { baseUrl: "/", timeout: 300 };
  private static readonly defaultRequestPayload: TRequestPayload = {
    params: {},
    method: "GET",
    headers: {
      Authorization: "",
      "Content-Type": "application/json; charset=utf-8",
    },
    useOtherUrl: false,
    expectReturnType: "json",
  };

  private bufferPool: Map<string, TBufferPool> = new Map();

  constructor() {}
  public static getInstance(options?: Partial<THttpOptions>): Http {
    if (!Http.httpSingle) {
      Http.httpSingle = new Http();
      if (options) Http.httpOptions = Object.assign(Http.httpOptions, options);
    }
    return Http.httpSingle;
  }

  // 请求超时
  // TODO: 文件上传/下载状态下，取消timeout限制 or 修改timeout时长
  private timeoutPromise(): Promise<Error> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("this request is timeout"));
        clearTimeout(timer);
      }, Http.httpOptions.timeout);
    });
  }

  // 请求过程
  private fetchPromise<T>(params: Request): Promise<T | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(params);
        const responseContent = await response["json"]();
        // TEMP
        // setTimeout(() => {
        resolve(responseContent);
        // }, 500);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 底层请求函数
  async request(url: string, payload?: TRequestPayload) {
    // 设定默认值
    // TODO: 这里目前仅仅是浅拷贝，headers的内容需要做深拷贝。
    payload = Object.assign(Http.defaultRequestPayload, payload);
    // 更新请求地址
    url = payload.useOtherUrl ? url : Http.httpOptions.baseUrl + url;
    // 过滤重复请求
    const serializedParams = jsonSerialize(payload.params),
      bufferPoolId = `${url}${serializedParams && "?" + serializedParams}`;
    if (this.bufferPool.has(bufferPoolId)) return;
    // 请求入池
    const abortController = new AbortController();
    this.bufferPool.set(bufferPoolId, {
      id: bufferPoolId,
      timestamp: new Date().getTime(),
      abortController,
    });

    // TEMP
    // let temp: string[] = []
    // this.bufferPool.forEach((item, key) => temp.push(key));
    // console.log(temp)

    // TODO: 设定请求凭证
    if (!payload.headers) {
    }

    // 设定请求参数
    const params = new Request(payload.method === "GET" ? bufferPoolId : url, {
      method: payload.method,
      body: payload.method === "POST" ? JSON.stringify(payload.params) : null,
      headers: payload.headers,
      signal: abortController.signal,
    });

    try {
      console.info("[🙋API REQUEST]", url);

      // 发起请求
      // TODO: 正常情况下返回结果，文件上传下载等返回唯一ID，通过唯一ID可取消任务。
      const response = await Promise.race([
        this.timeoutPromise(),
        this.fetchPromise(params),
      ]);
      console.info("[🙆API SUCCESS]", response);

      // 最终处理
      this.bufferPool.get(bufferPoolId)?.abortController.abort();
      this.bufferPool.delete(bufferPoolId);
    } catch (error) {
      console.warn("[🤦API FAILURE]", error);

      // 最终处理
      this.bufferPool.get(bufferPoolId)?.abortController.abort();
      this.bufferPool.delete(bufferPoolId);
    }
  }
}

const httpSingle = Http.getInstance({ baseUrl: "http://chat-uat.hkp.com.hk" });
export default httpSingle;

/**
 * 错误案例：解构赋值获取不到正常的数据
 * export const { request } = httpSingle;
 */
