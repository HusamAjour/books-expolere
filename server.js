'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const superagent = require('superagent');

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res) =>{
  res.render('pages/index');
});

app.get('/search/new', (req,res) =>{
  res.render('pages/searches/show');
});
app.post('/searches', (req, res)=>{
  let search_query = req.body.search_query;
  let search_selection = req.body.search_selection;
  console.log(search_selection);
  let url = `https://www.googleapis.com/books/v1/volumes?q=+${search_selection}:${search_query}`;

  superagent.get(url)
    .then(result =>{
      let booksArray = result.body.items.map(b => {
        let newBook = new Book(b);
        return newBook;
      });
      res.render('pages/results-page', {books: booksArray});
    })
    .catch(() =>{
      errorHandler('pages/error', req, res);
    });
});

app.get('*', (req,res) =>{
  res.status(404).render('pages/error');
});
app.use(errorHandler);

function errorHandler(error, req, res) {
  res.status(500).render(error);
}


function Book(data){
  this.title = data.volumeInfo.title;
  this.author = checkArr(data.volumeInfo.authors) || `Not available`;
  this.description = data.volumeInfo.description || 'No available';
  this.imgURL = data.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
}
function checkArr(arr){
  if(!Array.isArray(arr)){
    return arr || `Not available`;
  } else{
    return arr[0];
  }
}
app.listen(PORT, ()=>{
  console.log(`listening on port ${PORT}`);
});
