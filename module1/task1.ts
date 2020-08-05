'use strict';

// TODO: try refactor with pipeline or pipe

process.stdin.setEncoding('utf-8');

process.stdin.on('readable', (): void => {
  let chunk;

  while ((chunk = process.stdin.read()) !== null) {
    chunk = reverseString(chunk);
    process.stdout.write(`${chunk}\n\n`);
  }
});

function reverseString(inputString: string): string {
  const splitString: string[] = inputString.split('');
  splitString.pop();
  return splitString.reverse().join('');
}
