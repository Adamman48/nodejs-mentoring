import HttpException from "./HttpException";

class AuthTokenInvalidException extends HttpException {
  constructor() {
    super(403, 'Authentication token is invalid!');
  }
}

export default AuthTokenInvalidException;
