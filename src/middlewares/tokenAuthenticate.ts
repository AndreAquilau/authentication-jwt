import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function (
  request: Request | any,
  response: Response,
  next: NextFunction,
) {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      response.status(401).json({
        errors: 'Token required!',
      });
    }

    const [, token]: any = authorization;

    const dados: any = await jwt.verify(token, process.env.TOKEN_SECRET);

    const user = getRepository(User).findOne(
      {
        id: dados.id,
        email: dados.email,
      },
      { select: ['id', 'email', 'nome'] },
    );

    if (!user) {
      response.status(401).json({
        errors: 'Token Invalid User!',
      });
    }

    request.userId = dados.id;
    request.userEmail = dados.email;
    next();
  } catch (err) {
    response.status(401).json({
      errors: 'Token Invalid!',
    });
  }
}
