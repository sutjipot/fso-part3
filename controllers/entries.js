const entryRouter = require('express').Router()
const Entry = require('../models/note')


// get all
entryRouter.get('/', (req, res) => {
    Entry.find({}).then(entries => {
        res.json(entries)
    })
})


// get info
entryRouter.get('/info', (req, res) => {   
    Entry.find({}).then(entries => {
        res.send(`<p> Phonebook has info for ${entries.length} people </p> <p>${Date()}</p>`)
    })
})


// get single entry
entryRouter.get('/:id', (req, res, next) => {
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


// delete entry
entryRouter.delete('/:id', (req, res) => {
    Entry
    .findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()})
    .catch(error => next(error))
    })


// add entry
entryRouter.post('/', (req, res, next) => {
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


// update entry
entryRouter.put('s/:id', (req, res, next) => {
    const {name, number} = req.body
    Entry
    .findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
  })


module.exports = entryRouter
