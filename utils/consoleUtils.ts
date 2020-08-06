export enum ConsoleColorsEnum {
  RED = '\x1b[31m',
  MAGENTA = '\x1b[35m',
  CYAN = '\x1b[36m%s\x1b[0m',
}

export function displayMemoryUsage(): void {
  const usedMemory: number = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(ConsoleColorsEnum.CYAN, `Used approx ${Math.round(usedMemory * 100) / 100} MB of memory`);
}

export function handleErrorCb(err: Error | null): void {
  if (err) {
    console.error(ConsoleColorsEnum.RED, 'Operation failed.', err);
  } else {
    console.log(ConsoleColorsEnum.MAGENTA, 'Operation succeeded.');
    displayMemoryUsage();
  }
}
