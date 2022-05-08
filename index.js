const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxwjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
   try{
    await client.connect();
    const inventoryCollecttion = client.db("groceryStore").collection("inventory");
    const MyCollecttion = client.db("groceryStore").collection("MyItem");
     
    // Auth 
    app.post('/login',async(req, res) => {
       const user = req.body;
       const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'});
       res.send({accessToken})
    })

    // post my item 
    app.post('/myItem',async (req, res) => {
        const myItem = req.body
        const result = await MyCollecttion.insertOne(myItem)
        res.send(result)
    })
    // get my item api 
    app.get('/myItem', async(req, res) => {
      const query = {};
      const cursor = MyCollecttion.find(query)
      const myItems = await cursor.toArray();
      res.send(myItems)
    })
    app.get('/userItems', async(req, res) => {
      const email = req.query.email;
      console.log(email)
      const query = {email: email};
      console.log(query);
      const cursor = MyCollecttion.find(query)
      const myItems = await cursor.toArray();
      res.send(myItems)
    })

    //delete 
    app.delete('/myItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await MyCollecttion.deleteOne(query);
      res.send(result);
    })


    // get inventory items 
    app.get('/inventory', async(req, res) => {
      const query = {};
      const cursor = inventoryCollecttion.find(query);
      const inventories = await cursor.limit(6).toArray();
      res.send(inventories);
    })
    // add item 
    app.post('/inventory',async(req, res) => {
      const newInventory = req.body;
      const result =await inventoryCollecttion.insertOne(newInventory);
      res.send(result)
    })
    // get inventer single item
    app.get('/InventoryItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await inventoryCollecttion.findOne(query);
      res.send(result);
    })

   //get manage items 
   app.get('/manageItems', async (req, res) => {
       const query = {}
       const cursor = inventoryCollecttion.find(query)
       const manageItems = await cursor.toArray();
       res.send(manageItems)
   })
   // put 
   app.put('/InventoryItem/:id', async(req, res) => {
    const id = req.params.id;
    const updateUser = req.body;
    const filter = {_id:ObjectId(id)}
    console.log("filter", filter);
    const option = {upsert:true};
    const updateDoc ={
      $inc:{ 
        quantity: -1
      }
    }
   
    const result = await inventoryCollecttion.updateOne(filter, updateDoc, option);
    const answer = await inventoryCollecttion.findOne(filter);
    res.send(answer)
    // res.send(result);
  })


  // put 
  app.put('/singleItems/:id', async(req, res) => {
    const id = req.params.id;
    const data = req.body;
    const filter = {_id:ObjectId(id)}
    console.log("filter", filter);
    const option = {upsert:true};
    const updateDoc ={
      $inc:{quantity: Number(data.amount ||0)}
    }
   try{
    const result = await inventoryCollecttion.updateOne(filter, updateDoc, option);
    const answer = await inventoryCollecttion.findOne(filter);
    res.send(answer);
   }
   catch(e) {
     res.send('fail to Update')
   }
    
  })
  
  


  //  delete id 
  app.delete('/InventoryItem/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await inventoryCollecttion.deleteOne(query);
    res.send(result);
  })

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
