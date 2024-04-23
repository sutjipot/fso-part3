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


// GET ALL ENTRIES
app.get('/api/persons', (req, res) => {
  Entry.find({})
  .then(result => {
    res.json(result)
  })
})

// GET INFO
app.get('/info', (req, res) => {
  Entry.find({}).then(persons => {
      res.send(`<p> Phonebook has info for ${persons.length} people </p> <p>${Date()}</p>`)
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
    .findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()})
    .catch(error => next(error))
    })


// ADD ENTRY
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Entry({
      id: Math.floor(Math.random() * 10000000000),
      name: body.name,
      number: body.number
    })

      person.save()
        .then(savedPerson => {
            res.json(savedPerson) })

        .catch(error => next(error))
})



// UPDATE ENTRY
app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body
  Entry
  .findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
      res.json(updatedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`running on ${PORT}`)
})