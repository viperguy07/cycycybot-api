const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const schema = require('./schema/schema');
require('dotenv').config();

const app = express();

// use morgan to log requests to the console
app.use(morgan('dev'));

// allow cors
app.use(cors());

// use body parser
app.use(bodyparser.json());

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }));

// connect to db
mongoose.connect(process.env.DB_PASS, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('connected to db');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.use('/api/discord', require('./discord-oauth/discord'));

app.listen(5000, () => {
  console.log('Listening on port 5000...');
});

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});
