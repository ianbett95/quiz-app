import express from 'express'


const app =express()


app.set('view engine','ejs')

app.use(express.static('public'))

//landing page
app.get('/',(req,res)=>{
    res.render('index')
})

//display login page
app.get('/login',(req,res)=>{
 res.render('login')
})

//display signup page

app.get('/signup',(req,res)=>{
    res.render('signup')
})

const PORT =process.env.PORT||4000

app.listen(PORT,()=>{
    console.log(`app is running on PORT ${PORT} ...`)
})