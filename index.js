/*
 * Copyright 2019 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     https://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const { Client } = require('pg');

// This library allows the program to work both on Heroku and on Cloud Run
// (via Unix sockets)
const { parse } = require('pg-connection-string');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

const config = parse(process.env.DATABASE_URL);
const client = new Client(config);
const PORT = process.env.PORT || 8080;

/**
 * Run is the starting point for our application. It first connects to the
 * database and then starts the express server
 */
const run = async () => {
  await client.connect();

  app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`);
  });
}

/**
 * Route that is invoked when the user visits the app. Renders the index
 * route using mustache
 *
 * @param {object} req The request payload
 * @param {object} res The HTTP response object
 */
app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT DESCRIPTION FROM TASKS');
    let alltasks = {
      tasks: result.rows
    };
    res.render('main', alltasks);
  } catch(e) {
    console.error(e);
    res.status(500).end(e.toString());
  }
})

/**
 * Route that called to create a new task in the database
 *
 * @param {object} req The request payload
 * @param {object} res The HTTP response object
 */
app.post('/task', async (req, res) => {
  let taskDescription = req.body.task;
  try {
    await client.query(
      `INSERT INTO tasks (DESCRIPTION) VALUES ('${taskDescription}')`);
    res.redirect('/');
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
})

run();