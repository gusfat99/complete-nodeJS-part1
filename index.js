const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");

const shopRouter = require('./routes/shop');
const adminRouter= require('./routes/admin');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const orderItem = require('./models/order-item');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public"))); //the directories public make be static
app.use(bodyParser.urlencoded({extended : true}));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin",adminRouter);
app.use(shopRouter);

Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through : CartItem });
Product.belongsToMany(Cart, { through : CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through : orderItem });

sequelize
// .sync({force :true})
.sync()
.then(result => {
    return User.findByPk(1);
})
.then(user => {
    if(!user) {
        return User.create({name : 'Gusfat', email : 'test@test.com'})
    }
    return user
})
// .then(user => {
//     return user.createCart();
// })
.then(() => {
    app.listen(3000);
})
.catch(err => console.log(err))
