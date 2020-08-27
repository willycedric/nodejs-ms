const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json()); 
const events = [];

app.post('/events',  (req, res) => {
    const event = req.body;
    events.push(event);
    //post service
     axios.post("http://posts-clusterip-srv:4000/events", event); 
     //comment service
     axios.post("http://comments-clusterip-srv:4001/events", event);
    //query service
     axios.post("http://queries-clusterip-srv:4002/events", event);
     //Moderation
     axios.post("http://moderations-clusterip-srv:4003/events", event);
 
    res.send({status: 'OK'})

});

app.get('/events', (req, res) => {
    console.log(JSON.stringify(events, null, 4));
    res.send(events);
});

app.listen(4005, ()=>{
    console.log("Event Bus is listening on 4005");
});
