const express = require("express")
const connectTODb=require("./database/databaseConnection.js")
const app = express() 
const Blog= require("./views/model/blogmodel.js")

connectTODb()

app.use(express.json())
app.use(express.urlencoded ({extended :true}))

app.set('view engine','ejs')

app.get("/",(req,res)=>{
    
    res.send("<h1>huhu, this is home page</h1>")
})

app.get("/about",(req,res)=>{
    const name = "Md Astafar alam"
    res.render("about.ejs",{name})
})

app.get("/create",(req,res)=>{
    res.render("create.ejs")
})

app.post("/create",(req,res)=>{
    console.log(req.body)
    res.send("post hit")
})

app.post("/create",async(req,res)=>{
    const{title,subtitle,description}=req.body
    console.log(title,subtitle,description)

  await Blog.create({
        title,
        subtitle,
        description
    })
    res.send("Blog created sucessfully")
    

})
app.listen(3000,()=>{
    console.log("Nodejs project has started at port" + 3000)
})
