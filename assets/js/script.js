let newEl;

categories={
    rum:["Light rum", "Dark rum", "Añejo rum", "Rum"],
    whiskey:["Applejack", "Scotch", "Blended whiskey", "Bourbon", "Irish whiskey", "Firewater", "Whiskey", "Johnnie Walker", "Pisco"],
    gin:["Gin", "Ricard"],
    brandy:["Apricot brandy", "Brandy", "Cherry brandy", "Apple brandy", "Grapefruit juice", "Cranberries", "Blackberry brandy", "Creme de Cassis"],
    vodka:["Lemon vodka", "Vodka", "Peach Vodka", "Absolut Citron"],
    tequila:["Tequila"],
    liqueur:["Sweet Vermouth", "Strawberry schnapps", "Triple sec", "Kahlua", "Dubonnet Rouge", "Coffee brandy", "Creme de Cacao", "Galliano", "Ouzo", "Spiced rum", "Chocolate liqueur", "Midori melon liqueur", "Sambuca", "Peppermint schnapps"],
    vermouth:["Dry Vermouth"],
    wine:["Red wine", "Port", "Sherry", "Cider"],
    juice:["Grapefruit juice", "Apple juice", "Pineapple juice", "Lemon juice", "Tomato juice", "Cranberry juice", "Grape juice", "Peach nectar", "Lemonade"],
    carbonated:["Carbonated water", "Sprite", "7-Up", "Lager", "Ale"],
    bitters:["Orange bitters", "Bitters"],
    sugar:["Sugar", "demerara Sugar", "Sugar syrup"],
    milk:["Milk", "Yoghurt", "Heavy cream"],
    fruit:["Watermelon", "Strawberries", "Mango", "Cantaloupe", "Berries", "Grapes", "Kiwi", "Orange", "Lime", "Cranberries"],
    coffee:["Coffee liqueur", "Coffee", "Espresso"],
    chocolate:["Chocolate syrup", "Cocoa powder", "Chocolate"],
    other:["Angelica root", "Water", "Egg yolk", "Egg", "Apple cider", "Everclear", "Firewater", "Pisco", "Irish cream","Tea"]
    }

const alcs = {
    baseliquors: ['Gin', 'Vodka', 'Whiskey', 'Tequila', 'Rum', 'Brandy'],
    liqueurs: ['amaretto', 'kahlua', 'campari', 'baileys'],
    wines: ['vermouth', 'sherry', 'marsala'],
}
let mypulls = {
    ingSearch: [],
    idsPulled: []
}
let myData = {
    idData: [],
    idList: []
}

let ingredients = getIngredientList()

function getIngredientList() {
    ingArray = []

    function handleList(ingredientFetch) {
        ingArray.push(ingredientFetch.strIngredient1)
    }


    let ingList = JSON.parse(localStorage.getItem('ingredients'))
    if (ingList === null) {
        const options = { method: 'GET', body: null };
        fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list', options)
            .then(response => response.json())
            .then(response => {
                response.drinks.forEach(handleList);
                console.log("list complete")
                console.log(ingredients)
                localStorage.setItem('ingredients', JSON.stringify(ingArray))
                console.log(ingArray)
                return ingArray
            })
            .catch(err => console.error(err));
    } else {
        console.log('Already loaded, Did not run fetch')
        ingArray = JSON.parse(localStorage.getItem("ingredients"))
        console.log(ingArray)
        return ingArray
    }
}
function getDrinks(event) {
    //check for localstorage by liq, if not empty run fetch, else pass
    // mypulls.ingSearch.push(liquor)
    const liquor = event.target.id
    if (localStorage.getItem(liquor) === null) {
        console.log('notyetsaved')
        const options = { method: 'GET' };
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${liquor}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                let idlist = getIDs(response);
                localStorage.setItem(liquor, JSON.stringify(idlist))
            })
            .catch(err => console.error(err));
    }
}
function getIDs(idList) {

    function handleIDData(drinkId) {
        let drink = drinkId.drinks[0]
        const newID = drink.idDrink
        let ind = 1
        let done = false;
        let mix_final = {
            mix_name: drink['strDrink'],
            mix_ingredients: [],
            mix_ingCount: 0,
            mix_img:drink["strDrinkThumb"]
        }
        while (done === false) {
            if (drink[`strIngredient${ind}`] !== null) {
                mix_final.mix_ingredients.push([drink[`strIngredient${ind}`], drink[`strMeasure${ind}`]])
                ind++
            } else {
                mix_final.mix_ingCount = ind - 1;
                done = true;
            }
        }
        thisData.push({[newID]:mix_final})
    }

    let ids = [];
    var thisData = [];

    idList.drinks.forEach(drinkId => {
        if (!myData.idList.includes(drinkId.idDrink)) {
            ids.push(drinkId.idDrink)
            const options = { method: 'GET' };
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId.idDrink}`, options)
                .then(response => response.json())
                .then(response => {
                    handleIDData(response);
                })
                .catch(err => console.error(err));
        }
    })

    console.log("THIS PULL")
    console.log(ids)
    console.log("***")

    const myOldData = JSON.parse(localStorage.getItem("idData"))
    console.log("my old data: " + myOldData)
    console.log("THISD ATA")
    console.log(thisData)
    const dataToAdd = JSON.stringify(thisData)
    console.log(dataToAdd)
    if (myOldData === null) {
        localStorage.setItem("idData", JSON.stringify(thisData));
    } else {
        const myNewData = myOldData.concat(thisData);
        console.log(myNewData);
        localStorage.setItem("idData", JSON.stringify(myNewData))
    }
    return ids;
}

alcs.baseliquors.forEach(function (item) {
    newEl = $(`<button class="liq" id="${item}">${item}</button>`)
    newEl.appendTo('.btn-list')
})
$('.liq').click(getDrinks)