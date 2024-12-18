const { MongoClient } = require('mongodb')
require('dotenv').config();


let dbConnection;
let uri = process.env.CONNECTION_STRING;

module.exports = {
    // in ths we create a connection to db
    connectToDb : (cb) =>{
        // this is to connect to local database
        //this is whe working on localhost.
        // const connection = MongoClient.connect('mongodb://localhost:27017/bookstore') //This is async and  it returns a promise
        const connection = MongoClient.connect(uri) //This is async and  it returns a promise
        .then((client) =>{
            dbConnection = client.db();
            return cb() // cb (callback) // runs after success or failure of connection attempt
        })
        .catch((err) => { // smart to pass err as arg
            console.log(err);
            return cb(err);
        } )
    },
    // in this we return the above created connection
    getDb : () => dbConnection // returns variable dbConnection since no {} are used
}