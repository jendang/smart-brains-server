const express = require('express')

const app = express()

/* routes in backend
    /signin POST
    /signup POST
    /profile/:userid
    /image PUT
*/

app.get('/', (req, res) => {
    res.send("this is working")
})


app.listen(3000, () => console.log('App is running on port 3000'))