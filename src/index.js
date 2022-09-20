// index.js
// This is the main entry point of our application

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');

// Импортируем модели БД в приложение
const models = require('./models');

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;

// Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST;


// Построение схемы с использованием языка схем GraphQL
const typeDefs = gql`
	type Query {
		hello: String
		notes: [Note]
		note(id: ID): Note
	}
	type Note {
		id: ID
		content: String
		author: String
	}
	type Mutation {
		newNote(content: String!): Note
	}
`;

// Представляем функцию разрешения для полей схемы
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		notes: async () => {
			return await models.Note.find();
		},
		note: async (parent, args) => {
			return await models.Note.findById(args.id);
		}
	},
	Mutation: {
		newNote: async (parent, args) => {
			
			return await models.Note.create({
				content: args.content,
				author: "Alexandr Turov"
			});
		}
	}
};

const app = express();

// Подключаем базу данных
db.connect(DB_HOST);


// Настройка ApolloServer
const server = new ApolloServer({typeDefs, resolvers});

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({app, path: '/api'});

app.listen({ port }, () => 
	console.log(`GrathQL Server running at http://localhost:${port}${server.graphqlPath}`)
);

/*
app.get('/', (req, res) => res.send('Hello Web Server!!!'));

app.listen(port, () =>
	console.log(`Server running at http://localchost:${port}`)
);
*/

let notes = [
	{id: '1', content: 'This is a note', author: 'Adam Scott'},
	{id: '2', content: 'This is another note', author: 'Harlow Everly'},
	{id: '3', content: 'Oh hey look, another note!', author: 'Alexandr Turov'}
]