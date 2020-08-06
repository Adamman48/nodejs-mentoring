'use strict';
import { Transform, ReadableOptions, WritableOptions } from 'stream';
import { handleErrorCb } from '../utils/consoleUtils';

class TextTransformStream extends Transform {
  constructor(options?: ReadableOptions | WritableOptions) {
    super(options)
  }

  _transform(data: string, encoding: string, cb: Function): void {
    let reversedString: string = data;
    let errorText: Error | null = null;
    try {
      reversedString = reverseString(data);
    } catch (err) {
      errorText = new Error(`\n${err}`);
    } finally {
      cb(errorText, `${reversedString}\n\n`);
    }
  }
};

const { stdin, stdout } = process;

stdin.setEncoding('utf-8');

stdin.on('error', handleErrorCb)
  .pipe(new TextTransformStream({ objectMode: true })).on('error', handleErrorCb)
  .pipe(stdout).on('error', handleErrorCb);

function reverseString(inputString: string): string {
  const splitString: string[] = inputString.split('');
  splitString.pop();
  return splitString.reverse().join('');
}
