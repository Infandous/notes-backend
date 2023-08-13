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
    /*const id = Number(request.params.id)
    const note = notes.find(note=>note.id === id)
    note ? response.json(note) : response.status(404).end()*/
    Note.findById(request.params.id).then(note=>{
        response.json(note)
    })
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

    if (body.content===undefined){
        return response.status(400).json({error: "content missing"})
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save().then(savedNote=>{
        response.json(savedNote)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

