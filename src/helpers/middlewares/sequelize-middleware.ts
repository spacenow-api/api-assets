import { NextFunction, Response, Request } from "express";

export default (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  //sequelize.sync();
  next();
};
