declare class Worker {
  constructor(scriptURL: string | URL, options?: { name?: string; credentials?: RequestCredentials });
  postMessage(message: unknown, transfer?: Transferable[]): void;
  terminate(): void;
}
