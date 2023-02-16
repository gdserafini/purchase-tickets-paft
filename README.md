# About this project

* Serviço de compra do projeto de Node.JS.
* Documentação: http://localhost:3004/api-docs
* OBS: Como foi utlizado a arquitetura de Microsservices alguns testes podem falhar caso os outros serviços não estejam rodando, também se aplica para documentação Swagger, devido a isso a documentação a seguir explica as rotas.

# Documentação

* Response padrão {statusCode, data?, message}
* Error padrão {statusCode, message}

* GET - /purchase/list/me
    * Retorna uma lista com todas as compras de um usuário {statusCode, data, message} (puxa pelo id contido no token JWT)
    * Possui um middleware para validação do token JWT
    * Caso retorne um erro será no formato {statusCode, message} - 400, 401, 404, 500

* POST - /purchase/me?show=show-test
    * Cria uma compra e a compra {statusCode, data, message} (utiliza o id contido no token JWT e nome do show da query)
    * Possui um middleware para validação do token JWT
    * Caso retorne um erro será no formato {statusCode, message} - 400, 401, 403, 404, 500

* DELETE - /purchase/me
    * Delete todas as compras de um usuário e retorna {statusCode, data, message} (utiliza o id contido no token JWT)
    * Possui um middleware para validação do token JWT
    * Caso retorne um erro será no formato {statusCode, message} - 400, 401, 500

* DELETE - /purchase/me/{id}
    * Delete uma compra específica de um usuário e retorna {statusCode, data, message} (utiliza o id contido no token JWT e req.params)
    * Possui um middleware para validação do token JWT e validação de id
    * Caso retorne um erro será no formato {statusCode, message} - 400, 401, 404, 500

# Código

* Arquitetura: Microsservices
* Desenvolvimento: TDD
* Padrão de projeto: Refatoração: Cada camada torna a camada abaixo abstrata (exemplo: funções getService e getRepository) e e 'empacota' a resposta de uma maneira padronizada (exemplo: funções getResponse), tornando o código mais simples para implementar novas rotas (necessitando apenas configurar a rota implementar o repository e se necessário fazer algumas validações no service), testar e dar manutenção.