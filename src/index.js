// index.js
// This is the main entry point of our application

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');

// Импортируем модели БД в приложение
const models = require('./models');

// Построение схемы с использованием языка схем GraphQL
const typeDefs = require('./shema');

// Представляем функцию разрешения для полей схемы
const resolvers = require('./resolvers');

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;

// Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST;

const app = express();

// Подключаем базу данных
db.connect(DB_HOST);


// Настройка ApolloServer
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: () => {
		return { models };
	}
});

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({app, path: '/api'});

app.listen({ port }, () => 
	console.log(`GrathQL Server running at http://localhost:${port}${server.graphqlPath}`)
);