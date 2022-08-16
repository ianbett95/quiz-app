import express from "express";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const users = [
    {
        name:'jina la mtu',
        email:'jiia@gmail.com',
        password:'password'
    
    },

    {
        name:'jina la mtu',
        email:'jiia@gmail.com',
        password:'password'
    }


];

// process the signup form
app.post("/signup", (req, res) => {
  const user = {
    name: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword:req.body.confirmPassword
  };
  if(user.password === user.confirmPassword){
   

  }else{
    let message= 'password/confirm password mismatch'
    res.render('signup',{error:true,message:message,user:user})
  }


  console.log(user);
  res.send("user account sucessfully created");
});

//landing page
app.get("/", (req, res) => {
  res.render("index");
});

//display login page
app.get("/login", (req, res) => {
  res.render("login");
});

//display signup page

app.get("/signup", (req, res) => {
   const user = {
    name: '',
    email: '',
    password: '',
    confirmPassword:''
}
    res.render('signup',{error:false,user:user})
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT} ...`);
});
