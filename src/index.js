// index.js
// This is the main entry point of our application

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const port = process.env.PORT || 4000;


// Построение схемы с использованием языка схем GraphQL
const typeDefs = gql`
	type Query {
		hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
	}
	type Note {
		id: ID!
		content: String!
		author: String!
	}
	type Mutation {
		newNote(content: String!): Note!
	}
`;

// Представляем функцию разрешения для полей схемы
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		notes: () => notes,
		note: (parent, args) => {
			return notes.find(note => note.id === args.id);
		}
	},
	Mutation: {
		newNote: (parent, args) => {
			let noteValue = {
				id: String(notes.length + 1),
				content: args.content,
				author: 'Alexandr Turov'
			};
			notes.push(noteValue);
			return noteValue;
		}
	}
};

const app = express();


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