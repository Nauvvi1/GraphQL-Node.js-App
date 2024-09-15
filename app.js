const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const db = new sqlite3.Database('./data.db');


const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!): User
  }
`;


const resolvers = {
  Query: {
    users: () => {
      return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, rows) => {
          if (err) reject([]);
          resolve(rows);
        });
      });
    },
    user: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
          if (err) reject(null);
          resolve(row);
        });
      });
    },
  },
  Mutation: {
    createUser: (_, { name, email, age }) => {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
          [name, email, age],
          function (err) {
            if (err) reject(null);
            resolve({
              id: this.lastID,
              name,
              email,
              age
            });
          }
        );
      });
    },
  },
};


async function startApolloServer() {
  const app = express();

  
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, 
    playground: false,   
  });
  
  await server.start();

  
  server.applyMiddleware({ app });

  
  app.get('/users', (req, res) => {
    res.render('users');
  });

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http:`)
  });
}

startApolloServer();