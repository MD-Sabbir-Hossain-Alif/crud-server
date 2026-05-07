// dns server for mongodb connection
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Cloudflare + Google DNS

const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000

const uri = `mongodb+srv://CrudServerUser:GwH2aasNBWQFeBeZ@cluster0.theaye1.mongodb.net/?appName=Cluster0`;

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

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const allValues = await cursor.toArray(); // allValues/result
            res.send(allValues)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)

            const query = {
                _id: new ObjectId(id)
            }

            const user = await userCollection.findOne(query)
            res.send(user)
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
