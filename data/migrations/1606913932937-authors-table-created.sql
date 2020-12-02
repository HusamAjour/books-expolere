/*Timestamp: 1606913932937 */
/* create table authors in database lab14_normal */
CREATE TABLE AUTHORS (id SERIAL PRIMARY KEY, name VARCHAR(255));

/*Timestamp: 1606914000264 */
/* get the unique author names from books table and store them into authors table */
INSERT INTO authors(name) SELECT DISTINCT author FROM books;

/*Timestamp: 1606914180696 */
/* double check data has been copied correctly */
SELECT COUNT(*) FROM authors;