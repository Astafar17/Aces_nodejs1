
const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogModel")

const app = express() 
// const multer = require("./middleware/multerConfig").multer
// const storage = require("./middleware/multerConfig").storage

const {multer,storage} = require('./middleware/multerConfig') 
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
    const name = "MD ASTAFAR ALAM"
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


app.get("/editBlog/:id",(req,res)=>{
    res.render("./blog/editBlog")
})


app.use(express.static("./storage"))

app.listen(3000,()=>{
    console.log("Nodejs project has started at port" + 3000)
})
