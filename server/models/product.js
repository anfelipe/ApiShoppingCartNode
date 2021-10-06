const utils = require('../Utils/utils');

class Product {

    constructor(data) {
        this.ProductId = data.ProductId;
        this.Description = utils.DeleteHtmlTagsFromText(data.Description);
        this.DisplayName = data.DisplayName;
        this.ListPrice = data.ListPrice;
        this.ItemCode = data.ItemCode;
        //this.urlPage = utils.SetUrlPageProduct(data);
        this.UrlPage = data.ProductShareLinkUrl;
        this.UrlImage = data.DefaultProductImage; //utils.SetUrlImageProduct(data);
        this.Variants = utils.getChildJsonArray(data.Variants, Colors);
    }

}

class Colors {
    constructor(data) {
        this.ColorId = data.ColorId;
        this.ColorName = data.ColorName;
        //this.ImageFileName = data.ImageFileName;
        //this.OriginalPrice = data.OriginalPrice;
        this.Sizes = utils.getChildJsonArray(data.Sizes, Sizes);
        this.ProductImages = utils.getChildJsonArray(data.ProductImages, Images);
        this.SwatchImage = data.SwatchImage;
    }
}

class Sizes {
    constructor(data) {

        if (data.Available) {
            this.Available = data.Available;
            this.Price = data.Price;
            this.SizeId = data.SizeId;
            this.SizeName = data.SizeName;
        } else {
            return null;
        }
    }
}

class Images {
    constructor(data) {
        this.Name = data;
    }
}

module.exports = {
    Product
};