const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const app = express();

app.use(bodyparser.json());
const {json} = require('body-parser');

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'tiketkonser'
});

conn.connect(function(err){
    if (err) throw err;
    console.log("MySQL connected......")
});

app.get('/listkonser', function(req, res) {
    console.log('Menerima GET request /listkonser');
    let sql = "SELECT * FROM listkonser";
    let query = conn.query(sql, function(err, result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.post('/batalkonser', function(req, res) {
    console.log('POST request /batalkonser');
    let email = req.body.email;
    let namakonser = req.body.namakonser;
    let password = req.body.password;
    
    let deleteKonserQuery = "DELETE FROM listkonser WHERE namakonser = ? AND email = ? AND password = ?";
    let deleteKonserParams = [namakonser, email, password];
    
    conn.query(deleteKonserQuery, deleteKonserParams, function(error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send("Gagal menghapus data konser.");
      } else {
        if (results.affectedRows > 0) {
            console.log("Berhasil menghapus data konser.");
            res.status(200).send("Berhasil menghapus data konser.");
          } else {
            console.log("Data tidak ditemukan.");
            res.status(200).send("Data tidak ditemukan.");
          }
      }
    });
});

app.put('/editkonser', function(req,res){
    console.log('PUT request /editkonser');
    let genre = {genre: req.body.genre};
    let namakonser = {namakonser: req.body.namakonser};
    let email = {mail: req.body.email};
    let password = {pass: req.body.password};
    let tiketbiasa = {biasa: req.body.tiketbiasa};
    let tiketVIP = {VIP: req.body.tiketVIP};

    let sql = "UPDATE listkonser SET genre='"+genre.genre+"', email='"+email.mail+"', password='"+password.pass+"', biasa='"+tiketbiasa.biasa+"', VIP='"+tiketVIP.VIP+"' WHERE namakonser='"+namakonser.namakonser+"'";
    let query = conn.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Gagal Mengedit Data");
      } else {
        if (result.affectedRows > 0) {
            console.log("Berhasil Mengedit Data");
            res.status(200).send("Berhasil Mengedit Data");
          } else {
            console.log("Data tidak ditemukan.");
            res.status(200).send("Data tidak ditemukan.");
          }
      }
    })
});

app.post('/tambahkonser', function(req,res){
    console.log('POST request /tambahkonser');
    let genre = {genre: req.body.genre};
    json.getString
    let namakonser = {namakonser: req.body.namakonser};
    let email = {mail: req.body.email};
    let password = {pass: req.body.password};
    let tiketbiasa = {biasa: req.body.tiketbiasa};
    let tiketVIP = {VIP: req.body.tiketVIP};
    let check = "SELECT genre FROM listkonser WHERE genre ='"+genre.genre+"'";

    let checker = conn.query(check, (err, checkresult)=>{
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : checkresult
            }
        ));
        console.log(checkresult);
        if (checkresult == ""){
            let sql = "INSERT INTO listkonser (genre, namakonser, email, password, biasa, VIP) VALUES ('"
                      +genre.genre+"','"+namakonser.namakonser+"','"+email.mail+"','"+password.pass+"','"+tiketbiasa.biasa+"','"+tiketVIP.VIP+"')";
            let query = conn.query(sql, (err, result) =>{
                console.log(JSON.stringify(
                    {
                        "status" : 200,
                        "error" : null,
                        "response" : result
                    }
                ));
                conn.query(check, (err, checkresult) => {
                    console.log(JSON.stringify(
                        {
                            "status" : 200,
                            "error" : null,
                            "response" : checkresult
                        }
                    ));
                });
                res.send("Penambahan Berhasil")
            });
        }
        else {
            res.send("Penambahan Gagal")
        }
    })
})

app.post('/registeruser', function(req,res){
    console.log('POST request /registeruser');
    let username = {user: req.body.username};
    json.getString
    let email = {mail: req.body.email};
    let password = {pass: req.body.password};
    let check = "SELECT iduser FROM user WHERE username ='"+username.user+"'";

    let checker = conn.query(check, (err, checkresult)=>{
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : checkresult
            }
        ));
        console.log(checkresult);
        if (checkresult == ""){
            let sql = "INSERT INTO user (username, password, email) VALUES ('"+username.user+"','"+password.pass+"','"+email.mail+"')";
            let query = conn.query(sql, (err, result) =>{
                console.log(JSON.stringify(
                    {
                        "status" : 200,
                        "error" : null,
                        "response" : result
                    }
                ));
                conn.query(check, (err, checkresult) => {
                    console.log(JSON.stringify(
                        {
                            "status" : 200,
                            "error" : null,
                            "response" : checkresult
                        }
                    ));
                });
                res.send("Register Berhasil")
            });
        }
        else {
            res.send("Register Gagal")
        }
    })
})

app.post('/loginuser', function(req,res){
    console.log("POST request /loginuser");
    let username = {user: req.body.username};
    json.getString    
    let password = {pass: req.body.password};
    let sql = "SELECT iduser, username FROM user WHERE username='"+username.user+"' AND password = '"+password.pass+"'";
    console.log(sql)
    let query = conn.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
        } else {
          if (result.length > 0) {
            res.status(200).json({ status: 200, error: null, response: 'Login Berhasil' });
          } else {
            res.status(401).json({ status: 401, error: 'Unauthorized', response: 'Login Gagal' });
          }
        }
      });
    });

app.post('/registeradmin', function(req,res){
    console.log('POST request /registeradmin');
    let adminname = {adminname: req.body.adminname};
    json.getString
    let emailadmin = {mail: req.body.emailadmin};
    let password = {pass: req.body.password};
    let check = "SELECT idadmin FROM admin WHERE adminname ='"+adminname.adminname+"'";

    let checker = conn.query(check, (err, checkresult)=>{
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : checkresult
            }
        ));
        console.log(checkresult);
        if (checkresult == ""){
            let sql = "INSERT INTO admin (adminname, password, emailadmin) VALUES ('"+adminname.adminname+"','"+password.pass+"','"+emailadmin.mail+"')";
            let query = conn.query(sql, (err, result) =>{
                console.log(JSON.stringify(
                    {
                        "status" : 200,
                        "error" : null,
                        "response" : result
                    }
                ));
                conn.query(check, (err, checkresult) => {
                    console.log(JSON.stringify(
                        {
                            "status" : 200,
                            "error" : null,
                            "response" : checkresult
                        }
                    ));
                });
                res.send("Register Berhasil")
            });
        }
        else {
            res.send("Register Gagal")
        }
    })
})

app.post('/loginadmin', function(req,res){
    console.log("POST request /loginadmin");
    let adminname = {adminname: req.body.adminname};
    json.getString    
    let password = {pass: req.body.password};
    let sql = "SELECT adminname FROM admin WHERE adminname='"+adminname.adminname+"' AND password = '"+password.pass+"'";
    console.log(sql)
    let query = conn.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
        } else {
          if (result.length > 0) {
            // res.status(200).json({ status: 200, error: null, response: 'Login Berhasil' });
            res.send("Login Berhasil");
          } else {
            res.status(401).json({ status: 401, error: 'Unauthorized', response: 'Login Gagal' });
          }
        }
      });
    });


app.get('/listpesan', function(req, res) {
    console.log('Menerima GET request /listpesan');
    let sql = "SELECT * FROM pesan";
    let query = conn.query(sql, function(err, result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.post('/pesan', function(req, res) {
    console.log('POST request /pesan');
    let namalengkap = req.body.namalengkap;
    let email = req.body.email;
    let nomorhp = req.body.nomorhp;
    let namakonser = req.body.namakonser;
    let jenistiket = req.body.jenistiket;
  
    let checkKonserQuery = "SELECT * FROM listkonser WHERE namakonser = ?";
    let checkKonserParams = [namakonser];
  
    conn.query(checkKonserQuery, checkKonserParams, (err, checkKonserResult) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error checking the availability of the concert.");
      } else {
        if (checkKonserResult.length > 0) {
          let checkQuery = "SELECT namalengkap FROM pesan WHERE namalengkap = ?";
          let checkParams = [namalengkap];
  
          conn.query(checkQuery, checkParams, (err, checkResult) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error checking the data.");
            } else {
              if (checkResult.length === 0) {
                let kodetiket = Math.floor(Math.random() * 10000) + 1;
  
                let insertQuery = "INSERT INTO pesan (namalengkap, email, nomorhp, namakonser, jenistiket, kodetiket) VALUES (?, ?, ?, ?, ?, ?)";
                let insertParams = [namalengkap, email, nomorhp, namakonser, jenistiket, kodetiket];
  
                conn.query(insertQuery, insertParams, (err, result) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send("Error inserting the data.");
                  } else {
                    console.log(JSON.stringify({
                      "status": 200,
                      "error": null,
                      "response": result
                    }));
  
                    res.send("Data Masuk, Kode tiket anda = " + kodetiket);
                  }
                });
              } else {
                res.send("Data Tidak Masuk");
              }
            }
          });
        } else {
          res.send("Nama konser tidak tersedia.");
        }
      }
    });
  });

app.listen(7000);
console.log('server berjalan di port 7000')