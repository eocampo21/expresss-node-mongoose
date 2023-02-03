import { NextFunction } from "express";

function loggerMiddleware(request: Request, response: Response,  next: NextFunction) {
  console.log(`I comming from middleware ${request.method} ${request}`);
  next();
}

export default loggerMiddleware;