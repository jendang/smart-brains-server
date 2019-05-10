const handleUserProfile = (req, res, db) => {
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
}

module.exports = {
    handleUserProfile
}