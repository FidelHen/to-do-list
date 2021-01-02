const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todo list!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// Routes
app.get("/", function(req, res){

    Item.find({}, function(err, docs){
        if(docs.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sucessfully added!")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: docs});
        }

        
        
    });
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req,res){
    res.render("about");
});

// Posts
app.post("/", function(req, res){

    const item = new Item({
        name: req.body.newItem
    });

    item.save();

    if (req.body.list === "Work") {
        res.redirect("/work");
    } else {
        res.redirect("/");
    }
    
});

app.post("/delete", function(req, res){
    const itemId = req.body.checkbox;
    console.log(itemId);
    Item.findByIdAndRemove(itemId, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("Sucessfully deleted!");
            res.redirect("/");
        }
    });
});

// Server listner
app.listen(3000, function(){
    console.log("Server is running on port 3000"); 
});