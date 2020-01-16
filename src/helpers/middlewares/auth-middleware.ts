import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";

import { IUser } from "./../../interfaces/user.interface";

import Token from "../utils/token";

import * as config from "./../../config";

const fetchUserById = async (id: string): Promise<any> => {
  const res = await axios.get(`${config.USERS_API_HOST}/users/legacy/${id}`);
  if (res && res.data) {
    const userData: IUser = res.data;
    return Promise.resolve({ email: userData.email, role: userData.role });
  }
  return Promise.reject();
};

async function authMiddleware(req: Request, _: Response, next: NextFunction) {
  const token = Token.get(req);
  if (token && token !== "undefined") {
    const secret: string = process.env.JWT_SECRET || "Spacenow";
    try {
      const { id }: any = await jwt.verify(token, secret);
      const { email, role }: any = await fetchUserById(id);
      console.debug(`User ${email} verified.`);
      req.userIdDecoded = id;
      req.userRoleDecoded = role;
      next();
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
