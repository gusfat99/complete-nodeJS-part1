const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render("shop/products-list", {
            pageTitle : "My Shop", 
            prods : products, 
            path : '/products'
        });
        
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    //the first alternative
    // Product.findAll({where : {id : prodId}})
    //     .then(product => {
    //         res.render("shop/product-detail", {
    //             product : product[0],
    //             pageTitle : product[0].title,
    //             path : "/products"
    //         });
    //     })
    //     .catch(err => console.log(err));

    //the second alt
    Product.findByPk(prodId)
        .then(product => {
            res.render("shop/product-detail", {
                product : product,
                pageTitle : product.title,
                path : "/products"
            });
        })
        .catch(err => console.log(err));

    //before using sequelize;
    // Product.getDataById(prodId)
    // .then(([product]) => {
    // })
    // .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render("shop/index", {pageTitle : "My Shop", prods : products, path : '/'});
        })
        .catch(err => console.log(err));
};

exports.carts = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
           return cart.getProducts();
        })
        .then(cartProducts => {
            console.log(cartProducts);
            res.render("shop/cart", {
                pageTitle : "Your Cart",
                path : '/cart',
                cartProducts : cartProducts
            });
        })
        .catch(err => console.log(err));
    // Cart.fetchDataCart(cartData => {
    //     console.log()
    //     const dataProductCart = [];
    //     Product.fetchAllData(products => {
    //         for(product of products) {
    //             const cartItem = cartData.products.find(prod => +prod.id === +product.id);
    //             if(cartItem) {
    //                 dataProductCart.push({productData : product, qty : cartItem.qty, totalPrice : cartData.totalPrice});
    //             }
    //         }
            
    //         res.render("shop/cart", {
    //             pageTitle : "Your Cart",
    //             path : '/cart',
    //             cartProducts : dataProductCart
    //         });
    //     });
    // });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQty = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
           return cart.getProducts({where : { id : productId }});
        })
        .then(products => {
            let product;
            if(products.length > 0) {
                product = products[0];
            }
            if(product) {
               const oldQty = product.cartItems.qty;
               newQty = oldQty + 1;
               return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through : { qty : newQty }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))

    
    // Product.getDataById(productId, product => {
    //     Cart.addProductToCart(productId, product.price);
    // });
    
    // res.redirect("/cart");
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { qty : product.cartItems.qty }
                        return product;
                    }));
                })
                .catch(err => console.log(err))
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include : ['products']})
        .then(orders => {         
            res.render("shop/orders", {
                pageTitle : "Your Orders",
                path : '/orders',
                orders : orders
            });
        })
        .catch(err => console.log(err))
};

exports.deleteProductFromCart = (req, res, next) => {
    const prodId = req.params.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where : {id : prodId}});
    })
    .then(products => {
        const product = products[0];
       return product.cartItems.destroy();
    })
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => console.log(err));
    // Product.getDataById(prodId, product => {
    //     Cart.deleteProductFromCart(prodId, product.price);
    // });
};