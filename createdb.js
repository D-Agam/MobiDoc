const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'mobidoc',
    user: 'Agam',
    password: 'AgamD@07'
  });

connection.query(
  `CREATE TABLE IF NOT EXISTS patients (
    id integer auto_increment primary key,
    name varchar(40) not null,
    phonenumber varchar(12) not null,
    password varchar(15) not null
  )`,
  function(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.log("Success");
    }
    connection.close();
  }
);
