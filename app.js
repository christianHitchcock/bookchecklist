const express = require("express");
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const app = express();
const date = require("./date.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("static"));

mongoose.connect("mongodb+srv://hitchcock:Techismybestfriend@cluster0.she8wm2.mongodb.net/bookchecklist");


const bookSchema = {
  name:String
};

const Book = mongoose.model('Book', bookSchema);

const book1 = new Book ({
  name:"Welcome to your Book list!"
});


const defaultItems = [book1];

let day = date.getDay();
let userName = "";


app.route("/") 
  .get((req,res) =>{
    res.render("list");
  })

  .post((req, res) => {
    userName = req.body.name;
    res.redirect("/checklist");
  })




app.route("/checklist")

  .get( async (req, res) => { 
  
    try {
      const foundItems = await Book.find({ });
      if (foundItems.length === 0) {
        Book.insertMany(defaultItems).then(()=>{
        console.log("Sucessfully saved items to database");
      }).catch((err)=>{
        console.log(err);
      });
        res.redirect("/checklist")
      }else {
        res.render("checklist", {listTitle:day, newListItems:foundItems,userName: userName});
      }

    } catch (err) {
      console.log(err);
    }
  })

  .post((req, res) => {
    const bookname = req.body.newItem;

    const books = new Book({
         name : bookname
      })
       books.save();
    res.redirect("/checklist");
    
  });


app.post("/delete", function(req, res){
  const checkedbookId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === day ){
    deleteCheckedItem();
  }else{
    
    deleteCustomItem();
  }
 
  async function deleteCheckedItem(){
    await Book.deleteOne({_id : checkedbookId});
    res.redirect("/checklist");
  }
 
  async function deleteCustomItem(){
    await List.findOneAndUpdate(
      {name : listName},
      {$pull : {items : {_id : checkedItemId} }}
      );
    res.redirect("/home"+ listName);
  }
});

 app.post("/home" ,function(req,res){
  res.redirect("/");
 })




app.listen(3000, function(){
  console.log("Server started on port 3000");
});
