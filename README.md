### Documentação de como usar o Json Web Token para autenticação

#### Install JsonWebToken
~~~bash
yarn add jsonwebtoken && yarn add --dev @types/jsonwebtoken

or

npm install jsonwebtoken && npm install --save-dev @types/jsonwebtoken
~~~
#### JWT estrutura
##### Validação

jwt.verify(token, process.env.TOKEN_SECRET);

token = que está enviado na requisição.
TOKEN_SECRET = variável de ambiente que possui a chave pra decodificar o token.
#### Criação

jwt.sign(dados, chave, options -> {expiresIn: tempo de validade '1d' -> um dia})
jwt.sign({ id, email }, process.env.TOKEN_SECRET, {expiresIn: '1d',});


#### Criar variável de ambiente
~~~env
TOKEN_SECRET = gfdvjadfmgviofdnovujbngfpd;bnmjogfn;bdf
~~~
#### Usando Middleware de autenticação
middleware/authetication.ts
~~~ts
import jwt from 'jsonwebtoken';

export default async function (request, response, next,) {
  try {
    //Verificar se o middlewawre foi enviado
    const { authorization } = request.headers;
    if (!authorization) {
      response.status(401).json({
        errors: 'Token required!',
      });
    }

    //verificar primeiro como esse token esta sendo enviado
    //caso esteja sendo enviado com o Bearer <token> fazer o split
    const [, token]: any = authorization.split('_');

    const dados: any = await jwt.verify(token, process.env.TOKEN_SECRET);

    //fazer uma validação dos dados do token com a base de dados pra ver se estão validos
    const user = getRepository(User).findOne(
      {
        id: dados.id,
        email: dados.email,
      },
      { select: ['id', 'email', 'nome'] },
    );

    //Caso os dados do token estiverem desatualizados retornar requisição
    if (!user) {
      response.status(401).json({
        errors: 'Token Invalid User!',
      });
    }

    //Caso tudo ocorre bem utilizar os dados do token na requisição passando como
    //alguma propiedade do request
    request.userId = dados.id;
    request.userEmail = dados.email;
    next();
  } catch (err) {
    response.status(401).json({
      errors: 'Token Invalid!',
    });
  }
}
~~~

#### Criando um token
o token deve ser criado na hora que o usuário precisar acessar a aplicação ou utilizar algum recurso.
~~~ts
//exemplo
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

      //Criando um token com as informações do usuário
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
~~~
Esse token deve ser retorna após a autenticação do usuário para que possa ser usado pelo
frontend na próxima requisição.
