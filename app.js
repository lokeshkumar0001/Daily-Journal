require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "READ AND SHARE YOUR STORY WITH US THE WORLD IS HERE TO LISTEN YOUR WONDERFULL HAPPENING. ";
const aboutContent = "This is the site to share story and news anonymously.";
const contactContent = "If any issue with the site them mail me at 'lokeshkrs2001@gmail.com' ";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose 
mongoose.connect("mongodb+srv://admin-lokesh:Test123@cluster0.qunef.mongodb.net/postDB")

const postSchema = new mongoose.Schema({
  title:String,
  content:String
})

//model
const Post = mongoose.model("Post",postSchema);

//home route
app.get("/",(req,res)=>{
  Post.find({},(err,posts) => {
    if(!err){
      res.render("home",{homeStartingContent:homeStartingContent,posts:posts});
    }
  });
  
})

//route with parameters
app.get("/posts/:postId",(req,res)=>{
  const requestedTitle = req.params.postId;

  Post.findOne({_id:requestedTitle},(err,foundPost) => {
    if(err){
      console.log(err);
    }else{
      res.render("post",{
        title: foundPost.title,
        content: foundPost.content
      });
    }
  })    
})

//about
app.get("/about",(req,res)=>{
  res.render("about",{aboutContent:aboutContent});
})

//contact
app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent:contactContent})
})

//get for compose
app.get("/compose",(req,res)=>{
  res.render("compose");
})

//post for compose
app.post("/compose",(req,res)=>{
  
  const newPost = new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  })

  newPost.save((err) => {
    if(err){
      console.log(err);
    }else{
      console.log("successfully saved your post");
      res.redirect("/");
    }
  })
  
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
