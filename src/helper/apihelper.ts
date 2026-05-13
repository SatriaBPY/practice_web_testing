import { Page, Response } from "@playwright/test";

export default class APIHelper {
  private lastCapturedResponse: any = null;

  constructor(private page: Page) { }

  async waitForAPIResponse<T>(
    urlPatern: RegExp,
    option: {
      timeout?: number,
      statusCode?: number;
    } = {}
  ): Promise<T> {
    const { timeout = 30000, statusCode = 200 } = option;

    const response = await this.page.waitForResponse(
      (resp: Response) => {
        const matchUrl = urlPatern.test(resp.url());
        const matchStatus = resp.status() === statusCode;
        return matchUrl && matchStatus;
      },
      { timeout }
    );

    const body = await response.json();
    this.lastCapturedResponse = body
    return body as T
  };

  getLastResponse<T>(): T {
    return this.lastCapturedResponse as T;
  }
  
}