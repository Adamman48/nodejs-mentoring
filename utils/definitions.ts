export interface ParserParamsInterface {
  delimiter?: string[];
  ignoreEmpty?: boolean;
  headers?: string[];
  ignoreColumns?: RegExp;
  colParser?: {
    [key: string]: string,
  };
}