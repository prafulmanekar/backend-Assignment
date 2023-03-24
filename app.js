const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
// const { urlencoded } = require('body-parser');
const port = 3000;

const app = express()
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://praful:praful@cluster0.2lbenfg.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error',console.log.bind(console,"connection error"));
db.on("open",function(){
    console.log("connected to mongodb")
})

const eventSchema = new mongoose.Schema({
    titel: {
        type:String,
        required: true,
        maxLength: 100
    },
    description:{
        type:String,
        required:true,
        maxLength:500
    }
   ,
   location:{
    type:String,
    required:true,
    maxLength:100
   } ,
   startTime:{
    type:Date,
    require:true
   },
   endTime:{
    type:String,
    required:true
   },
});

const Event = mongoose.model('Event', eventSchema);

app.post('/events',async(req,res)=>{
    try{
        const event = new Event(req.body);
        await event.save();
        res.status(281).json(event);
    }catch(err){
        res.status(400).json({error: err.message})
    }
});

app.get('/events',async(req,res)=>{
    // res.send("hello")
    try{
        const events = await Event.find();
        res.status(200).json(events);
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

app.get('/events/"id',async(req,res) =>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({error: "Event not found"});
        }
        res.status(200).json(event);
    }catch(err){
        res.status(500).json({error: err.message})
    }
});

app.put('/events/:id', async(req,res)=>{
    try{
        const event = await Event.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
        });
        if(!event){
            return res.status(404).json({error: "Event not found"})
        }res.status(200).json(event);
    }catch(err){
        res.status(400).json({error:err.message})
    }
});

app.delete('/events/:id',async(req,res)=>{
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event){
            return res.status(400).json({error: "Event not found"})
        }res.status(200).json(event)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

app.put('/events/:id',async(req,res)=>{
    const eventId = req.params.id;
    const {title, description, location, startTime,endTime} = req.body;

    const errors = validateEventFields(title, description,location,startTime,endTime);
    if(errors.length > 0){
        return res.status(400).json({error: 'validation error: ' + errors.json(', ') });
    }

    try{
        const updateEvent = await Event.findByIdAndUpdate(
            eventId,{
                title,
                description,
                location,
                startTime,
                endTime,
            },
            {new: true}
        );
        if(!updateEvent){
            return res.status(404).json({error: 'There is no event with that id'});

        }
        res.json(updateEvent);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'})
    }
})







app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
