import { Mutex, MutexInterface } from "async-mutex";

export default class GlobalMutex {
  private static mutexRecord: Record<string, MutexInterface> = {};

  public static of(key: string) {
    if (!this.mutexRecord[key]) {
      this.mutexRecord[key] = new Mutex();
    }
    return this.mutexRecord[key];
  }
}
