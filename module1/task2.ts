'use strict';
import csvtojson from "csvtojson";
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { pipeline } from "stream";
import { handleErrorCb, displayMemoryUsage } from "../utils/consoleUtils";
import { ParserParamsInterface } from "../utils/definitions";

const parserParams: ParserParamsInterface = {
  delimiter: [';', ','],
  ignoreEmpty: true,
  headers: ['book', 'author', 'amount', 'price'],
  ignoreColumns: /(amount)/,
  colParser: {
    "price": 'number',
  },
};

pipeline(
  createReadStream(join(__dirname, './csv/nodejs-hw1-ex1.csv')),
  csvtojson(parserParams),
  createWriteStream(join(__dirname, './txt/nodejs-hw1-ex1.txt'))
    .on('finish', displayMemoryUsage),
  handleErrorCb,
);
