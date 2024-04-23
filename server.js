require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Entry = require('./models/note')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postData'))
app.use(cors())


morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'no such id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}




if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


// GET ALL ENTRIES
app.get('/api/persons', (req, res) => {
  Entry.find({})
  .then(result => {
    res.json(result)
  })
})

// GET INFO
app.get('/info', (request, response) => {
  Entry.find({}).then(persons => {
      response.send(`<p> Phonebook has info for ${persons.length} people </p> <p>${Date()}</p>`)
  })
})


// GET SINGLE ENTRY BY ID
app.get('/api/persons/:id', (req, res) => {
    Entry
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person) }
      else {
        res.status(404).end()
      } 
    })
    .catch(error => next(error))
})


// DELETE ENTRY
app.delete('/api/persons/:id', (req, res) => {
    Entry
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()})
    .catch(error => next(error))
    })


// ADD ENTRY
app.post('/api/persons', (req, res) => {
    const body = req.body

    if(body.name === undefined || body.number === undefined) {
        return res.status(400).json({
            error: 'name or number  is missing'
        })
    } else {
        const person = new Entry({
          id: Math.floor(Math.random() * 10000000000),
          name: body.name,
          number: body.number
        })

          person.save()
          .then(savedPerson => {
              res.json(savedPerson)
          })}
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// UPDATE ENTRY
app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number 
    }

    Entry
    .findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`running on ${PORT}`)
})