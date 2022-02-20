const express = require('express')

const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')

const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')

router.get('/', async (req, res) => {
    const category = await categories()
    const collectionName = 'Book'
    const books = await getAllDocumentsFromCollection(collectionName)
    res.render('user', { category: category, books:books })

})

async function categories() {
    const collectionName = 'Category'
    const category = await getAllDocumentsFromCollection(collectionName)
    return category
}
module.exports = router