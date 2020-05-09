const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('products', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    title : Sequelize.STRING,
    imageUrl : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    price : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    description : {
        type : Sequelize.TEXT,
    }
});

module.exports = Product;