const DEBUG = true

$.fn.exists = function () {
    return this.length !== 0;
}

function getProductPrice(){

    var ids = ['#price_inside_buybox', '#newBuyBoxPrice', '#priceblock_snsprice_Based .a-size-large'];
    var price = 0;

    ids.some(function(id) {
        var span = $(id);


        if (span.exists()){
            price = span.text().trim().replace('$','');
            
            if (DEBUG){
                var priceString = `Product price: ${price}`;
                console.log(priceString);
            }
            return true;
        }
      })

      return price;
}

function getDescription(){
    var span = $('#productTitle');

    if (span.exists()){
        var description = span.text().trim();
        
        if (DEBUG){
            var descriptionString = `Product description is ${description}`;
            console.log(descriptionString);
        }

        return description;
    } 

}

function getProductCategoryAndRank(){
    const stringVariationRegex1 = /^(?<rank>[\d,]+) in (?<category>.*) \(See Top 100 in (.*)\)$/
    const stringVariationRegex2 = /^(?<rank>[\d,]+) in (?<category>.*)\(See top 100\)\s*$/
    const stringVariationRegex3 = /^(?<rank>[\d,]+) in (?<category>[^\>\(]*) (.*)\s*$/
    const stringVariationRegex4 = /^(?<rank>[\d,]+)\s?in (?<category>[^\>]*) (.*)\s*$/

    var categoryAndRank = getBsr();

    var categoryAndRankString = `Category & Rank: |${categoryAndRank}|`

    if (DEBUG){
        console.log(categoryAndRankString)
    }

    var result = stringVariationRegex1.exec(categoryAndRank);

    if (!result){
        console.log(result)
    }

    if (!result){
        if (DEBUG){
            console.log("No match for stringVariationRegex1")
        }
        result = stringVariationRegex2.exec(categoryAndRank);
    }

    if (!result){
        if (DEBUG){
            console.log("No match for stringVariationRegex2")
        }
        result = stringVariationRegex3.exec(categoryAndRank);
    }

    if (!result){
        if (DEBUG){
            console.log("No match for stringVariationRegex3")
        }
        result = stringVariationRegex4.exec(categoryAndRank);
    }

    if (!result){
        if (DEBUG){
            console.log("No match for stringVariationRegex4")
        }
    }

    if (result){
        if (DEBUG){
            console.log(result.groups);
            //console.log(result.length);
        }        

        var category = result.groups.category;
        var rank = result.groups.rank;

        var categoryString = `Product category is ${category}`
        var rankString = `Product rank is ${rank}`

        if (DEBUG){
            console.log(categoryString);
            console.log(rankString);
        }   

        return {category: category, rank: rank}
    }
}

function getBsr(){

    var bsr = getBsrFromProductInfoBulletView();
    
    if (bsr){
        trimmedBsr = bsr.trim().split("#");
        return trimmedBsr[1];
    }

    if (!bsr){
        bsr = getBsrFromProductInfoGridView();
    }

    return bsr
}

function getBsrFromProductInfoGridView(){
    if (DEBUG){
        console.log('getBsrFromProductInfoGridView');
    }
    var productInfoTable = $('#productDetails_detailBullets_sections1');

    if (productInfoTable.exists()){
        var td = $("th:contains('Best Sellers Rank')").next().text().trim().split("#");
        var bsr = td[1].trim();
        var bsrString = `Product BSR |${bsr}|`
        if (DEBUG){
            console.log(bsrString);
        }
        return bsr;
    }
}

function getBsrFromProductInfoBulletView(){
    if (DEBUG){
        console.log('getBsrFromProductInfoBulletView');
    }
    return $('#SalesRank').text().replace(/[\r\n]+/g,'').replace('Amazon Best Sellers Rank:','');


}


