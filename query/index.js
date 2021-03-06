const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

const handleEvent = (type, data)=>{
    if(type == "PostCreated"){
        const { id, title } = data;
        posts[id] = {
            id, title, comments:[]
        };

    }

    if(type === "CommentCreated"){
        const {id, content, postId, status}= data;
        const post = posts[postId];
        post.comments.push({id, content,status});
    }

    if(type === "CommentUpdated"){
        const {postId, status,content, id } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const  {type, data} = req.body;
    handleEvent(type, data)
    res.send({});

});

app.listen(4002, async ()=>{
    const res = await axios.get('http://event-bus-srv:4005/events');
    for(let event of res.data){
       const {type, data} = event
        handleEvent(type, data);
    }
    console.log('Query service is listening on port 4002')
})