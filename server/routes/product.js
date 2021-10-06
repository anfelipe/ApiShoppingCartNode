const express = require('express');
const unirest = require('unirest');
const { Product } = require('../models/product');
const utils = require('../Utils/utils');

const app = express();

app.get('/product', (req, res) => {

    let category = req.query.category;
    let page = req.query.page;
    let pageSize = req.query.pageSize;

    /*Optional Parameter */
    let size = req.query.size;
    let color = req.query.color;
    let maxPrice = req.query.maxPrice;
    let sort = req.query.sort;

    console.log(category);
    console.log(page);
    console.log(pageSize);

    const api = unirest.get(process.env.PRODUCT);

    api.headers({
        "x-rapidapi-host": process.env.HOST,
        "x-rapidapi-key": process.env.KEY,
        "useQueryString": true
    });

    api.query({
        /*"size": "Medium",
        "color": "red",
        "maxprice": "250",*/
        "category": category,
        "page": page,
        "pagesize": pageSize
    });

    api.end(function(data) {
        if (data.error) throw new Error(data.error);

        var arrJson = [];
        var dataJson = data.body.CatalogProducts;

        // res.json({
        //     data: dataJson
        // });

        arrJson = utils.getChildJsonArray(dataJson, Product);

        // res.json({
        //     data: arrJson
        // });

        res.send(arrJson);

        var arrPromise = [];
        /*arrJson.forEach(item => {
            const promTest = utils.getUrlImagesProduct(item);
            arrPromise.push(promTest);
        });

        Promise.all(arrPromise).then(value => {
            value.forEach((item, index) => {
                arrJson[index].UrlImage = item;
            });

            res.json({
                //data: arrJson
                data: data
            });
        }, reason => {
            console.log(reason);
            res.json({
                data: "Time out"
            });
        })*/

    });
});

app.get('/product/detail/:id', (req, res) => {

    let id = req.params.id;
    const api = unirest.get(process.env.PRODUCT_DETAIL_V2);

    console.log(id);

    api.query({
        "productId": id
    });

    api.headers({
        "x-rapidapi-host": process.env.HOST,
        "x-rapidapi-key": process.env.KEY,
        "useQueryString": true
    });

    api.end(function(data) {
        if (data.error) throw new Error(data.error);

        var dataJson = data.body.product;
        var objProduct = new Product(dataJson);
        //console.log(objProduct);

        //const promTest = utils.getUrlImagesProduct(objProduct);

        // res.json({
        //     data: objProduct
        // });

        res.send(objProduct);
        //res.send(dataJson);

        /*Promise.all([promTest]).then(value => {
            objProduct.UrlImage = value;

            res.json({
                data: objProduct
            });
        }, reason => {
            console.log(reason);

            res.json({
                data: "Time out"
            });
        })*/
    });
});

module.exports = app;