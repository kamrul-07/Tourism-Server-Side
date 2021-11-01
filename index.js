const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const express=require ('express');
require('dotenv').config();
const cors = require("cors")

const app = express();
const port = process.env.PORT || 8000;


app.use (cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.int5l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log("connected");
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orderPerson');


        app.get('/services',async(req,res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post ('/addnewService',(req,res) =>{
           servicesCollection.insertOne(req.body).then ((result) => {
              res.send(result.insertedId);
           })
        })

        app.delete ("/deleteService/:id",async (req,res ) =>{
            const id = req.params.id;
            const quary = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(quary);
           
            res.json(result)

        })

        app.get ('/singleService/:id',async(req,res) =>{
            const id = req.params.id;
           console.log(req.params.id);
           const quary=({_id:ObjectId(id)})
           const result = await servicesCollection.findOne(quary);
           console.log(result);
           res.json (result)
       
        })


        app.put('/update/:id',async(req,res) =>{
            const id =req.params.id;
            const update= req.body;
            const filter={_id:ObjectId(id)};

          servicesCollection.updateOne(filter,{
                $set:{
                    name:update.name,
                    price:update.price,
                    img:update.img,
                    description:update.description
                }
            }
            )
            .then((result) => {
                res.send (result);
            });

        })

        app.post ('/addToCart',(req,res) =>{
            ordersCollection.insertOne(req.body).then((result) => {
                res.json(result);
            })
        })


        app.get('/myOrders/:email',async (req,res) =>{
            const result =await ordersCollection.find({email:req.params.email}).toArray();
            res.send(result);
        })
       

        

    

    
    }
    
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send ("Enjoy the travel")
})

app.listen(port, ()=>{
    console.log("server running");
})
