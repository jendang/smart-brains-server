const express = require('express')
const bodyParser = require('body-parser')
//const bcrypt = require('bcrypt-nodejs')
//const hash = bcrypt.hashSync();
const cors = require('cors')

const app = express()

app.use(bodyParser.json())  // always at the beginning
app.use(cors()) // to connect w fe

/* routes in backend
    /signin POST
    /signup POST
    /user/:id GET
    /image PUT
*/

const database = {
    users: [
        {
            id: "123",
            name: 'jenny',
            email: 'jenny@test.com',
            password: "test",
            entries: 0,
            joined: new Date()
        },
        {
            id: "456",
            name: 'hope',
            email: 'hope@test.com',
            password: "test",
            entries: 0,
            joined: new Date()
        }
    ],
    /* login: [
        {
            id: 123,
            has: '',
            email: 'jenny@test.com'
        }
    ] */
}

app.get('/', (req, res) => {
    res.json(database.users)
})

app.get('/users/:id', (req, res) => {
    //const  id  = Number(req.params.id) // in case id is integer
    const  {id}  = req.params
    let found = false
    database.users.forEach(user => {
        if(user.id === id ){
            found = true
            return res.json(user)
        }
    })
    if(!found)
        return res.status(404).json("user not found")
})

app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    /* bcrypt.compare("test", '$2a$10$h38iWCo68aI3clY0ZLhcpOqcMbggdVQTHrhJJYZvY2S6L7Thd6JYO', function(err, res) {
       console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$h38iWCo68aI3clY0ZLhcpOqcMbggdVQTHrhJJYZvY2S6L7Thd6JYO', function(err, res) {
        console.log('second guess', res)
    }); */
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0])
    } else {
        res.status(400).json("error logging in")
    }
})

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body
    /* bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash)
    }); */

    database.users.push({
        id:'789',
        name: name,
        email: email,
        // password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.put('/image', (req, res) => {
    const {id}  = req.body
    let found = false
    database.users.forEach(user => {
        if(user.id === id ){
            found = true
            user.entries ++
            return res.json(user.entries)
        }
    })
    if(!found)
        return res.status(404).json("user not found")
})

app.listen(4000, () => console.log('App is running on port 4000'))