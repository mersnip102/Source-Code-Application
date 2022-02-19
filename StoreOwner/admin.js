const express = require('express')
const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')

const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')

    // var bodyParser = require("body-parser");
    // const { Router } = require('express');
    // router.use(bodyParser.urlencoded({ extended: false }));
    
    // var publicDir = require('path').join(__dirname,'/public');
    // router.use(express.static(publicDir));
    
    // //npm i handlebars consolidate --save
    // router.engine('hbs',engines.handlebars);
    // router.set('views','./views');
    // router.set('view engine','hbs');
    
    // var MongoClient = require('mongodb').MongoClient;
    // var url = 'mongodb+srv://quangnhgch190628:quang1409@cluster0.c1irk.mongodb.net/test';
    
    // router.get('/admin',async function(req,res){
    //     let client= await MongoClient.connect(url);
    //     let dbo = client.db("ASM2");
    //     let results = await dbo.collection("ASM2").find({}).toArray();
    //     res.render('index',{products:results});
    // })
    
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
router.get('/statusOrder', (req,res)=>{
    res.render("admin/statusOrder")
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
module.exports = router;