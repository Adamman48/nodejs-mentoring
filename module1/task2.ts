'use strict';
import csvtojson from "csvtojson";
import fs from 'fs';
import path from 'path';
import { pipeline } from "stream";
import { handleErrorCb } from "../utils/consoleUtils";
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
  fs.createReadStream(path.join(__dirname, './csv/nodejs-hw1-ex1.csv')),
  csvtojson(parserParams),
  fs.createWriteStream(path.join(__dirname, './txt/nodejs-hw1-ex1.txt')),
  handleErrorCb,
);
