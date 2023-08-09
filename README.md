
# BasicFinAPI

O projeto contêm alguns conceitos simples de uma API financeira de maneira básica.

## Funcionalidades

- [x]  Criar uma conta
- [x]  Buscar o extrato bancário do cliente
- [x]  Realizar um depósito
- [x]  Realizar um saque
- [x]  Buscar o extrato bancário do cliente por data
- [x]  atualizar dados da conta do cliente
- [x]  obter dados da conta do cliente
- [x]  deletar uma conta

### Regras de negócio

- [x]  Não deve ser possível cadastrar uma conta com CPF já existente
- [x]  Não deve ser possível buscar extrato em uma conta não existente
- [x]  Não deve ser possível fazer depósito em uma conta não existente
- [x]  Não deve ser possível fazer saque em uma conta não existente
- [x]  Não deve ser possível fazer saque quando o saldo for insuficiente
- [x]  Não deve ser possível excluir uma conta não existente
## Executar localmente

Clone o projeto

```bash
  git clone https://github.com/Amosao/basic-finAPI.git
```
> Essa branch é a release_1.0

Vá para o diretório do projeto

```bash
  cd basic-finAPI
```

Instale as dependências

```bash
  npm install
```

Inicie o server

```bash
  npm start
```

### Observações

- A API rest pode ser acessada pela porta 8080;
- O projeto não possui conexão com banco dados nesta versão;
- O projeto utiliza o [Nodemon](https://www.npmjs.com/package/nodemon) como ferramenta de execução;
- Importe o arquivo 'requests.json' no [Insomnia](https://insomnia.rest/) para ter todas as requisições configuradas;

## Autores

- [@Amosao](https://github.com/Amosao)

