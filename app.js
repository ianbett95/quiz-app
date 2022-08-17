import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const users = [
  {
    name: "jina la mtu",
    email: "jiia@gmail.com",
    password: "password",
  },

  {
    name: "jina la mtu",
    email: "jiia@gmail.com",
    password: "password",
  },

  {
    name: "toddler",
    email: "tod@gmail.com",
    password: "$2b$10$aXeP3DGib.0qM.dXYk98BuLNf80hWVhQBmPrzdfvRAmS7Zy1F8QrK",
  },
  {
    name: "user",
    email: "user@test.com",
    password: "$2b$10$g6Mpv5XrJ3mNFG6ZmCs3beVVUb7YIbE63ztrwyKkZij35qE.thW7G"
  
  },
];
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
    let userExists = users.find((account) => account.email === user.email);

    if (userExists) {
      let message = "account already exists with the email provided";
      res.render("signup", { error: true, message: message, user: user });
    } else {
      //create account
      bcrypt.hash(user.password, 10, (error, hash) => {
        (user.password = hash), res.send(user);
      });
    }
  } else {
    let message = "password/confirm password mismatch";
    res.render("signup", { error: true, message: message, user: user });
  }
});

//landing page
app.get("/", (req, res) => {
  res.render("index");
});

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
  // validation
  let userExists = users.find((account) => account.email === user.email);
  if (userExists) {
    bcrypt.compare(user.password,userExists.password, (error,passwordMatches)=>{
      if(passwordMatches){
        res.send('grant access')
      }else{
        let message ='Incorrect password'
        res.render('login',{error:true,message:message,user:user})
      }
    })
  } else {
    let message = "account does not exist please create one";
    res.render("login", { error: true, message: message, user: user });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT} ...`);
});
