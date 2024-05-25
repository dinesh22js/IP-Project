const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017";
const dbname = "ipLab";
const PORT = process.env.PORT || 5014;

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/ipLab", 
{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const bookSchema = new mongoose.Schema({
  bid: String,
  title: String,
  author: String,
  genre: String,
  year_published: Number
});


const Book = mongoose.model('Book', bookSchema);

async function connect() {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbname);
    const books = db.collection('book');

    app.get('/RetrAll', async (req, res) => {
        const data = await books.find({}).toArray();
        res.json({ cont: data });
    });

    app.post('/Insertion', async (req, res) => {
        const { bid, title, author, genre, year_published } = req.body;
        console.log({ bid, title, author, genre, year_published });
        const data = await books.insertOne({ bid, title, author, genre, year_published });
        res.json({ message: "Inserted successfully" });
    });

    app.post('/Updation', async (req, res) => {
        const { bid, title, author, genre, year_published } = req.body;
        console.log({ bid, title, author, genre, year_published });
        const data = await books.updateOne({ bid }, { $set: { title, author, genre, year_published } });
        res.json({ message: "Updated successfully" });
    });

    app.post('/Upd', async (req, res) => {
        const { bid } = req.body;
        console.log({ bid });
        const data = await books.findOne({ bid });
        console.log(data);
        res.json({ cont: data });
    });

    

    app.get('/search', async (req, res) => {
    const { type, term } = req.query;
  
    
    try {
  
      const results = await books.find({ [type]: term }).toArray();
        console.log(results,type,term);
    

      res.json({ results });
    } catch (error) {
      // Handle any errors that occur during the search operation
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  });
  
    app.post('/Deletion', async (req, res) => {
        const { bid } = req.body;
        console.log({ bid });
        const data = await books.deleteOne({ bid });
        res.json({ message: "Deleted successfully" });
    });

    const creds1 = db.collection('credential');
    app.post('/Creds', async (req, res) => {
        const { username, password } = req.body;
        const data = await creds1.findOne({ username });
        console.log(data);
        if (data != null) {
            res.json({ message: "Valid" });
        } else {
            res.json({ message: "InValid" });
        }
    });

    

app.post('/login', async function (req, res) { // Make the route handler asynchronous   
    const { username, password, op } = req.body;
    try {
        var bname;
        if(op === "Stu"){
            bname = 'credential';
        }
        else{
            bname = 'teacher';
        }
        const usersCollection = db.collection(bname);
        const user = await usersCollection.findOne({ username }); 
        var data = 'Logged In Successfully';
        console.log(username,bname,user,op);
        if (!user) { 
            
            res.json({ message:'incorrect username or password'}); // Return empty strings if user not found         
            return;
        }
        if (user.password !== password) {  
            res.json({ message: 'incorrect username or password'}); // Return empty strings if password is incorrect   
            return;
        }    

        res.json({ message: data });
    } catch (error) {
        console.error("Error generating message:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password,op } = req.body;
   
    try {
      // Check if the username already exists
      var bname;
      if(op === "Stu"){
          bname = 'credential';
      }
      else{
          bname = 'teacher';
      }
      const usersCollection = db.collection(bname);
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Insert the new user into the collection
      const newUser = await usersCollection.insertOne({ username, password });

      res.status(201).json({ message: 'Signup successful'});
    } catch (err) {
      console.error("Error signing up:");
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

connect();
app.listen(PORT, () => { console.log("Listening to PORT: ", PORT); });
