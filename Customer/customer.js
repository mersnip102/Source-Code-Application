const express = require('express')

const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')
router.use(express.static('public'))
const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')

const cookieParser = require('cookie-parser')
router.use(cookieParser())


const session = require('express-session')
router.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))
// var requireAuth = require('../middlewares/auth_middleware')

var totalProduct = 0;

router.get('/', requireAuth, async (req, res) => {
    const category = await categories()
    const collectionName = 'Book'
    const books = await getAllDocumentsFromCollection(collectionName)
    console.log(totalProduct)
    res.render('user', { category: category, books:books, totalProduct:totalProduct })

})

router.get('/proDetail', async (req, res) => {
    const id = req.query.id

    const dbo = await getDatabase();
    const product = await dbo.collection('Book').findOne({_id: ObjectId(id)});
    
    const categoryProduct = await CategoryProduct(product.categoryId);
    console.log(categoryProduct)
    const category = await categories()
    
    res.render('userProDetail', {category: category, product:product, categoryProduct: categoryProduct, totalProduct:totalProduct})

})


router.get('/shoppingCart', requireAuth, async (req, res) => {
    const category = await categories();

    const cart = req.session["cart"]

    const dbo = await getDatabase();
    const collectionName = 'Book'
    
    //Mot array chua cac san pham trong gio hang
    let purchasedProduct = []
    //neu khach hang da mua it nhat 1 sp
    if(cart){
        const dict = req.session["cart"]

        let totalPro
        let totalBill
        
        for(var key in dict) {
            let book = await dbo.collection(collectionName).findOne({_id: ObjectId(key)});
            let category = await CategoryProduct(book.categoryId)
            totalPro= book.price * dict[key]}
            totalBill += totalBill
            purchasedProduct.push({name: book.name, category: category.name, img: book.imgURL, price: book.price, quantity: dict[key], totalProduct: totalPro, totalBill: totalBill})
         }
    

    res.render('shoppingCart', {category: category, totalProduct:totalProduct, purchasedProduct: purchasedProduct})
    

})


router.post('/shoppingCart',requireAuth, async (req, res)=>{
    const product = req.body.idProduct.toString()
    var quantity = parseInt(req.body.quantity)
    totalProduct += quantity
    //lay gio hang trong session
    
    let cart = req.session["cart"]
    
    //chua co gio hang trong session, day se la sp dau tien
    if(!cart){
        let dict = {}
        dict[product] = quantity
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }else{
        dict = req.session["cart"]
        //co lay product trong dict
        var oldProduct = dict[product]
        //kiem tra xem product da co trong Dict
        if(!oldProduct)
            dict[product] = quantity
        else{
            dict[product] = Number.parseInt(oldProduct) + quantity
        }
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }
    const idProduct = req.body.idProduct
    
    // totalProduct = 0;
    
    // for (let key in (req.session["cart"])) {
    //     totalProduct += req.session["cart"][key]
    // }

    

    res.redirect('/user/proDetail?id='+idProduct);
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

async function requireAuth(req,res,next) {
    var id = req.cookies.userId
    console.log(id)
    if(!req.cookies.userId) {
        res.redirect('/login');
        return;
    }
    const dbo = await getDatabase();

    var user = await dbo.collection('Customer').findOne({_id: ObjectId(id)});

    if(!user){
        res.redirect('/login');
        return;
    }

    next();

}
module.exports = router