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
let itempull = JSON.parse(localStorage.getItem('items')) || {}
let items = itempull || {}
function cleanItems() {
    Object.keys(items).forEach(key => {
        let item = items[key]
        items[key] = JSON.parse(item)
    })
    console.log('cleaned')
}
let drinkpull = JSON.parse(localStorage.getItem('drinks')) || {}
let pulls = drinkpull || {}
const mix = {
    alone: true,
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
            empty = false
            idLot = {
                inclusions: [],
                exclusions: []
            }
            if (mix.exclude.length > 0) {
                mix.exclude.forEach(ingredient => {
                    let newLot = [...idLot.exclusions, ...items[ingredient]]
                    idLot.exclusions = newLot
                })
            }
            console.log(`EXCLUSIONS: ${idLot.exclusions}`)
            console.log(mix.include)
            if (mix.include.length > 0) {
                mix.include.forEach(ingredient => {
                    if (ingredient !== undefined) {
                        items[ingredient].forEach(id => {
                            if (Object.keys(searchTag).includes(id)) {
                                searchTag[id].count++
                                searchTag[id].ings.push(ingredient)
                            } else {
                                searchTag[id] = { count: 1, ings: [ingredient] }
                            }
                        })
                    }
                })
            }
            newSort = {}
            Object.keys(searchTag).forEach(included => {
                if (!idLot.exclusions.includes(included)) {
                    times = searchTag[included].count
                    if (newSort[times] === undefined || newSort[times].length === 0) {
                        newSort[times] = [included]
                    } else {
                        newSort[times].push(included)
                    }
                }
            })
            tub = []
            for (let i = Object.keys(newSort).length; i > 0; i--) {
                console.log(newSort[i])
                tub = [...tub, ...newSort[i]]
            }
            tub.forEach(item => {
                console.log(searchTag[item])
            })
            myMixes.target().results = tub
            myMixes.f.putResults(tub)
        },
        putResults: (results) => {
            const lines = {
                card: (index, drink) => { return `<div class="result-card" id="c-${index}"><h3>${drink.name}</h3></div>` }
            }
            id = myMixes.selected.split('-')[1]
            target = `#r-${id}`
            count = 10;
            if (results.length < 10) {
                count = results.length
            }
            $(target).empty()
            for (let i = 0; i < count; i++) {
                console.log("***")
                console.log(pulls[results[i]])
                console.log("***")
                $(lines.card(i, pulls[results[i]])).appendTo(target)
            }
        }

    }
    ,
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
    $('#non').toggleClass('hidden')
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
                return items[search]
            } else {
                console.log('FETCHING')
                return fetchData(search)
            }
        }
        async function fetchData(search) {
            const options = { method: "GET" };
            let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${search}`, options);
            response = await response.json()
            idList = []
            console.log("******************")
            console.log(response)
            response.drinks.forEach((drink) => {
                if (!Object.keys(pulls).includes(drink.idDrink)) {
                    thisObj = {
                        status: 0,
                        name: drink.strDrink,
                        img: drink.strDrinkThumb
                    }
                    pulls[drink.idDrink] = thisObj
                    idList.push(drink.idDrink)
                }
            })
            console.log(idList)
            items[search] = idList
            localStorage.setItem('items', JSON.stringify(items))
            localStorage.setItem('drinks', JSON.stringify(pulls))
            console.log("******************")
            return idList
        }

        return checkLocal(ingredient)
    }

    function toggleChoice(id, from) {
        ostates = {
            ignored: (target) => {
                target.toggleClass('ignored')
                if (!myMixes.target().include.includes(ingredient)) {
                    myMixes.target().include.push(ingredient)
                    target.toggleClass('included')
                }
            },
            included: (target) => {
                target.toggleClass('included')
                myMixes.target().include.splice(ingredient, 1)
                myMixes.target().exclude.push(ingredient)
                target.toggleClass('excluded')
            },
            excluded: (target) => {
                target.toggleClass('excluded')
                myMixes.target().exclude.splice(ingredient, 1)
                target.toggleClass('ignored')

            }
        }
        ostates[event.target.classList[1]]($(`#${id}`))
        myMixes.f.refresh(myMixes.target(), from)
    }
    searchIngredient(ingredient)
    newChoices = items[ingredient]
    console.log("****************")
    console.log("****************")
    console.log("****************")
    console.log("****************")
    console.log(items)
    console.log(ingredient)
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
            target: [$('#mix-filters'), $("#mix-responses")],
            element: () => {
                return `<div class="mix-container" id="mix-${mixId}"><div class="mix-header" id="header-${mixId}"><h2>Mix ${mixId}</h2><div id="filter-container" id="filter-${mixId}"><div class="in-cont" id="included-${mixId}"></div><div class="ex-cont" id="excluded-${mixId}"></div></div><button class="editFilter" id="edit-${mixId}" data-mixid="mix-${mixId}">Edit Filter</button></div></div>`;
            },
            results: () => {
                return `<div class="response-container" id="r-${mixId}"></div>`
            },
            listener: (event) => {
                myMixes.selected = event.target.dataset.mixid
                console.log(myMixes.selected)
                $('.filter-container').toggleClass("hidden")
            },
            execute: () => {
                $(lines.element()).appendTo(lines.target[0])
                $(lines.results()).appendTo(lines.target[1])
                $(`#edit-${mixId}`).click(lines.listener)
            }
        }

        lines.execute()
    }
    addElements(mixId)
}

getIngredients()
createFilterButtons()
$('.tgl-type').click((event) => {
    $('.tgl-type').toggleClass('included ignored')
    $('.filter-type').toggleClass('hidden')
})
$('#add-mix').click(newMix)
$('.filter-item').click(handleFilterClick)