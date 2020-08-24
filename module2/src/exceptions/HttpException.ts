class HttpException extends Error {
  readonly status: number;
  readonly message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
