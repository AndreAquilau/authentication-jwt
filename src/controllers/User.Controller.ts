/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import User from '../models/User';
import { getRepository } from 'typeorm';
import validator from 'class-validator';
import bcrypt from 'bcrypt';

interface Req extends Request, User {
  userId: string;
  userEmail: string;
}

class UserController {
  async index(request: Req, response: Response) {
    try {
      const users = await getRepository(User).find({
        select: ['id', 'nome', 'sobrenome', 'idade', 'email', 'foto_url'],
      });

      if (users.length === 0) {
        return response.status(200).json({
          data: ['Nenhum usuário encontrado'],
        });
      }

      return response.status(201).json({
        data: users.forEach((key) => {
          key.foto_url = `${process.env.BASE_URL}:${process.env.PORT}/${process.env.FILES_STATIC}/${key.foto_url}`;
        }),
      });
    } catch (err) {
      return response.status(501).json({
        err: null,
      });
    }
  }
  async show(request: Req, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(401).json({
          error: ['Token required'],
        });
      }

      const user = await getRepository(User).findOne({
        select: ['id', 'nome', 'sobrenome', 'idade', 'email', 'foto_url'],
        where: {
          id: request.userId,
          email: request.userEmail,
        },
      });

      if (!user) {
        return response.status(200).json({
          data: ['Nenhum usuário encontrado'],
        });
      }
      const {
        id,
        email,
        nome,
        sobrenome,
        createdAt,
        updateAt,
        foto_url,
      } = user;

      return response.status(201).json({
        data: {
          id,
          email,
          nome,
          sobrenome,
          createdAt,
          updateAt,
          foto: `${process.env.BASE_URL}:${process.env.PORT}/${process.env.FILES_STATIC}/${foto_url}`,
        },
      });
    } catch (err) {
      return response.status(501).json({
        err: null,
      });
    }
  }
  async store(request: Req, response: Response) {
    try {
      // if (!request.userId || !request.userEmail) {
      //   return response.status(401).json({
      //     error: ['Token required'],
      //   });
      // }

      console.log(request.body, request.file.filename);
      const user = new User();
      user.nome = request.body.nome;
      user.sobrenome = request.body.sobrenome;
      user.idade = request.body.idade;
      user.email = request.body.email;
      user.password = request.body.password;
      user.password_hash = await bcrypt.hash(request.body.password, 8);
      user.foto_url = request.file.filename;

      const errors = await validator?.validate(user);

      if (errors?.length > 0) {
        return response.status(400).json({
          errors: errors.map((key) => key.constraints),
        });
      }
      const repository = getRepository(User);
      const res = await repository.save(user);
      const { id, email, nome, sobrenome, createdAt, updateAt, foto_url } = res;

      return response.status(201).json({
        data: {
          id,
          email,
          nome,
          sobrenome,
          createdAt,
          updateAt,
          foto: `${process.env.BASE_URL}:${process.env.PORT}/${process.env.FILES_STATIC}/${foto_url}`,
        },
      });
    } catch (err) {
      return response.status(501).json({
        errors: err.message,
      });
    }
  }
  async update(request: Req, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(401).json({
          error: ['Token required'],
        });
      }

      const userdb = await getRepository(User).findOne({
        where: { email: request.body.email },
      });

      if (userdb) {
        return response.status(401).json({
          error: ['Email já está sendo usado!'],
        });
      }

      const user = await getRepository(User).update(
        {
          id: request.userId,
          email: request.userEmail,
        },
        request.body,
      );

      return response.status(201).json({
        data: user,
      });
    } catch (err) {
      return response.status(501).json({
        err: err.message,
      });
    }
  }
  async delete(request: Req, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(401).json({
          error: ['Token required'],
        });
      }

      const user = await getRepository(User).delete({
        id: request.userId,
        email: request.userEmail,
      });

      return response.status(201).json({
        data: user,
      });
    } catch (err) {
      return response.status(501).json({
        err: null,
      });
    }
  }
}

export default new UserController();
