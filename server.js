const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const app = express()

app.use(bodyParser.json())  // always at the beginning
app.use(cors()) 

//connect db
const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'secret',
      database : 'postgres'
    }
});

app.get('/users/:id', (req, res) => {
    const  {id}  = req.params
    db
        .select('*')
        .where({id})
        .from('users')
        .then(user => {
            if(user.length){
                res.json(user[0])
            }else {
                res.status(404).json("user not found")
            }
        })
        .catch(err => res.status(400).json(err))
})

app.post('/signin', (req, res) => {
    db
        .select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid){
                return db
                        .select('*')
                        .from('users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password);
    db
        .transaction(trx => {
            trx.insert({
                hash,
                email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register'))
})

app.put('/image', (req, res) => {
    const {id}  = req.body
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json("unable to count entries"))
})

app.listen(4000, () => console.log('App is running on port 4000'))