const Clarifai = require('clarifai')

const app = new Clarifai.App({
    apiKey: 'b9a8ed341183472b90520b9da5aa9cbb'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('Unable to use API'))
}


const handleEntriesCount = (req, res, db) => {
    const {id}  = req.body
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json("unable to count entries"))
}

module.exports = {
    handleEntriesCount,
    handleApiCall
}