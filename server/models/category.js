const utils = require('../Utils/utils');

class Category {

    constructor(data, subCategory) {

        this.Name = data.Name;
        this.Category = data.Category
        this.Color = data.Color;
        this.subCategory = subCategory;

    }
}

module.exports = {
    Category
};