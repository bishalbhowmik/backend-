
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();


const app = express();


//middleware
app.use(cors());
app.use(express.json());




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})


app.listen(3001, () => {
    console.log("Server is running")
})

app.get('/', (req, res) => {
    res.send('Server is running 3001')
})

//// Database

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@project1.ee2s1rz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {

        const database = client.db('personDb');
        const personCollection = database.collection('personInfo');


        app.post('/upload', upload.single('file'), async (req, res) => {

            const user = req.file;
            const result = await personCollection.insertOne(user);
            console.log('person', req.file);
            res.send(result);


        })

        app.get('/upload', async(req, res) => {
            const query = {};
            const users = await personCollection.find(query).toArray();
            res.send(users);
        })

        console.log('Database connected');

    } finally {

    }
}
run().catch(console.dir);

















