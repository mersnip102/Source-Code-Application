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

router.post('/add',(req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass= req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role:role,
        password: pass
    }

    insertObject("User",objectToInsert)
    res.render('admin/adminIndex')
})
module.exports = router;