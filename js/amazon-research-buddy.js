//https://www.gstatic.com/images/icons/material/system/1x/star_border_white_20dp.png
//https://www.gstatic.com/images/icons/material/system/2x/star_googyellow500_20dp.png
//url('https://www.gstatic.com/images/icons/material/system/2x/star_border_black_20dp.png')
//url('https://www.gstatic.com/images/icons/material/system/1x/star_border_black_20dp.png')
const RESEARCH_HEADER_HTML = (message) => `
<div class="research-header__div">
    <ul class="research-header__ul">
        <li class="research-header__li">
            <span class="research-header__span--strong">Amazon Research Buddy - </span>
            <span class="research-header__span">${message}</span>
        </li>
        <li class="research-header__li--right">
            <span class="research-header__span--star"></span>
        </li>
    </ul>
</div>
`; 

const RESEARCH_DEBUG_HEADER_HTML = (description, price, category, rank) => `
<div class="research-header-debug__div">
    <ul class="research-header-debug__ul">
        <li class="research-header__li">
            <span class="research-header__span--strong">Description: </span>
            <span class="research-header__span">${description}</span>
        </li>    
        <li class="research-header__li">
            <span class="research-header__span--strong">Price: </span>
            <span class="research-header__span">${price}</span>        
        </li>
        <li class="research-header__li">
            <span class="research-header__span--strong">Category: </span>        
            <span class="research-header__span">${category}</span>
        </li> 
        <li class="research-header__li">
            <span class="research-header__span--strong">Rank: </span>           
            <span class="research-header__span">${rank}</span>
        </li>    
        <li class="research-header__li--right">
            <span class="research-header__span--cross"></span>
        </li>                          
    </ul>
</div>
`; 


const PRODUCT_SEARCH_API_URL = (asin) => `http://127.0.0.1:5000/product/${asin}`

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function toggleStarred(headerText, action, toggleOn){
    removeHeaderDiv();
    setHeaderText(headerText);

    $('.research-header__span--star').on('click',{asin:asin} ,action);
    $('.research-header__span--star').toggleClass('starred', toggleOn);
}

function addAsin(event){


    console.log('addAsin')
    console.log(asin)
    console.log(description);
    console.log(price);
    console.log(productRankAndCategory.rank);
    console.log(productRankAndCategory.category);
  
    fetch(PRODUCT_SEARCH_API_URL(event.data.asin), { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {
            description: description,
            asin: asin,
            price: price,
            category: productRankAndCategory.category,
            rank: productRankAndCategory.rank
        }),
    }).then(function(response) {
        handleErrors(response);
    }).then(function(response) { 
        toggleStarred('Product starred.',deleteAsin, true);
    }).catch(function(error) {
        toggleStarred(error.statusText,addAsin, false);
    });
}

function deleteAsin(event){

    fetch(PRODUCT_SEARCH_API_URL(event.data.asin), { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(response) {
        handleErrors(response);
    }).then(function(response) { 
        toggleStarred('Product removed.', addAsin,false)
    }).catch(function(error) {
        toggleStarred(error.statusText, deleteAsin, true);
    });
}

function setDebugInfo(description,price, category, rank){
    var debugHeader = $(RESEARCH_DEBUG_HEADER_HTML(description,price,category,rank));
    $("div#a-page").prepend(debugHeader);
}


function setHeaderText(message){
    var header = $((RESEARCH_HEADER_HTML(message)));
    $("div#a-page").prepend(header);
}

function removeHeaderDiv(){
    $('.research-header__div').remove();
}


const asin = $("#ASIN").val()

fetch(PRODUCT_SEARCH_API_URL(asin), { 
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}).then(function(response) {
    handleErrors(response);
}).then(function() { 
    toggleStarred('Product previously starred.',deleteAsin, true);
}).catch(function(error) {
    toggleStarred('Product not starred.',addAsin ,false);
});

var price = getProductPrice();
var description = getDescription();
var productRankAndCategory = getProductCategoryAndRank();

if (DEBUG){
    setDebugInfo(description.substr(0, 19), price, productRankAndCategory.category, productRankAndCategory.rank);
}


$(window).scroll(() => {
    $('.research-header__div').add

    if ($(this).scrollTop() > 60) {
        $('.research-header__div').addClass('research-header__div--fixed');
        $('.research-header-debug__div').addClass('research-header-debug__div--fixed');
    } else {
        $('.research-header__div').removeClass('research-header__div--fixed');
        $('.research-header-debug__div').removeClass('research-header-debug__div--fixed');
    }
})

$('.research-header__span--cross').on('click', () => $('.research-header-debug__div').remove());