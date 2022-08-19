import express from "express";
import session from 'express-session'
import bcrypt from "bcrypt";
import mysql from "mysql"

const app = express();
 
const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'users'
})

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
//prepare to use session
app.use(session({
  secret:'majibu',
  saveUninitialized:false,
  resave:true
}))
//continually check if user is logged in
app.use((req,res,next)=>{
  if (req.session.userID===undefined) {
    res.locals.isLoggedIn=false
    res.locals.username = 'Guest'
  } else {
    res.locals.isLoggedIn=true
    res.locals.username=req.session.username
  }
  next()

  
})

//display signup page

app.get("/signup", (req, res) => {
  const user = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  res.render("signup", { error: false, user: user });
});

// process the signup form
app.post("/signup", (req, res) => {
  const user = {
    name: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  if (user.password === user.confirmPassword) {
    //check if user exists
     
    let sql = 'SELECT * FROM student WHERE email = ?'
    connection.query(
      sql,[user.email],(error,results)=>{
        if(results.length>0){
           let message = "account already exists with the email provided";
           res.render("signup", { error: true, message: message, user: user });
        }else{
          bcrypt.hash(user.password,10,(error,hash)=>{
            let sql = 'INSERT INTO student(email,name,password) VALUES(?,?,?)'
            connection.query(
              sql,
              [
                user.email,
                user.name,
                hash
              ],
              (error,results)=>{
                res.send('account successfully created')
              }
              
            )
          })
        }
      }
    )
  

    
    } else {
       let message = "password/confirm password mismatch";
       res.render("signup", { error: true, message: message, user: user});
    }  
    
});

//landing page
app.get("/", (req, res) => {
  res.render("index");
});
//dashboard
app.get('/dashboard',(req,res)=>{
  if (res.locals.isLoggedIn) {
    res.render('dashboard')
  } else {
    res.redirect('/login')
  }
})

//display login page
app.get("/login", (req, res) => {
  const user = {
    email: "",
    password: "",
  };
  res.render("login", { error: false, user: user });
});

//process login form
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let sql='SELECT* FROM student WHERE email=?'
  connection.query(
   sql,[user.email], 
   (error,results) => {
    if (results.length>0) {
      bcrypt.compare(
        user.password,
        results[0].password,
        (error, passwordMatches) => {
          if (passwordMatches) {
            req.session.userID =results[0].s_id
            req.session.username=results[0].name.split(' ')[0]
            res.redirect("/dashboard");
          } else {
            let message = "Incorrect password";
            res.render("login", { error: true, message: message, user: user });
          }
        }
      );
    } else {
      let message = "account does not exist please create one";
      res.render("login", { error: true, message: message, user: user });
    }
   }
  )
  //logout functionality
  app.get('/logout/',(req,res)=>{
    //kill session
    req.session.destroy(()=>{
      res.redirect('/')
    })
  })
  
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT} ...`);
});
