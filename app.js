const express = require('express')
const bp = require('body-parser')
const session = require('express-session')
const mysql = require('mysql')
const hash = require('password-hash')
const db = mysql.createConnection({
    host:'localhost',
    database : 'login',
    user : 'root',
    password:'',
    multipleStatements : true    
})
const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(bp.urlencoded({extended:true}))
app.use(bp.json())
app.use(session({
    secret:'anonymous',
    resave:true,
    saveUninitialized:true
}))

app.get('/home',(req,res)=>{
    if(req.session.masuk){
        res.render('hom')
    }else{
        res.json({status:'ANDA HARUS LOGIN'})
    }
})

app.get('/keluar',(req,res)=>{
    req.session.masuk = false
    res.redirect('/')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login',(req,res)=>{
    var data={
        email : req.body.email,
        pw : req.body.pass
    }
    var sql = 'SELECT * FROM users WHERE email  = ?'
    db.query(sql,data.email,(err,hasilSelek)=>{        
        for (let i = 0; i < hasilSelek.length; i++) {                                
        var koreksi_password = hash.verify(data.pw , hasilSelek[i].pw)
        console.log(data.pw +" + "+hasilSelek.pw);        
        if(koreksi_password){
            req.session.masuk = true
            console.log("DATA BENAR");
            res.redirect('/home')
        }else{
            console.log("DATA SALAH");
            res.redirect('/')
        }
    }
    })
})

app.post('/daftar',(req,res)=>{
    var dataDaftar = {
        email : req.body.ml,
        pw :  hash.generate(req.body.pw)
    }
    var sql = "SELECT * FROM users WHERE email ?"
    db.query(sql,dataDaftar.email,(err,hasil)=>{
        if(hasil){
            console.log("sudah ada");
        }
        else{
            var masuk = "INSERT INTO users SET ?"
            db.query(masuk,dataDaftar,(err,sukses)=>{
                res.redirect('/')
            })
        }
    })
})

app.listen(port, () => console.log(`SERVER BERJALAN PADA PORT 3000`))