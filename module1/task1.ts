'use strict';
import { Transform } from 'stream';
import { handleErrorCb } from '../utils/consoleUtils';

const { stdin, stdout } = process;

stdin.setEncoding('utf-8');

const textTransformStream = new Transform({
  transform: (inputString, encoding, cb) => {
    let reversedString;
    let errorText: Error | null = null;
    try {
      reversedString = reverseString(inputString.toString());
    } catch (err) {
      errorText = new Error(`\n${err}`);
    }
    cb(errorText, `${reversedString}\n\n`);
  }
});

stdin.on('error', handleErrorCb)
  .pipe(textTransformStream).on('error', handleErrorCb)
  .pipe(stdout).on('error', handleErrorCb);

function reverseString(inputString: string): string {
  const splitString: string[] = inputString.split('');
  splitString.pop();
  return splitString.reverse().join('');
}
