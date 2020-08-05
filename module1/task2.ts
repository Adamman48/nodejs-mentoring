'use strict';
import csvtojson from "csvtojson";
import fs from 'fs';
import { pipeline } from "stream";

const readStream = fs.createReadStream('./module1/csv/nodejs-hw1-ex1.csv');
const writeStream = fs.createWriteStream('./module1/txt/nodejs-hw1-ex1.txt');

const parserParams = {
  delimiter: [';', ','],
  ignoreEmpty: true,
  ignoreColumns: /(amount)/,
  colParser: {
    "price": 'number',
  },
  headers: ['book', 'author', 'amount', 'price']
};

pipeline(
  readStream,
  csvtojson(parserParams),
  writeStream,
  (err: any) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);
