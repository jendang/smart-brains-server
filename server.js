const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

/* routes in backend
    /signin POST
    /signup POST
    /user/:id GET
    /image PUT
*/

const database = {
    users: [
        {
            id: 123,
            name: 'jenny',
            email: 'jenny',
            password: "test",
            entries: 0,
            joined: new Date()
        },
        {
            id: 456,
            name: 'hope',
            email: 'hope@test.com',
            password: "test",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/users', (req, res) => {
    res.json(database.users)
})

app.get('/users/:id', (req, res) => {
    const  id  = Number(req.params.id) // in case id is integer
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
    console.log(database.users[0].email)
    console.log(req.body)
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success')
    } else {
        res.status(400).json("error logging in")
    }
})

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body
    database.users.push({
        id:'789',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.post('/image', (req, res) => {
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



app.listen(3000, () => console.log('App is running on port 3000'))