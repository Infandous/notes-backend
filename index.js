//const http = require('http')
require('dotenv').config()
const express = require('express')
const app=express()
const cors = require('cors')
const Note = require('./models/note')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const mongoose = require('mongoose')

//do not hardcode password
/*const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@fullstackcluster.ftx3y6g.mongodb.net/noteApp?retryWrites=true&
    w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content:String,
    important:Boolean,
})

noteSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('notes',noteSchema)
*/

let notes = [  
    {    id: 1,    content: "HTML is easy",    important: true  },  
    {    id: 2,    content: "Browser can execute only JavaScript",    important: false  },  
    {    id: 3,    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }
]

app.get('/',(request,response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes',(request,response)=>{
    //response.json(notes)
    Note.find({}).then(notes=>{
        response.json(notes)
    })
    //mongoose.connection.close()
})

app.get('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    const note = notes.find(note=>note.id === id)
    note ? response.json(note) : response.status(404).end()
    //response.json(note)
    /*notes.find({id:id}).then(note=>{
        response.json(note)
    })*/
})

app.delete('/api/notes/:id', (request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note=>note.id!==id)

    response.status(204).end()
})
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n=>n.id))
        :0
        return maxId+1
}
app.post('/api/notes',(request,response)=>{
    const body = request.body
    if (!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})


/*const app = http.createServer((request,response)=>{
    response.writeHead(200,{'Content-Type':'text/plain'})
    response.end(JSON.stringify(notes))
})

const PORT = 3001
app.listen(PORT)
console.log(`server running on ${PORT}`)*/