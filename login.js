const express = require("express");
const app = express();
const mysql = require("mysql2");
const ejs = require("ejs");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'mobidoc',
  user: 'Agam',
  password: 'AgamD@07'
});
// d1 patients name dname doctors name
var details="";
var d1;
var dname="";
var p_phonenumber="";
app.get('/', (req, res) => {
  res.render('login.ejs',{d:details});
});

app.post('/', (req, res) => {
  let a = req.body.name;
  let b = req.body.tel;
  let c = req.body.pswd;
  let d = req.body.member;
  d = d.toLowerCase();
  let isValid = true;
  p_phonenumber=b;
  if (d === 'patient') {
    connection.query(
      `SELECT * FROM patients WHERE name = ? AND phonenumber = ? AND password = ?`,
      [a, b, c],
      function(err, results) {
        if (err) {
          console.error(err);
        } else {
          if (results.length === 0) {
            isValid = false;
          } else {
            console.log("Patient "+a+" Entered");
          }
        }
        if (isValid) {
          d1=a;
          res.render('patient.ejs',{d:"Welcome " + a,d1:d1});
        } else {
          details="Invalid Details";
          res.redirect('/');
        }
      }
    );
  } else if (d === 'doctor') {
    connection.query(
      `SELECT * FROM doctors WHERE name = ? AND phonenumber = ? AND password = ?`,
      [a, b, c],
      function(err, results) {
        if (err) {
          console.error(err);
        } else {
          if (results.length === 0) {
            isValid = false;
          } else {
            console.log("Doctor Entered");
          }
        }

        if (isValid) {
          dname=a;
          res.render('doctor.ejs',{msg:"Welcome onBoard " + a,k:"Dr."+a});
        } else {
          details="Invalid details"
          res.redirect('/');
        }
      }
    );
  } else {
    res.send("Please select the correct member type: Doctor or Patient");
    res.render('login.ejs');
  }
});

app.get('/closed',(req,res)=>{
  let o1=req.query.button;
  connection.query(
    `update doctors set status=? where name=?`,
    [o1,dname],
      function(err,results)
      {
        if(err)
        {console.log(err);}
        else
        {
          console.log(results);
        }
      }
  );
  res.send("Clinic is " + o1 +" now");
});
app.get('/newuser', (req, res) => {
  res.render('signup.ejs');
});
// var p_phonenumber;
app.post('/newuser', (req, res) => {
  let a = req.body.name1;
  let b = req.body.tel1;
  let c = req.body.pswd1;
  // p_phonenumber=b;
  connection.query(
    `INSERT INTO patients(name, phonenumber, password) VALUES (?, ?, ?)`,
    [a, b, c],
    function(err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("Entry for "+ a + " created");
      }
    }
  );
  res.send("Thanks " + a + " for Registering");
  res.render('patient.ejs')
});


app.post('/city', (req, res) => {
  var cityname = req.body.cit;
  let naam = [];
  let sp = [];
  let open = [];
  
  connection.query(
    'SELECT name, speciality, status FROM doctors WHERE city = ?',
    [cityname],
    function(err, results) {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        res.render('patient.ejs', { d: "Oops! No doctors available", d1: d1 });
        console.log("Length = 0");
      } else {
        for (var i = 0; i < results.length; i++) {
          naam.push(results[i].name);
          sp.push(results[i].speciality);
          open.push(results[i].status);
        }
        res.render('appoint.ejs', { names: naam, special: sp, d1: d1, open: open });
        console.log(results);
      }
    }
  );
});


app.get('/account', (req, res) => {
  let doctname = [];
  let symptoms = [];
  let datev = [];

  connection.query(
    `SELECT doctorsname, symptoms, Dateofvisit FROM history WHERE patientname = ?`,
    [d1],
    function(err, results) {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < results.length; i++) {
          doctname.push(results[i].doctorsname);
          symptoms.push(results[i].symptoms);
          datev.push(results[i].Dateofvisit);
        }
        console.log(results);
        res.render('account.ejs', { x: doctname, y: symptoms, z: datev, d1: d1 });
      }
    }
  );
});

app.get('/account1', (req, res) => {
  let patname = [];
  let symptoms = [];
  let datev = [];

  connection.query(
    `SELECT patientname, symptoms, Dateofvisit FROM history WHERE doctorsname = ?`,
    [dname],
    function(err, results) {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < results.length; i++) {
          patname.push(results[i].patientname);
          symptoms.push(results[i].symptoms);
          datev.push(results[i].Dateofvisit);
        }

        console.log(results);
        res.render('dhistory.ejs', { x: patname, y: symptoms, z: datev, dname: dname });
      }
    }
  );
});

var dov;
app.get('/appoint', (req, res) => {
  let dov1 = new Date();
  dov = dov1;
  dname=req.query.value;
  console.log(req.query.value);
  res.render('book.ejs', { dname: dname, d1: d1, dov: dov });
});

app.get('/done', (req, res) => {
  let dn = dname;
  let pn = d1;
  let sym = req.query.symptom;
  let age = req.query.p_age;
  let ct = req.query.value;
  
  connection.query(
    `SELECT COUNT(?) AS count FROM history`, [ct],
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      
      const countValue = results[0].count;
      
      if (countValue <= 4) {
        const dov = new Date();
        
  
        
        connection.query(
          `INSERT INTO history (doctorsname, patientname, age, symptoms, Dateofvisit, p_phonenumber,slot) VALUES (?, ?, ?, ?, ?, ?,?)`,
          [dn, pn, age, sym, dov, p_phonenumber,ct],
          function(err, results) {
            if (err) {
              console.log(err);
              return;
            }
            
            console.log(results);
          }
        );
        
      } else {
        res.send("Time slot not available");
      }
    }
  );
  res.send("Thanks for booking. "+" Your slot is " + ct);
});


app.listen(4015, () => {
  console.log("Server started");
});
