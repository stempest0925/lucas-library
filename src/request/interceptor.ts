export default class Interceptor {
  private interceptors: Function[] = [];

  constructor() {}

  // 入栈
  public use(interceptor: Function) {
    this.interceptors.push(interceptor);
  }

  // 设置埋点
  public setBuriedPoint(payload: unknown) {
    this.interceptors.forEach((interceptor) => {
      interceptor(payload);
    });
  }
}
