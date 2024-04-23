
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://kentomomodi:${password}@cluster0.0suzebe.mongodb.net/fsopart3?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

const add = (name, number) => {
    const entry = new Entry({
        name: name,
        number: number,
    })

    entry.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

const list = () => {    
    Entry
        .find({})
        .then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
        })

        mongoose.connection.close()
        })
}


if (name && number) {
    add(name, number)
} else {
    list()
}