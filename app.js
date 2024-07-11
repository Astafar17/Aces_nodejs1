const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogModel")
const bcrypt = require('bcrypt')
const app = express() 
// const multer = require("./middleware/multerConfig").multer
// const storage = require("./middleware/multerConfig").storage

const {multer,storage} = require('./middleware/multerConfig') 
const User = require("./model/userModel")
const upload = multer({storage : storage})

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.set('view engine','ejs')

app.get("/home",async (req,res)=>{
    const blogs = await Blog.find() // always returns arrray 
    res.render("./blog/home",{blogs})
})

app.get("/about",(req,res)=>{
    const name = "MD Astafar Alam"
    res.render("about.ejs",{name})
})
app.get("/createblog",(req,res)=>{
    res.render("./blog/createBlog")
})

app.post("/createblog",upload.single('image') ,async (req,res)=>{
    // const title = req.body.title 
    // const subtitle = req.body.subtitle 
    // const description  = req.body.description 
    const fileName = req.file.filename
    const {title,subtitle,description} = req.body 
    console.log(title,subtitle,description)

   await Blog.create({
        title, 
        subtitle , 
        description, 
        image : fileName
    })

    res.send("Blog created successfully")
})

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("./blog/singleBlog",{blog})
})

app.get("/deleteblog/:id",async (req,res)=>{
    const id = req.params.id 
    await Blog.findByIdAndDelete(id)
    res.redirect("/")
})


app.get("/editBlog/:id",async (req,res)=>{
    const id = req.params.id
    // const {id} = req.params 
  const blog =   await Blog.findById(id) 
    res.render("./blog/editBlog",{blog})
})

app.post("/editBlog/:id",async (req,res)=>{
    const id = req.params.id 
    const {title,subtitle,description} = req.body 
    await Blog.findByIdAndUpdate(id,{
        title : title, 
        subtitle : subtitle, 
        description : description
    })
    res.redirect("/blog/" + id)
})

app.get("/register",(req,res)=>{
    res.render("./authentication/register")
})
app.get("/login",(req,res)=>{
    res.render("./authentication/login")
})

app.post("/register",async (req,res)=>{
    const {username,email,password} = req.body 
   await User.create({
        username : username, 
        email : email, 
        password : bcrypt.hashSync(password,12)
    })
    res.redirect("/login")
})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body 
  const user = await User.find({email : email})

  if(user.length === 0){
    res.send("Invalid email")
  }else{
    // check password now 
    const isMatched = bcrypt.compareSync(password,user[0].password)
    if(!isMatched){
        res.send("Invalid password")
    }else{
        res.send("logged in successfully")
    }
  }

})

app.use(express.static("./storage"))

app.listen(3000,()=>{
    console.log("Nodejs project has started at port" + 3000)
})