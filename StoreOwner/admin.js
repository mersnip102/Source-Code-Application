const express = require('express')
const { insertObject } = require('../databaseHandler')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('admin/adminIndex')
})

router.get('/addUser',(req,res)=>{
    res.render('addUser')
})
router.get('/managerCustomer', (req,res)=>{
    res.render("admin/managerCustomer")
})
router.get('/login', (req,res)=>{
    res.render("admin/login")
})

router.get('/editproduct', (req,res)=> {
    res.render('admin/managerBook/editProduct')
})
module.exports = router; 