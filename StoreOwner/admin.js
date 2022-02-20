const express = require('express')
const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')

const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')
    
router.get('/',(req,res)=>{
    res.render('admin/adminIndex')
})

router.get('/addUser',(req,res)=>{
    res.render('addUser')
})
router.get('/managerCustomer', (req,res)=>{
    res.render("admin/managerCustomer")
})

router.get('/orderDetail', (req,res)=>{
    res.render("admin/orderDetail")
})
router.get('/allOrder', (req,res)=>{
    res.render("admin/allOrder")
})
router.get('/allOrder2', (req,res)=>{
    res.render("admin/allOrder2")
})

router.get('/idOrder', (req,res)=>{
    res.render("admin/idOrder")
})
router.get('/idOrder2', (req,res)=>{
    res.render("admin/idOrder2")
})

router.get('/listUser', (req,res)=>{
    res.render("admin/listUser")
})

router.get('/feedbacks', (req, res) =>{
    res.render('admin/feedbacks')
})
router.get('/updateProfile', (req, res) =>{
    res.render('admin/managerBook/updateProfile')
})

router.post('/addProduct', async (req,res)=>{
    const name = req.body.txtName
    const price= req.body.txtPrice
    const picture= req.body.txtPicture
    const category= req.body.txtCategory
    const author= req.body.txtAuthor
    const description= req.body.txtDescription
    const collectionName = 'Book'
    
    const newP = {
        name: name, price: Number.parseFloat(price)}
        
    await insertObjectToCollection(collectionName, newP);
    const notify = "Add book successful"

    res.render('admin/managerBook/addProduct', {notify: notify})
    })

router.get('/insert',(req,res)=>{
        res.render('newProduct');
    })

router.get('/viewProduct', async (_req, res) => {

        const collectionName = 'Book'
        const dbo = await getDatabase();
        const products = await getAllDocumentsFromCollection(collectionName);
        // await changeIdToCategoryName(products, dbo);
    
        res.render('admin/managerBook/viewProduct', { products: products })
    })

router.get('/addProduct',(req,res)=>{
        res.render('admin/managerBook/addProduct');
    })

router.get('/editproduct', (req,res)=> {
    res.render('admin/managerBook/editProduct')
})
router.get('/addCategories', (req,res)=> {
    res.render('admin/managerBook/addCategories')
})
router.get('/viewCategories', (req,res)=> {
    res.render('admin/managerBook/viewCategories')
})
module.exports = router;