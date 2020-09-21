var express = require('express')
var shortid = require('shortid')

var db = require("../lowdb")

var router = express.Router()

router.get('/', function (req, res, next) {
    var books = db.get('books').value()
    res.render('books/index', {
        books: books
    })
})

router.get('/create', function (req, res, next) {
    res.render('books/create')
})
router.post('/create', function (req, res, next) {
    var reqBook = req.body.nameBook
    db.get('books').push({
        id: shortid.generate(),
        name: reqBook
    }).write()
    res.redirect('/books')
})

router.get('/search?', function (req, res, next) {
    var name = req.query.name
    name ? name = name.toLowerCase() : name = ''
    var books = db.get('books').value()
    var resultFind = books.filter(function (book) {
        book = book.name.toLowerCase()
        return book.includes(name) === true
    })
    res.render('books/index', {
        books: resultFind,
        value: req.query.name
    })
})

router.get('/:id', function (req, res, next) {
    var id = req.params.id
    var book = db.get('books').find({ id: id }).value()
    res.render('books/info', {
        id: id,
        name: book.name
    })
})

router.get('/:id/delete', function (req, res, next) {
    var id = req.params.id
    db.get('books').remove({ id: id }).write()
    res.redirect('/books')
})

module.exports = router