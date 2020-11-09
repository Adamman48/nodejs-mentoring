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
  }
}

export function controllerErrorLogger(methodName: string, argumentList: any[], err: Error) {
  const formattedArgList = argumentList.map((arg, i) => `arg${i + 1}: ${arg},`);
  const logMessage = `Error calling ${methodName} method with (${formattedArgList})\n${err}`;

  console.error(ConsoleColorsEnum.RED, logMessage);
}
