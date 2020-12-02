/*Timestamp: 1606913347640*/
/* Create a new database named lab14 */
CREATE DATABASE lab14;

/*Timestamp: 1606913481298 */
/* use the queries that are in file schema.sql which will create new table books */
psql -f /data/schema.sql -d lab14


/*Timestamp: 1606913569036 */
/* make sure the table books has been created */
SELECT COUNT(*) FROM books;

/*Timestamp: 1606913610934 */
/* use the queries that are in file seed.sql which will fill table books with data*/
psql -f data/seed.sql -d lab14







