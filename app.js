const express = require('express')
const adminStoreOwner = require('./StoreOwner/admin')

const app = express()

app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//cac request co chua /admin se di den controller admin
app.use('/admin', adminStoreOwner)

const customer = require('./Customer/customer')
app.use('/user',customer)

const { ObjectId } = require('mongodb')

const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('./databaseHandler')

const path = require('path');
const hbs = require('hbs');
const async = require('hbs/lib/async')
const { redirect } = require('express/lib/response')

const partialsPath = path.join(__dirname, "/views/partials");
hbs.registerPartials(partialsPath);

app.set('view engine', 'hbs')
app.set('views', './views');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

app.get('/', async (req, res) => {

    const category = await categories()

    const collectionName = 'Book'
    
    const searchInput = req.query.txtSearch;
    console.log(searchInput)
    if (searchInput){
        const searchPrice = Number.parseFloat(searchInput);
        const dbo = await getDatabase();
        // const result = await dbo.collection(collectionName).find({$or:[{_id:ObjectId(searchInput)},{name: searchInput}, {category: }]});

        const book = await dbo.collection(collectionName).find(
            {
                $or: [
                    { _id: { $regex: searchInput, $options: "$i" } },
                    { name: { $regex: searchInput, $options: "$i" } },
                    { price: { $regex: searchInput, $options: "$i" } },
                    { price: searchPrice },

                ]
            }

        ).toArray();

        console.log(book)
        // await changeIdToCategoryName(products, dbo);
        
        
        res.render('index', { category: category, books:book })
        

    }

    else{
        const books = await getAllDocumentsFromCollection(collectionName)
        res.render('index', { category: category, books:books })

    }   

})

app.get('/login', async (req, res) => {


    const category = await categories()
   
    res.render('login', { category: category })

})

app.post('/login', async(req,res)=>{
    const email = req.body.txtEmail
    
    const password = req.body.password
    
    const dbo = await getDatabase();
    const user = await dbo.collection('Customer').findOne({$and: [{email: email}, {password: password}]});

    console.log(user)
    
    if(!user){
        res.render('login', {err: "User dose not exist or wrong password."})
        return
    }
    else {
        res.cookie('userId', user._id)
        res.redirect('/user')
    }
    
})

// app.get('/search', async (req, res) => {

//     const searchInput = req.query.txtSearch;
//     const searchPrice = Number.parseFloat(searchInput);


//     const collectionName = 'Book'
//     const dbo = await getDatabase();
//     // const result = await dbo.collection(collectionName).find({$or:[{_id:ObjectId(searchInput)},{name: searchInput}, {category: }]});

//     const books = await dbo.collection(collectionName).find(
//         {
//             $or: [
//                 { _id: { $regex: searchInput, $options: "$i" } },
//                 { name: { $regex: searchInput, $options: "$i" } },
//                 { price: { $regex: searchInput, $options: "$i" } },
//                 { price: searchPrice },

//             ]
//         }

//     ).toArray();
//     // await changeIdToCategoryName(products, dbo);
//     res.render('index', { books: books })

// })

// async function requiresLogin(req,res,next){
//     console.log(req.cookies)
//     if(req.cookies.userId){
//         return next()
//     }else{
//         res.redirect('/login')
//     }

//     var dbo = await getDatabase();
//     const user = await dbo.collection('Customer').findOne({_id: ObjectId(req.cookies.userId)});

//     if(!user){
        
//         res.redirect('/login')
//         return;
//     }

//     next();
    
// }

app.get('/register', async (req, res) => {
    const category = await categories()
   
    res.render('register', { category: category })

})

app.get('/product', async (_req, res) => {

    const collectionName = 'Products'
    const dbo = await getDatabase();
    const products = await getAllDocumentsFromCollection(collectionName);
    await changeIdToCategoryName(products, dbo);

    res.render('product', { products: products })
})

app.get('/category', async (_req, res) => {

    const collectionName = 'Category'

    const category = await getAllDocumentsFromCollection(collectionName);

    res.render('category', { category: category })
})

app.post('/register', async(req,res)=> {
    const fullName = req.body.txtName
    const email = req.body.txtEmail
    const password = req.body.txtPassword
    const rePassword = req.body.txtRePassword
    const phone = req.body.txtPhone
    const address = req.body.txtAddress
    const date = req.body.txtDate.toString()

    const newUser = {fullName: fullName, email: email, password:password, phoneNumber: phone,
    dateOfBirth: date, address:address}

    var collectionName = 'Customer'
    await insertObjectToCollection(collectionName, newUser)

    res.redirect('/')

})

app.get('/cart', async (req, res) => {
    const category = await categories()
    

    res.render('cart', { category: category })

})


app.get('/shoppingCart', async (req, res) => {
    const category = await categories()

    res.render('shoppingCart', {category: category})

})

app.get('/proDetail', async (req, res) => {
    const id = req.query.id

    console.log(id)

    const dbo = await getDatabase();
    const product = await dbo.collection('Book').findOne({_id: ObjectId(id)});
    console.log(product)
    
    const category = await categories()
    res.render('proDetail', {category: category, product:product})

})

// app.get('/search', async (req, res) => {

//     res.render('search')

// })

app.get('/delete', async (req, res) => {
    const id = req.query.id
    const collectionName = 'Products'
    const db = await getDatabase()
    const result = await db.collection(collectionName).findOne({ _id: ObjectId(id) })

    const products = await getAllDocumentsFromCollection(collectionName);
    await changeIdToCategoryName(products, dbo);

    console.log(result.price);
    var err2 = "Product cannot be deleted when price is greater than 10"
    if (result.price >= 10) {
        console.log(result.price);
        res.render("product", {err2: err2, products:products})
        return
    } else {
        await deleteProduct(collectionName, id)
        console.log("Id of Product to delete is:" + id)
        res.redirect("/product")
    }

})

app.get('/deleteCategory', async (req, res) => {
    const id = req.query.id

    const collectionName = 'Category'
    await deleteProduct(collectionName, id)
    console.log("Id  of Category to delete is:" + id)
    res.redirect("/category")
})

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now()  + '.jpg')
//     }
// })

// var upload = multer({ storage: storage })

app.post('/insertP', async (req, res) => {

    const productName = req.body.txtName
    const productCategory = req.body.category
    const productPrice = req.body.txtPrice
    const productDescription = req.body.txtDescription
    const productImg = req.body.txtImage

    const collectionName = 'Products'
    const categories = await getAllDocumentsFromCollection('Category')

    if (productName === "" || productCategory === "" || productPrice === "" || productImg === "") {
        const errorMessage = "Value cannot be empty! Please try again!"
        const oldValues = {
            name: productName, category: productCategory, price: productPrice,
            description: productDescription, image: productImg
        }
        res.render('insertP', { error: errorMessage, oldValues: oldValues, categories: categories })
        return;
    }

    if (isNaN(productPrice) == true) {

        const errorMessage = "Price must be number!"
        const oldValues = {
            name: productName, category: productCategory, price: productPrice,
            description: productDescription, image: productImg
        }
        res.render('insertP', { error2: errorMessage, oldValues: oldValues, categories: categories })
        return;
    }

    if (!productImg.startsWith("https://") && !productImg.startsWith("http://")) {
        const errorMessage = "URL image must start with: https://"
        const oldValues = {
            name: productName, category: productCategory, price: productPrice,
            description: productDescription, image: productImg
        }
        res.render('insertP', { error3: errorMessage, oldValues: oldValues, categories: categories })
        return;
    }
    var confirmInsert = "Insert product successfully "
    try {

        const newP = {
            name: productName, category: productCategory, price: Number.parseFloat(productPrice),
            description: productDescription, image: productImg
        }
        await insertObjectToCollection(collectionName, newP);
    } catch (error) {

        confirmInsert = "Product Insert failed";
    }
    res.render('insertP', { confirmInsert: confirmInsert, categories: categories })

})

app.post('/insertCategory', async (req, res) => {

    const categoryName = req.body.txtName
    const categoryImg = req.body.txtImage

    if (categoryName === "" || categoryImg === "") {
        const errorMessage = "Value cannot be empty! Please try again!"
        const oldValues = {
            name: categoryName, image: categoryImg
        }
        res.render('insertCat', { error: errorMessage, oldValues: oldValues })
        return;
    }

    if (!categoryImg.startsWith("https://") && !categoryImg.startsWith("http://")) {
        const errorMessage = "URL image must start with: https:// OR http://"
        const oldValues = {
            name: categoryName, image: categoryImg
        }
        res.render('insertCat', { error3: errorMessage, oldValues: oldValues })
        return;
    }
    const dbo = await getDatabase();
    const collectionName = 'Category'
    const query = await dbo.collection(collectionName).findOne({ name: categoryName })

    if (query != null) {
        const errorMessage = "Duplicate category name"
        const oldValues = {
            name: categoryName, image: categoryImg
        }
        res.render('insertCat', { duplicate: errorMessage, oldValues: oldValues })
        return;
    }
    var confirmInsert = "Insert category successfully"
    try {
        const newCat = {
            name: categoryName, image: categoryImg
        }
        const result = await dbo.collection(collectionName).insertOne(newCat)
        console.log("The newly category inserted id value is: ", result.insertedId.toHexString());
    } catch (error) {

        confirmInsert = "Category Insert failed";
    }

    res.render('insertCat', { confirmInsert: confirmInsert })

})

// app.post('/search', async (req, res) => {

//     const searchInput = req.body.txtSearch;
//     const searchPrice = Number.parseFloat(searchInput);


//     const collectionName = 'Products'
//     const dbo = await getDatabase();
//     // const result = await dbo.collection(collectionName).find({$or:[{_id:ObjectId(searchInput)},{name: searchInput}, {category: }]});

//     const products = await dbo.collection(collectionName).find(
//         {
//             $or: [
//                 { _id: { $regex: searchInput, $options: "$i" } },
//                 { name: { $regex: searchInput, $options: "$i" } },
//                 { price: { $regex: searchInput, $options: "$i" } },
//                 { price: searchPrice },

//             ]
//         }

//     ).toArray();
//     await changeIdToCategoryName(products, dbo);
//     res.render('search', { products: products })

// })




app.post('/searchCat', async (req, res) => {

    const searchInput = req.body.txtSearch;

    const collectionName = 'Category'
    const dbo = await getDatabase();
    // const result = await dbo.collection(collectionName).find({$or:[{_id:ObjectId(searchInput)},{name: searchInput}, {category: }]});
    console.log(searchInput);
    const categories = await dbo.collection(collectionName).find(
        {
            $or: [

                { name: { $regex: searchInput, $options: "$i" } },
            ]
        }

    ).toArray();

    res.render('searchCat', { categories: categories })

})

app.get('/searchCat', async (_req, res) => {

    res.render('searchCat')
})

app.get('/insertP', async (_req, res) => {

    const collectionName = 'Category'
    const categories = await getAllDocumentsFromCollection(collectionName)
    res.render('insertP', { categories: categories })

})

app.get('/insertCategory', async (_req, res) => {


    res.render('insertCat')

})

app.post('/edit', async (req, res) => {
    const id = req.body.txtId;

    const productName = req.body.txtName
    const productCategory = req.body.category
    const productPrice = req.body.txtPrice
    const productDescription = req.body.txtDescription
    const productImg = req.body.txtImage

    const collectionName = 'Products'



    const newvalues = {
        $set: {
            name: productName, category: productCategory, price: Number.parseFloat(productPrice),
            description: productDescription, image: productImg
        }

    }
    await updateCollection(id, collectionName, newvalues);

    console.log("Update product successfully ");

    res.redirect('/product')

})

app.get('/edit', async (req, res) => {
    const id = req.query.id

    const collectionName = "Products";
    const productToEdit = await getDocumentById(collectionName, id);

    const dbo = await getDatabase();
    const categories = await dbo.collection('Category').find({}).toArray()
    res.render('edit', { product: productToEdit, categories: categories })

})

app.post('/editCat', async (req, res) => {
    const id = req.body.txtId;

    const productName = req.body.txtName
    const productImg = req.body.txtImage

    const myquery = { _id: ObjectId(id) }

    const newvalues = {
        $set: { name: productName, image: productImg }

    }
    const dbo = await getDatabase();
    await dbo.collection('Category').updateOne(myquery, newvalues)

    console.log("Update category successfully ");

    res.redirect('/category')

})

app.get('/editCategory', async (req, res) => {
    const id = req.query.id

    const collectionName = "Category";
    const categoryToEdit = await getDocumentById(collectionName, id);

    res.render('editCat', { category: categoryToEdit })

})


async function categories() {
    const collectionName = 'Category'
    const category = await getAllDocumentsFromCollection(collectionName)
    return category
}

async function changeIdToCategoryName(products, dbo) {
    const count = products.length;

    for (let i = 0; i < count; i++) {
        const category = await dbo.collection('Category').findOne({ _id: ObjectId(products[i].category) });
        products[i].category = category.name;
    }
}

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)



