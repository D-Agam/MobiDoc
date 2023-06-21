const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'mobidoc',
    user: 'Agam',
    password: 'AgamD@07'
  });

connection.query(
  `CREATE TABLE IF NOT EXISTS history (
    id integer auto_increment primary key,
    doctorsname varchar(20) not null,
    patientname varchar(20) not null,
    symptoms varchar(20) not null,
    Dateofvisit date not null
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
