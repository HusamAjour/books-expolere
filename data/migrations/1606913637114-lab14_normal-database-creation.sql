/*Timestamp: 1606913637114 */
/* create a new database named lab14_normal that is identical to database named lab14*/
CREATE DATABASE lab14_normal WITH TEMPLATE lab14;

/*Timestamp: 1606913887976 */
/* make sure database lab14_normal is correctly created */
SELECT COUNT(*) FROM books;