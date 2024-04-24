const mongoose = require('mongoose')


const entrySchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true},
    number: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d{6,}$/.test(v);
        },
      message: props => `${props.value} is not a valid phone number!`
      },
    required: true}
})


entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entry', entrySchema)
