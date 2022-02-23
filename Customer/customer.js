const express = require('express')

const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')
router.use(express.static('public'))
const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')

router.get('/', async (req, res) => {
    const category = await categories()
    const collectionName = 'Book'
    const books = await getAllDocumentsFromCollection(collectionName)
    res.render('user', { category: category, books:books })

})

router.get('/proDetail', async (req, res) => {
    const id = req.query.id

    const dbo = await getDatabase();
    const product = await dbo.collection('Book').findOne({_id: ObjectId(id)});
    
    const categoryProduct = await CategoryProduct(product.categoryId);
    console.log(categoryProduct)
    const category = await categories()
    res.render('userProDetail', {category: category, product:product, categoryProduct: categoryProduct})

})

router.get('/shoppingCart', async (req, res) => {
    const category = await categories()

    

    res.render('shoppingCart', {category: category})

})

async function categories() {
    const collectionName = 'Category'
    const category = await getAllDocumentsFromCollection(collectionName)
    return category
}


async function categories() {
    const collectionName = 'Category'
    const category = await getAllDocumentsFromCollection(collectionName)
    return category
}

async function CategoryProduct(category) {
    const collectionName = 'Category'
    const dbo = await getDatabase();
    
    const CategoryProduct = await dbo.collection(collectionName).findOne({_id: ObjectId(category)})
    
    return CategoryProduct
}
module.exports = router