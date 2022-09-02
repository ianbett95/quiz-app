import express from "express";
import session from 'express-session'
import bcrypt from "bcrypt";
import multer from "multer"
import mysql from "mysql"

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
})
const uploads = multer({ dest: 'public/uploads' })



app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
//prepare to use session
app.use(session({
  secret: 'majibu',
  saveUninitialized: false,
  resave: true
}))
//continually check if user is logged in
app.use((req, res, next) => {
  if (req.session.userID === undefined) {
    res.locals.isLoggedIn = false
    res.locals.username = 'Guest'
  } else {
    res.locals.isLoggedIn = true
    res.locals.username = req.session.username
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
      sql, [user.email], (error, results) => {
        if (results.length > 0) {
          let message = "account already exists with the email provided";
          res.render("signup", { error: true, message: message, user: user });
        } else {
          bcrypt.hash(user.password, 10, (error, hash) => {
            let sql = 'INSERT INTO student(email,name,password) VALUES(?,?,?)'
            connection.query(
              sql,
              [
                user.email,
                user.name,
                hash
              ],
              (error, results) => {
                res.redirect('/login')
              }

            )
          })
        }
      }
    )



  } else {
    let message = "password/confirm password mismatch";
    res.render("signup", { error: true, message: message, user: user });
  }

});

//landing page
app.get("/", (req, res) => {
  res.render("index");
});
//dashboard
app.get('/dashboard', (req, res) => {
  if (res.locals.isLoggedIn) {
    res.render('dashboard')
  } else {
    res.redirect('/login')
  }
})
//admin-panel
app.get('/admin',(req,res)=>{
   let sql='SELECT s_id,name,gender,picture,results FROM student JOIN score ON s_id=s_id_fk'
  connection.query(
    sql,(error,results)=>{
      res.render('admin-panel',{students:results})
      console.log(results)
    }
  )
})
//admin login
app.get('/admin-login',(req,res)=>{
  const admin={
    email:'',
    password:''
  }
  res.render('admin-login',{error:false,admin:admin})
})

app.post('/admin/login',(req,res)=>{
  const admin={
    email:req.body.adminEmail,
    password:req.body.adminPassword
  }
  if (admin.email==='admin@test.com') {
    if (admin.password==='test1234') {
      res.redirect('/admin')
    } else {
      let message='incorrect password'
      res.render('admin-login',{error:true,message:message,admin:admin})
    }
  } else {
    let message='unknown email address'
    res.render('admin-login',{error:true,message:message,admin:admin})
  }
})
//results
app.get('/results',(req,res)=>{
  if (res.locals.isLoggedIn) {
    let sql= 'SELECT * FROM score WHERE s_id_fk=?'
    connection.query(
      sql,
      [req.session.userID],
      (error,results)=>{
        let result=results[0]
        connection.query(
          'SELECT * FROM question',
          (error,results)=>{
   res.render("results", { results: result,questions:results});
          }
        )
      }
    )
  } else {
    res.redirect('/login')
  }

})
//questions
app.get('/quiz', (req, res) => {
  if (res.locals.isLoggedIn) {
    //check if done quiz already
    let sql='SELECT*FROM score WHERE s_id_fk=?'
    connection.query(
      sql,[req.session.userID],
      (error,results)=>{
        if (results.length >0) {
          res.redirect('/results')
        } else {
          res.render('quiz')
        }
      }
    )
  } else {
    res.redirect('/login')
  }
})

app.post('/quiz', (req, res) => {
  const choices = []
  const answers = req.body.markingScheme.split(',')
  for (let i = 1; i <= 10; i++) {
    let choice = {
      id: 1,
      yourAnswer: req.body[`q${i}`],
      correctAnswer: answers[i - 1],
      score: 0
    }
    //choices.push(req.body[`q${i}`])
    if (choice.yourAnswer === choice.correctAnswer) {
      choice.score = 1
    }
    choices.push(choice)
  }
  let sql = 'INSERT INTO score (s_id_fk, response,results) VALUES (?,JSON_ARRAY(?),?)'
  connection.query(
    sql,
    [
      req.session.userID,
      [...choices.map(choice => choice.yourAnswer)],
      choices.map(choice => choice.score).reduce((a, b) => a + b)
    ],
    (error, results) => {
      res.redirect('/results')
      console.log(choices)
      console.log(
        choices.map((choice) => choice.score).reduce((a, b) => a + b)
      );
    }
  )
})
//profile
app.get('/profile', (req, res) => {
  if (res.locals.isLoggedIn) {
    let sql = 'SELECT * FROM student WHERE s_id=?'
    connection.query(
      sql, [req.session.userID], (error, results) => {
        res.render('profile', { profile: results[0] })
      }
    )
  } else {
    res.redirect('/login')
  }
});

//edit profile
app.get('/edit-profile', (req, res) => {
  if (res.locals.isLoggedIn) {
    let sql = 'SELECT * FROM student WHERE s_id =?'
    connection.query(
      sql, [req.session.userID], (error, results) => {
        res.render('edit-profile', { profile: results[0] })
      })


  } else {
    res.redirect('/login')
  }
})

app.post('/edit-profile/:id', uploads.single('picture'), (req, res) => {
  if (req.file) {
    let sql = 'UPDATE student SET email = ?,name=?, gender=?, dob= ?,picture=?,contacts =? WHERE s_id=?'
    connection.query(
      sql,
      [
        req.body.email,
        req.body.name,
        req.body.gender,
        req.body.dob,
        req.file.filename,
        req.body.contacts,
        parseInt(req.params.id)
      ],
      (error, results) => {
        res.redirect('/profile')
      }
    )
    // )
  } else {
    let sql = 'UPDATE student SET email = ?,name=?, gender=?, dob= ?,contacts =? WHERE s_id=?'
    connection.query(
      sql,
      [
        req.body.email,
        req.body.name,
        req.body.gender,
        req.body.dob,
        req.body.contacts,
        parseInt(req.params.id)
      ],
      (error, results) => {
        res.redirect('/profile')
      }
    )
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

  let sql = 'SELECT* FROM student WHERE email=?'
  connection.query(
    sql, [user.email],
    (error, results) => {
      if (results.length > 0) {
        bcrypt.compare(
          user.password,
          results[0].password,
          (error, passwordMatches) => {
            if (passwordMatches) {
              req.session.userID = results[0].s_id
              req.session.username = results[0].name.split(' ')[0]
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
  app.get('/logout', (req, res) => {
    //kill session
    req.session.destroy(() => {
      res.redirect('/')
    })
  })

});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is live on PORT ${PORT} ...`);
});
