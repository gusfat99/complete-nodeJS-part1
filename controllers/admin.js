const Product = require('../models/product');

exports.addProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle : "Add Product", 
        path : '/admin/add-product',
        editing : false
    });
}

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new Product(null,title, imageUrl, price, description);
    req.user.createProduct({
        title : title,
        imageUrl : imageUrl,
        price : price,
        description : description
    })
    .then(result => {
        console.log(result);
        console.log('Product Created');
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
    // product
    // .save()
    // .then(() => {
    // })
    // .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    // Product.findAll()
    req.user.getProducts()
        .then(products => {
            res.render("admin/products", {
                pageTitle : "Admin Shop", 
                prods : products, 
                path : '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect("/");
    }
    const productId = req.params.productId;

    // Product.findByPk(productId)
    req.user.getProducts({where :{ id: productId}})
    .then(products => {
        const product = products[0];
        res.render("admin/edit-product", {
            pageTitle : "Edit Product", 
            path : '/admin/products',
            editing : editMode,
            product : product
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const titleUpdate = req.body.title;
    const imageUrlUpdate = req.body.imageUrl;
    const priceUpdate = req.body.price;
    const descriptionUpdate = req.body.description;

    Product.findByPk(prodId)
        .then(product => {
            product.title = titleUpdate;
            product.imageUrl = imageUrlUpdate;
            product.price = priceUpdate;
            product.description = descriptionUpdate;
            return product.save();
        }).then(() => {
            console.log("Successful Updated");
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err));
    
    // const updateProduct = new Product(prodId, titleUpdate, imageUrlUpdate, priceUpdate, descriptionUpdate);
    // updateProduct.save();
};


exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log("Successful Deleted product");
            res.redirect("/admin/products");
        }).catch(err => console.log(err));

    // Product.deleteProduct(id);
};




