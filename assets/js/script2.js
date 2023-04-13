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
let items = { ...localStorage } || {}
function cleanItems(){
    Object.keys(items).forEach(key=>{
        let item = items[key]
        items[key] = JSON.parse(item)
    })
}
cleanItems()

let pulls = {}
const mix = {
    selector: null,
    name: null,
    must: [],
    include: [],
    exclude: [],
    results: []
}
let myMixes = {
    f: {
        refresh: (mix, from) => {
            finalTub = []
            searchTag = {}
            console.log("***")
            console.log(mix.include)
            console.log(mix.exclude)
            console.log("***")
            
            mix.include.forEach(ingredient => {
                console.log("BEGIN INGREDIENT TESTING*****")
                console.log(ingredient)
                console.log(items[ingredient])
                items[ingredient].forEach(id => {
                    if (Object.keys(searchTag).includes(id)) {
                        searchTag[id].count++
                        searchTag[id].ings.push(ingredient)
                    } else {
                        searchTag[id]={count:1,ings:[ingredient]}
                    }
                })
                console.log("***********END INGREDIENT TESTING*****")
            })
            console.log(searchTag)
        }
    },
    selected: '',
    target: () => { return myMixes[myMixes.selected] },
    count: 0
}
function getIngredients() {
    let ingredients = [];
    if (Object.keys(items).includes("ingredients")) {
        return items["ingredients"]
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
function createFilterButtons() {
    const lines = {
        type: (type) => { return `<div class="filter-type" id="${type}"></div>` },
        category: (cat) => { return `<div class="filter-cat" id="${cat}"><h4>${cat}</h4></div>` },
        ingredient: (id, data) => {
            return `<button class="filter-item ignored" id="${id}" data-tags="${data[0]} ${data[1]} ${data[2]}">${data[2].split("-").join(" ")}</button>`
        }
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
        elType.appendTo('.btn-list') //change to filter-box element selector
        Object.keys(categories[type]).forEach((category) => {
            let elCat = $(lines.category(category))
            elCat.appendTo(`#${type}`)
            let ingCount = 0;
            categories[type][category].forEach((ingredient) => {
                ingredient = ingredient.split(' ').join('-')
                let elIng = $(lines.ingredient(`${category}${ingCount}`, [type, category, ingredient]))
                elIng.appendTo(`#${category}`)
                ingCount++
            })
        })
    })
}
function handleFilterClick(event) {
    const id = event.target.id
    const targetData = event.target.dataset.tags.split(" ")
    const category = targetData[1]
    const ingredient = targetData[2].split('-').join(' ')
    function searchIngredient(ingredient) {
        function checkLocal(search) {
            if (Object.keys(items).includes(search)) {
                console.log('STORAGE')
                console.log(items[search])
                return [items[search], 1]
            } else {
                console.log('FETCHING')
                return [fetchData(search), 0]
            }
        }
        function fetchData(search) {
            console.log(search)
            let ids = []
            let thisData = [];
            console.log('here1')
            const options = { method: "GET" };
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${search}`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    response.drinks.forEach((item) => {
                        console.log('here?')
                        let id = item.idDrink
                        let thisObj = {
                            name: item.strDrink,
                            img: item.strDrinkThumb
                        }
                        thisData.push({ [id]: thisObj })
                        console.log(item)
                        ids.push(item.idDrink)
                    })
                    console.log("here")
                    localStorage.setItem(search, JSON.stringify(ids))
                    console.log("yep, here")
                    items[search] = ids
                    return response
                })
                .catch(err => console.error(err));
        }
        checkLocal(ingredient)
    }
    function toggleChoice(id, from) {
        ostates = {
            ignored: (target) => {
                target.toggleClass('ignored')
                myMixes.target().include.push(ingredient)
                target.toggleClass('included')
                console.log(myMixes.target())
                myMixes.f.refresh(myMixes.target(),from)
            },
            included: (target) => {
                target.toggleClass('included')
                myMixes.target().include.splice(ingredient, 1)
                myMixes.target().exclude.push(ingredient)
                target.toggleClass('excluded')
                console.log(myMixes.target())
                myMixes.f.refresh(myMixes.target(), from)
            },
            excluded: (target) => {
                target.toggleClass('excluded')
                myMixes.target().exclude.splice(ingredient, 1)
                target.toggleClass('ignored')
                console.log(myMixes[myMixes.selected])
                myMixes.f.refresh(myMixes.target(), from)
            }
        }
        ostates[event.target.classList[1]]($(`#${id}`))
    }
    newChoices = searchIngredient(ingredient)
    console.log("*********")
    console.log(newChoices)
    console.log("*********")
    toggleChoice(id, newChoices)

}
function newMix() {
    function createObject() {
        const newMix = new Object(mix);
        myMixes.count++
        const mixId = `mix-${myMixes.count}`
        newMix.selector = `#${mixId}`
        myMixes[mixId] = newMix
        myMixes.selected = newMix.selector
        return myMixes.count
    }
    let mixId = createObject()
    function addElements(mixId) {
        const lines = {
            target: $('#mix-filters'),
            element: () => {
                return `<div class="mix-container" id="mix-${mixId}"><div class="mix-header" id="header-${mixId}"><h2>Mix ${mixId}</h2><div id="filter-container" id="filter-${mixId}"><div class="in-cont" id="included-${mixId}"></div><div class="ex-cont" id="excluded-${mixId}"></div></div><button class="editFilter" id="edit-${mixId}" data-mixid="mix-${mixId}">Edit Filter</button></div></div><div class="mix-results" id="r-${mixId}></div>`;
            },
            listener: (event) => {
                myMixes.selected = event.target.dataset.mixid
                $('#filter-window').toggleClass("hidden", false)
            },
            execute: () => {
                $(lines.element()).appendTo(lines.target)
                $(`#edit-${mixId}`).click(lines.listener)
            }
        }
        lines.execute()

    }
    addElements(mixId)
}
getIngredients()
createFilterButtons()
$('#add-mix').click(newMix)
$('.filter-item').click(handleFilterClick)