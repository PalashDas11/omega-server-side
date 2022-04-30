const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxwjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
   try{
    await client.connect();
    const inventoryCollecttion = client.db("groceryStore").collection("inventory");
    const inventory = {name:"Mahiya Mahi", email: "mahiya@gmail.com"};
    const result = await inventoryCollecttion.insertOne(inventory);
    console.log(`user id ${result.insertedId}`);

   }
   finally{
    //    await client.close(); 
   }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running grocery server ')
});

app.listen(port, () => {
  console.log("crud server is running" ,port);
});
