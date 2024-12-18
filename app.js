const express = require('express');
const { connectToDb, getDb } = require('./db');
const  {ObjectId}  = require('mongodb');

//init app
const app = express();

app.use(express.json());

let db;

connectToDb((err) =>{
    if(! err){
        app.listen(3000,()=>{
            console.log("App listening at port 3000");
        });
        db = getDb();
    }
});



//routes

// app.get('/books',(req,res)=>{
//     let books = []; 

//     // find() and sort() method only returns cursor
//      //cursor is object that points at set of documents outlines by our query.
//      // we can use filter in it
//      // we can use to Array and forEach. These are methods of cursor

//     db.collection('books2') // same as db.books in mongosh
//      .find()
//      .sort({auther : 1})
//      .forEach(book => books.push(book))
//      .then(() => {
//         res.status(200).json(books) // status() return res object again so we can do this.. we could also use .then()
//      })
//      .catch(err => {
//         res.status(500).json({error : "Could not fetch the documents"}) // server error
//      })

//          // res.json({message : "Welcome to Books api"}) // initially route check karne ke liye dala tha.
// });

//Pagination

app.get('/books',(req,res)=>{
    //current page
    let page  = req.query.p || 0; // which page we want to display / current page.
    // if p has exeeded the limit ni books are displayed.
    let booksPerPage = 3;

    let books = []; 


    db.collection('books2')
     .find()
     .sort({auther : 1})
     .skip(page * booksPerPage) // 0th page pe 0 skip, 1 st page pe 3 skip, 4th onwards batao.
     .limit(booksPerPage)
     .forEach(book => books.push(book))  
     .then(() => {
        res.status(200).json(books)
     })
     .catch(err => {
        res.status(500).json({error : "Could not fetch the documents"}) // server error
     });
});

 //:id => route parameter
app.get('/books/:id', (req,res)=>{
    let id = req.params.id;
    // the ObjectId constructor // bson error input must be a 24 character hex string, 12 byte Uint8Array, or an integer
    if(ObjectId.isValid(id)){
        db.collection('books2')
        .findOne({_id : new ObjectId(id)}) 
        .then( doc =>{
            // console.log(doc);
            //if id is valid by syntax but no such record exists then it prints null.
            // you can handle that in front end;; or you can handle that now.
            if( doc == null){
                res.status(404).json({error : "id is valid by syntax but no such record exists"})
            }
            res.json(doc);
        })
        .catch((err)=>{
            res.status(500).json({error : "Could not fetch data"})
        })
    }else{
        res.status(500).json({error : "invalid id"})
    }
});

app.post('/books', (req, res) => {
    const book = req.body;
    // console.log(book);

    db.collection('books2')
    .insertOne(book)
    .then(result => {
        // console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({error : 'could not create a new document',details: err.message})
    })
})

//Delete

app.delete('/books/:id',(req, res) =>{
    let id = req.params.id;
    if(ObjectId.isValid(id)){
        db.collection('books2')
        .deleteOne({_id : new ObjectId(id)})
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(500).json({error : 'Id is valid but No such record found'});
        })
    }else{
        res.status(500).json({error : 'Not a valid id'});
    }
});

//Update/Patch

app.patch('/books/:id', (req,res)=>{
    let id = req.params.id;
    let updates = req.body;
    console.log(updates);
    
    if(ObjectId.isValid(id)){
        db.collection('books2')
        .updateOne({_id : new ObjectId(id)},{$set : updates})
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(500).json({error : 'Id is valid but No such record found'});
        });
    }else{
        res.status(500).json({error : 'Not a valid id'});
    }
});

