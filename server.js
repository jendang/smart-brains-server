const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controller/register')
const signin = require('./controller/signin')
const profile = require('./controller/profile')
const entries = require('./controller/entries')
const imageApi = require('./controller/entries')

const app = express()

app.use(bodyParser.json())  // always at the beginning
app.use(cors()) 

//connect db
const db = knex ({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
});

app.get('/', (req, res) => res.json('It is working!'))

app.get('/users/:id', (req, res) => {
    profile.handleUserProfile(req, res, db)
})

app.post('/signin', (req, res) => {
    signin.handleSignIn (req, res, db, bcrypt)
})

app.post('/signup', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt)
})

app.put('/image', (req, res) => {
    entries.handleEntriesCount(req, res, db)
})

app.post('/imageurl', (req, res) => {
    imageApi.handleApiCall(req, res)
})

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`App is running on port ${port}`))