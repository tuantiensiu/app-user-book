var express = require('express')
var shortid = require('shortid')

var db = require("../lowdb")

var router = express.Router()

router.get('/', function (req, res, next) {
    var users = db.get('users').value()
    res.render('users/index', {
        users: users
    })
})

router.get('/create', function (req, res, next) {
    res.render('users/create')
})
router.post('/create', function (req, res, next) {
    var name = req.body.name
    db.get('users').push({
        id: shortid.generate(),
        name: name
    }).write()
    res.redirect('/users')
})

router.get('/search?', function (req, res, next) {
    var name = req.query.name
    name ? name = name.toLowerCase() : name = ''
    var users = db.get('users').value()
    var resultSearch = users.filter(function (user) {
        user = user.name.toLowerCase()
        return user.includes(name) === true
    })
    res.render('users/index', {
        users: resultSearch,
        inputSearch: req.query.name
    })
})

router.get('/:id', function (req, res, next) {
    var id = req.params.id
    var user = db.get('users').find({ id: id }).value()
    res.render('users/info-user', {
        user: user
    })
})

router.get('/:id/delete', function (req, res, next) {
    var id = req.params.id
    db.get('users').remove({ id: id }).write()
    res.redirect('/users')
})

router.get('/:id/edit', function (req, res, next) {
    var id = req.params.id
    var user = db.get('users').find({ id: id }).value()
    res.render('users/edit-user', {
        user: user
    })
})
router.post('/:id/edit', function (req, res, next) {
    var id = req.params.id
    var name = req.body.name
    db.get('users').find({ id: id }).assign({ name: name }).write()
    res.redirect('/users')
})

module.exports = router