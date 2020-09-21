var express = require('express')
var shortid = require('shortid')

var db = require("../lowdb")

var router = express.Router()

router.get('/', function (req, res, next) {
    var transactions = db.get('transactions').value()
    res.render('transactions/index', {
        transactions: transactions
    })
})

router.get('/create', (req, res)=>{
  res.render('transactions/create', {
    users: db.get("users").value(),
    books: db.get("books").value(),
  })
});

router.post('/create', (req, res)=>{
  //get user id
  var userId = req.body.userId;
  //get book id
  var bookId = req.body.bookId;
  //push data in table
  db.get('transactions')
    .push({
        id: shortid.generate(),
        userId: userId,
        bookIt: bookId
      })
    .write();
  res.redirect('/transactions');
});

module.exports = router;