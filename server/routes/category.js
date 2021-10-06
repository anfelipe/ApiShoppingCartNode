const express = require('express');
const unirest = require('unirest');
const { Category } = require('../models/category');
const utils = require('../Utils/utils');

const app = express();

app.get('/category', (req, res) => {

    console.log('Inicio peticion');

    const api = unirest.get(process.env.CATEGORY);

    api.headers({
        "x-rapidapi-host": process.env.HOST,
        "x-rapidapi-key": process.env.KEY,
        "useQueryString": true
    });

    api.end(function(data) {
        if (data.error) throw new Error(data.error);

        //var jsonParse = data.body.menuItemList[0]; //.ChildMenus;
        var jsonParse = data.body; //.ChildMenus;
        var arrayCategory = [];

        /*res.json({
            jsonParse
        });*/

        utils.GetJsonFileCategory()
            .then((data) => {
                arrayCategory = utils.getChildsJsonArray(jsonParse, data, Category);

                // res.json({
                //     data: arrayCategory
                // });

                console.log('Send');

                res.send(arrayCategory);
                //res.send(jsonParse);
            });

    });

});

module.exports = app;