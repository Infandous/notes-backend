const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connection to', url)

mongoose.connect(url)
    .then(result=>{
        console.log('connected to MongoDB')
    })
    .catch(err=>{
        console.log('error connecting to MongoDB:',err.message)
    })

const noteSchema = new mongoose.Schema({
    content:String,
    important:Boolean,
})

noteSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('notes',noteSchema)