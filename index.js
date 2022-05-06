const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
