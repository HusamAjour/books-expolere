/*Timestamp: 1606914205741 */
/* Modify books table by adding a new column nanmed author_id */
ALTER TABLE books ADD COLUMN author_id INT;

/*Timestamp: 1606914281660 */
/* fill the author_id column in books table from column id in authors table */
UPDATE books SET author_id=author.id FROM (SELECT * FROM authors) AS author WHERE books.author = author.name;

/*Timestamp: 1606914308550 */
/* double check that the insertion was done correctly*/
SELECT author_id FROM books;