const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');
const { parseHTML } = require('cheerio');

var categorycount = 0;
var levels = [];

const getChildsJsonArray = (json, jsonCategory, objClass) => {
    var arrayChilds = [];
    var parentColor = (json.Color != undefined) ? json.Color : "";
    var level = 0;

    /*Validate children in object*/
    if (json.ChildMenus != null) {

        /*Asigment of levels*/
        if (json.Name != "") {
            categorycount++;
            levels.push({ "Name": json.Name, "Level": categorycount });
        }

        json.ChildMenus.forEach(element => {
            var arraySubChilds = [];

            /*Asigment Parent Color */
            SetColorCategory(element, jsonCategory, parentColor);

            /*Asigment childs */
            arraySubChilds = getChildsJsonArray(element, jsonCategory, objClass);

            /*Validate Level 3 with childs*/
            level = (levels.length > 0) ? levels[levels.length - 1].Level : 0;
            //var countChildren = (arraySubChilds.length == 0) ? 0 : arraySubChilds.length;
            var addChild = (arraySubChilds.length == 0 && level <= 2) ? false : true;

            if (addChild) {
                var obj = new objClass(element, arraySubChilds);

                if (Object.keys(obj).length > 0) {
                    arrayChilds.push(obj);
                }
            }
        });

        /*Delete last level and decrement count of level*/
        levels.pop();
        categorycount--;
    }

    return arrayChilds;
}

const getChildJsonArray = (json, objClass) => {
    var arrJson = [];

    if (json != null) {
        json.forEach(element => {
            var obj = new objClass(element);

            if (Object.keys(obj).length > 0) {
                arrJson.push(obj);
            }
        });
    }
    return arrJson;
}

const SetUrlPageProduct = (data) => {
    return process.env.URLPAGE + data.ProductId + '.html';
}

const SetUrlImageProduct = (data) => {
    return process.env.URL_IMAGEN + data.ImageFilename;
}

const getUrlImagesProduct = (json) => {
    var strUrl = SetUrlPageProduct(json);
    const images = [];

    console.log('url ' + strUrl);

    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: strUrl
        }, (err, res, body) => {
            if (err) { reject(err); return; }

            let $ = cheerio.load(body);
            const objImages = [];

            $('.product-thumb__item__img').each(function(i, element) {

                if (objImages[i].attribs.src !== undefined) {
                    images.push(objImages[i].attribs.src);
                }
            });

            resolve(images);
        })
    });
}

const SetColorCategory = (data, jsonCategory, parentColor) => {
    let name = data.Category;

    const findCategory = jsonCategory.find(cat => cat.Name == name);
    data.Color = (findCategory != undefined) ? findCategory.Color : parentColor;
}

const GetJsonFileCategory = () => {
    let pathJson = path.resolve(__dirname, '../assets/configCategory.json');

    return new Promise((resolve, reject) => {
        fs.readFile(pathJson, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            } else {
                var json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}

const getChildHtmlData = (html) => {

    var text = '';
    var textAditional = '';

    if (html != null) {
        if (html.children != null) {
            html.children.forEach(element => {
                if (element.children != null && element.children.length > 0) {
                    text += getChildHtmlData(element);
                } else {
                    textAditional = (html.name == 'h3') ? '# ' : textAditional;
                    text += textAditional + element.data + ' ';
                }
            });
        } else {
            text += html[0].data;
        }
    }

    return text;
}

const DeleteHtmlTagsFromText = (textData) => {
    let $ = cheerio.load(textData);
    var text = '';

    $('section').each(function(i, element) {
        text += getChildHtmlData(element);
        //console.log(element);
    });

    return text;
}

module.exports = {
    getChildsJsonArray,
    getChildJsonArray,
    getUrlImagesProduct,
    SetUrlPageProduct,
    SetUrlImageProduct,
    GetJsonFileCategory,
    DeleteHtmlTagsFromText
};