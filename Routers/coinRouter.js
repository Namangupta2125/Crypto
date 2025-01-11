const path = require('path')
const router = require('express').Router();
const {getStat,getDeviation} = require(path.join(__dirname,'..','Controllers','coinController'))

router.get('/stats',getStat)
router.get("/deviation", getDeviation);


module.exports = router