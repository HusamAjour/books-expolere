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

app.get('/', mainRoute);
app.get('/search/new', searchFrom);
app.post('/searches', searchHandler);
app.post('/books', storeIntoDB);
app.get('/books/:id', getBookFromDB);
app.get('*', notFound);
app.use(errorHandler);

function mainRoute(req, res){
  const SQL = `SELECT * FROM books`;
  client.query(SQL)
    .then(results => {
      res.render('pages/index', { books: results.rows, pageName: 'Home'});
    }).catch(() => {
      errorHandler('pages/error', req, res);
    });
}

function searchFrom(req, res){
  res.render('pages/searches/new', {pageName: 'Search by Title or Author'});
}

function searchHandler(req, res){
  let search_query = req.body.search_query;
  let search_selection = req.body.search_selection;
  let url = `https://www.googleapis.com/books/v1/volumes?q=+${search_selection}:${search_query}`;

  superagent.get(url)
    .then(result => {
      Book.all = [];
      Book.all = result.body.items.map(b => {
        return new Book(b);
      });
      res.render('pages/searches/show', { books: Book.all, pageName: 'Search Results'});
    });
}

function storeIntoDB(req, res){
  let index = req.body.array_index;
  let SQL = `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1,$2,$3,$4,$5) RETURNING id`;
  let { title, author, isbn, image_url, description } = Book.all[index];
  let values = [title, author, isbn, image_url, description];
  client.query(SQL, values)
    .then(result => {
      res.redirect(`/books/${result.rows[0].id}`);
    })
    .catch(() => {
      errorHandler('pages/error', req, res);
    });
}

function getBookFromDB(req, res){
  let book_id = req.params.id;
  let SQL = `SELECT * FROM books WHERE id = ${book_id}`;

  client.query(SQL)
    .then(result => {
      res.render('pages/books/show', {obj: result.rows[0], pageName: 'Book Details'});
    })
    .catch(() => {
      errorHandler('pages/error', req, res);
    });
}

function notFound(req, res){
  res.status(404).render('pages/error', {pageName: 'Not Found'});
}

function errorHandler(error, req, res) {
  res.status(500).render(error , {pageName: 'Error'});
}

Book.all = [];
function Book(data) {
  this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Not available`;
  this.author = (data.volumeInfo.authors) ? data.volumeInfo.authors[0] : `Not available`;
  this.isbn = (data.volumeInfo.industryIdentifiers) ? `${data.volumeInfo.industryIdentifiers[0].type}: ${data.volumeInfo.industryIdentifiers[0].identifier}` : `Not available`;
  this.image_url = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `Not available`;
  Book.all.push(this);
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  });
