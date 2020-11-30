'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
require('dotenv').config();
const PORT = process.env.PORT;
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {

  const SQL = `SELECT * FROM books`;
  client.query(SQL)
    .then(results => {
      res.render('pages/index', { books: results.rows });
    }).catch(() => {
      errorHandler('pages/error', req, res);
    });
});

app.get('/search/new', (req, res) => {
  res.render('pages/searches/new');
});

app.post('/searches', (req, res) => {
  let search_query = req.body.search_query;
  let search_selection = req.body.search_selection;
  let url = `https://www.googleapis.com/books/v1/volumes?q=+${search_selection}:${search_query}`;

  superagent.get(url)
    .then(result => {
      Book.all = [];
      Book.all = result.body.items.map(b => {
        let newBook = new Book(b);
        return newBook;
      });
      res.render('pages/searches/show', { books: Book.all });
    })
    .catch(() => {
      errorHandler('pages/error', req, res);
    });
});

app.post('/books', (req, res) => {
  let index = req.body.array_index;
  let SQL = `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1,$2,$3,$4,$5) RETURNING id`;
  let { title, author, isbn, image_url, description } = Book.all[index];
  let values = [title, author, isbn, image_url, description];
  console.log(values);
  client.query(SQL, values)
    .then(result => {
      res.redirect(`/books/${result.rows[0].id}`);
    })
    .catch(() => {
      errorHandler('pages/error', req, res);
    });
});

app.get('/books/:id', (req, res) => {
  console.log(req.params.id);
  let book_id = req.params.id;
  let SQL = `SELECT * FROM books WHERE id = ${book_id}`;

  client.query(SQL)
    .then(result => {
      console.log(result.rows);

      res.render('pages/books/show', {obj: result.rows[0]});
    })
    .catch(() => {
      errorHandler('pages/error', req, res);
    });
});

app.get('*', (req, res) => {
  res.status(404).render('pages/error');
});
app.use(errorHandler);

function errorHandler(error, req, res) {
  res.status(500).render(error);
}

Book.all = [];
function Book(data) {
  this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Not available`;
  this.author = (data.volumeInfo.authors) ? data.volumeInfo.authors[0] : `Not available`;
  this.isbn = (data.volumeInfo.industryIdentifiers) ? `${data.volumeInfo.industryIdentifiers[0].type}: ${data.volumeInfo.industryIdentifiers[0].identifier}` : `Not available`;
  this.image_url = (data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `Not available`;
  Book.all.push(this);
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  });
