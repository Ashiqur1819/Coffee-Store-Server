const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zt90y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffees");


    app.get("/coffees", async(req, res) => {
        const cursor = coffeeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get("/coffees/:id", async(req, res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })


    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });


    app.put("/coffees/:id", async(req, res) => {
      const id = req.params.id
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const coffee = req.body;
      const updatedCoffee = {
        $set: {
          name : coffee.name,
          quantity : coffee.quantity,
          supplier : coffee.supplier,
          taste : coffee.taste,
          category : coffee.category,
          details : coffee.details,
          photo : coffee.photo
        },
      };
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
      res.send(result)
    })


    app.delete("/coffees/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffe store server running successfully");
});

app.listen(port, () => {
  console.log(`Coffe store server running on port: ${port}`);
});
