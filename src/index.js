// index.js
// This is the main entry point of our application

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Инвертируем модули ограничения сложности и глубины вложенности запросов
const dethLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

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
app.use(helmet());
app.use(cors());

// Подключаем базу данных
db.connect(DB_HOST);

// Импортируем модуль jsonwebtoken
const jwt = require('jsonwebtoken');


// Получаем информацию пользователя из JWT
const getUser = token => {
	if (token) {
		try {
			// Возвращаем информацию пользователя из токена
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			// Если с токеном возникла проблема
			new Error('Session Invalid')
		}
	}
};

// Настройка ApolloServer
const server = new ApolloServer({
	typeDefs,
	resolvers,
	validationRules: [dethLimit(5), createComplexityLimitRule(1000)],
	context: ({ req }) => {
		// Получаем токен пользователя из заголовков
		const token = req.headers.authorization;
		// Пытаемся извлечь пользователя с помощью токена
		const user = getUser(token);
		// Пока что будем выводить информацию о пользователе в консоль
		console.log(user);
		return { models, user };
	}
});



// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
	console.log(`GrathQL Server running at http://localhost:${port}${server.graphqlPath}`)
);