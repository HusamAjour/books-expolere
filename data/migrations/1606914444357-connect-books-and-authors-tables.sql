/*Timestamp: 1606914444357 */
/* set the author_id as the foreign key of the books table */
ALTER TABLE books ADD CONSTRAINT fk_authors FOREIGN KEY (author_id) REFERENCES authors(id);