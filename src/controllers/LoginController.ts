/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import User from '../models/User';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Req extends Request, User {
  userId: string;
  userEmail: string;
}

class UserController {
  async store(request: Req, response: Response) {
    try {
      const user = await getRepository(User).findOne({
        email: request.body.email,
      });

      if (!user) {
        return response.status(401).json({
          error: ['Usuário não cadastrado'],
        });
      }
      if (!(await bcrypt.compare(request.body.password, user.password_hash))) {
        return response.status(401).json({
          error: ['Email ou Senha Invalidos'],
        });
      }

      const { id, email, nome, sobrenome, createdAt, updateAt } = user;
      const token = await jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: '1d',
      });
      return response.status(201).json({
        data: { id, email, nome, sobrenome, createdAt, updateAt, token },
      });
    } catch (err) {
      return response.status(501).json({
        err: null,
      });
    }
  }
}

export default new UserController();
