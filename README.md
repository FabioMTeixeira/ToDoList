
# API To do List

Esse projeto foi para criar uma API
onde quando fosse criado a conta do usuário, teria a senha
encriptagrafada. Depois, por meio do JWT, que foi utilizado para 
trazer mais segurança ao projeto por meio da autenticação e com
isso saber se o usuário pode ou não mexer na lista criada.
Com isso tudo ja liberado, o usuário poderia criar os nomes das listas
colocando várias tarefas em cada lista e também localizar, 
tanto a lista quanto a tarefa por meio do ID e colocar a tarefa como
completa afim de elimina-la da sua lista.


## Stack utilizada

**Back-end:** Node, Express

**Banco de dados:** MongoDB

**Autenticador:** JWT , Bcrypt


## Documentação da API

#### Usado para gerar o token de encriptar a senha

```http
  GET /salt
```
Depois que fizer a requisição dessa função, ira gerar uma sequência
aleatória de números e letras que será declarada no projeto como SALT.

#### Usado para criar um novo usuário

```http
  POST /users
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username, password`      | `string` | **Obrigatório**. O parâmetro é necessário |

#### Usado para gerar uma palavra para a geração do token
```http
  POST /auth
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username` `password`| `string` |  |

#### Usado para testar a autenticação

```http
  GET /auth/test
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username, password`      | `string` |  |

#### Usado para mostrar todas as listas do usuário

```http
  GET /lists
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `userId`      | `string` |  |

#### Usado para criar uma nova lista

```http
  POST /lists
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `userId, name`      | `string` | **Obrigatório**. O nome da lista  |

#### Usado para atualizar a lista

```http
  PUT /lists/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name, id`| `string` | **Obrigatório**. Colocar o novo nome da lista  |


#### Usado para mostrar todas as listas e suas tarefas

```http
  GET /lists/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `userId, id`      | `string` | **Obrigatório**. ID necessário |

#### Usado para criar uma nova tarefa

```http
  POST /lists/:listId/tasks
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `listId, title`      | `string` | **Obrigatório**. O nome da tarefa  |

#### Usado para atualizar o nome de uma tarefa 

```http
  PUT /lists/:listId/tasks/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `listId, id, title`      | `string` | **Obrigatório**. Novo nome da tarefa  |

O listId e o id da tarefa são necessários para fazer a modificação somente
nela.

#### Usado para completar a tarefa 

```http
  PUT /tasks/:id/completed_tasks
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. ID da tarefa  |



## Autores

- [@FabioMTeixeira](https://github.com/FabioMTeixeira)

