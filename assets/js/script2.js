let newEl;
const categories = {
    alc: {
        rum: ["Light rum", "Dark rum", "Añejo rum", "Rum"],
        whiskey: ["Applejack", "Scotch", "Blended whiskey", "Bourbon", "Irish whiskey", "Firewater", "Whiskey", "Johnnie Walker", "Pisco"],
        gin: ["Gin", "Ricard"],
        brandy: ["Apricot brandy", "Brandy", "Cherry brandy", "Apple brandy", "Grapefruit juice", "Cranberries", "Blackberry brandy", "Creme de Cassis"],
        vodka: ["Lemon vodka", "Vodka", "Peach Vodka", "Absolut Citron"],
        tequila: ["Tequila"],
        liqueur: ["Sweet Vermouth", "Strawberry schnapps", "Triple sec", "Kahlua", "Dubonnet Rouge", "Coffee brandy", "Creme de Cacao", "Galliano", "Ouzo", "Spiced rum", "Chocolate liqueur", "Midori melon liqueur", "Sambuca", "Peppermint schnapps", "Coffee liqueur"],
        vermouth: ["Dry Vermouth"],
        wine: ["Red wine", "Port", "Sherry", "Cider"],
        other: ["Pisco", "Irish cream"]
    },
    non: {
        juice: ["Grapefruit juice", "Apple juice", "Pineapple juice", "Lemon juice", "Tomato juice", "Cranberry juice", "Grape juice", "Peach nectar", "Lemonade"],
        carbonated: ["Carbonated water", "Sprite", "7-Up", "Lager", "Ale"],
        bitters: ["Orange bitters", "Bitters"],
        sugar: ["Sugar", "demerara Sugar", "Sugar syrup"],
        milk: ["Milk", "Yoghurt", "Heavy cream"],
        fruit: ["Watermelon", "Strawberries", "Mango", "Cantaloupe", "Berries", "Grapes", "Kiwi", "Orange", "Lime", "Cranberries"],
        chocolate: ["Chocolate syrup", "Cocoa powder", "Chocolate"],
        coffee: ["Coffee", "Espresso"],
        nother: ["Angelica root", "Water", "Egg yolk", "Egg", "Apple cider", "Everclear", "Firewater", "Tea"]
    }
}
const mix = {
    name: null,
    include: [],
    exclude: [],
    results: []
}
const alcs = {
    baseliquors: ["Gin", "Vodka", "Whiskey", "Tequila", "Rum", "Brandy"],
    inglist: getIngredients()
}
function getIngredients() {
    let ingredients = [];
    if (localStorage.getItem("ingredients") !== null) {
        return JSON.parse(localStorage.getItem("ingredients"))
    } else {
        const options = { method: "GET" };
        fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list", options)
            .then(response => response.json())
            .then(response => {
                response.drinks.forEach((item) => {
                    ingredients.push(item.strIngredient1)
                });
                localStorage.setItem("ingredients", JSON.stringify(ingredients))
            })
            .catch(err => console.error(err));
    }
}
function toggleChoice(event) {
    states = ['ig', 'in', 'ex']
    const ID = event.target.id
    console.log(ID)
    const target = $(`#${ID}`)
    var classList = target.attr('class').split(/\s+/);
    let currInd = states.indexOf(classList[1])
    target.removeClass(states[currInd])
    if (currInd === 2) {
        currInd = 0
    } else {
        currInd++
    }
    target.addClass(states[currInd])
}
function searchIngredient(event) {
    const ingredient = event.target.dataset.ing;
    function checkLocal(search) {
        if (localStorage.getItem(search) !== null) {
            console.log('STORAGE')
            return JSON.parse(localStorage.getItem(search))
        } else {
            console.log('FETCHING')
            return fetchData(search)
        }
    }
    function fetchData(search) {
        let ids = []
        let thisData = [];
        const options = { method: "GET" };
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${search}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                response.drinks.forEach((item) => {
                    let id = item.idDrink
                    let thisObj = {
                        name: item.strDrink,
                        img: item.strDrinkThumb
                    }
                    thisData.push({ [id]: thisObj })
                    console.log(item)
                    ids.push(item.idDrink)
                })
                localStorage.setItem(search, JSON.stringify(ids))
                const oldData = JSON.parse(localStorage.getItem('idData'))
                if (oldData !== null) {

                }
                return response
            })
            .catch(err => console.error(err));
    }
    checkLocal(ingredient)
}
const lines = {
    type: (type) => { return `<div class="filter-type" id="${type}"></div>` },
    category: (cat) => { return `<div class="filter-cat" id="${cat}"><h4>${cat}</h4></div>` },
    ingredient: (id, ing) => {
        return `<button class="filter-item ig" id="${id}" data-ing="${ing}">${ing}
    </button>`}
}

//This block below iterates through our categories object at the top looping first through the two main [types],
// [type]-> [category] -> [ingredients].
//Each of these are creating nested <divs> in the order of the initial object. 
//type <class="f-type" id="[category]"
//category <class="f-cat" id="[category]">
//ingredient <button class=f-item (was f-ing...) id="[category][ingIndex]"> ingIndex is determined in the for loop by increasing an external ingCount.
// Depending where we are in crawling through our categories object, we call to lines[where] and..
// append the div returned to .btn-list for the type (alc,non-alc), category(GPT sorted Object based on "idk beverage types") into the type, ingredient into category.
Object.keys(categories).forEach((type) => {
    console.log(lines.type(type))
    let elType = $(lines.type(type))
    elType.appendTo('.btn-list')
    Object.keys(categories[type]).forEach((category) => {
        let elCat = $(lines.category(category))
        elCat.appendTo(`#${type}`)
        let ingCount = 0;
        categories[type][category].forEach((ingredient) => {
            let elIng = $(lines.ingredient(`${category}${ingCount}`, ingredient))
            elIng.appendTo(`#${category}`)
            ingCount++
        })
    })
})

getIngredients()

$('.filter-item').click(toggleChoice)
$('.filter-item').click(searchIngredient)