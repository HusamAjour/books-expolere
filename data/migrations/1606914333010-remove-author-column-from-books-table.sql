
/*Timestamp: 1606914333010 */
/* after adding coumn author_id and filling it up with data, there is no need for column authors in books table, so this query will delete that column */
ALTER TABLE books DROP COLUMN author;