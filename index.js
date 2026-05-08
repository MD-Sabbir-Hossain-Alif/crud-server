require('dotenv').config()

// dns server for mongodb connection
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Cloudflare + Google DNS

const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000

const uri = process.env.MONGO_DB_URI;

app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        await client.connect();

        // Get the database and collection on which to run the operation
        const database = client.db("crud-user-db"); // database/db
        const userCollection = database.collection("users"); // users/userCollection

        // get data from database & data send
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const allValues = await cursor.toArray(); // allValues/result
            res.send(allValues)
        })

        // get data from database & data send by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)

            const query = {
                _id: new ObjectId(id)
            }

            const user = await userCollection.findOne(query)
            res.send(user)
        })

        // add new data into database
        app.post('/users', async (req, res) => {
            const doc = req.body
            // console.log("user to be inserted", doc)

            const result = await userCollection.insertOne(doc);
            res.send(result)
        })

        // update/edit data
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: new ObjectId(id)
            }

            const { name, email, role } = req.body
            console.log(req.body)

            const updateDoc = {
                $set: {
                    name,
                    email,
                    role
                }
            }

            console.log(updateDoc)

            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // delete particular data from database & update
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id

            const query = {
                _id: new ObjectId(id)
            }

            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Hello World It's Sabbir")
})

app.listen(port, () => {
    console.log(`CRUD server running on port ${port}`)
})
