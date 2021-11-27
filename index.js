const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { request } = require('express');
const app = express();
const port = process.env.PORT || 5000;

//mydb01

//Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydb01:mydb01@cluster0.tkr6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("tourPlanner");
        const services = database.collection("services");
        const tourPlan = database.collection("tourPlan");
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = services.find({});
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await services.findOne(query);
            console.log('Load services', id);
            res.send(result);
        })
        app.get('/allplan', async (req, res) => {
            const cursor = tourPlan.find({});
            const all = await cursor.toArray();
            res.send(all);
        })
        // app.get('/allplan/:email', async (req, res) => {
        //     const cursor = tourPlan.find({}, { email });
        //     const all = await cursor.toArray();
        //     res.send(all);
        // })
        // POST API
        app.post('/services', async (req, res) => {
            const newServices = req.body;
            const result = await services.insertOne(newServices)
            console.log('New User', req.body);
            console.log('added user', result);
            res.json(result);
        });
        app.post('/tourPlan', async (req, res) => {
            const newPlan = req.body;
            const result = await tourPlan.insertOne(newPlan)
            console.log('New User', req.body);
            console.log('added user', result);
            res.json(result);
        });

        //Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await services.deleteOne(query);
            console.log('deleting..', result);
            res.json(result);
        })
        app.delete('/allplan/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourPlan.deleteOne(query);
            console.log('deleting..', result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Server....');
});
app.listen(port, () => {
    console.log('Running Port ', port);
})