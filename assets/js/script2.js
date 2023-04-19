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
        refresh: (mix) => {
            console.log(mix)
            finalTub = []
            searchTag = {}
            empty = false
            idLot = {
                inclusions: [],
                exclusions: []
            }
            console.log("***************")
            console.log(mix.exclude)
            console.log(mix.exclude.length)
            console.log(idLot.exclusions)
            if (mix.exclude.length > 0) {
                mix.exclude.forEach(ingredient => {
                    console.log(idLot.exclusions)
                    idLot.exclusions = [...idLot.exclusions, ...items[ingredient]]
                    console.log(idLot.exclusions)
                })
            }
            if (mix.include.length > 0) {
                mix.include.forEach(ingredient => {
                    let waiting = true;
                    check = 0;
                    while (waiting === true) {
                        if (items[ingredient] !== undefined) {
                            idLot.inclusions = [...idLot.inclusions, ...items[ingredient]]
                            items[ingredient].forEach(id => {
                                if (Object.keys(searchTag).includes(id)) {
                                    searchTag[id].count++
                                    searchTag[id].ings.push(ingredient)
                                } else {
                                    searchTag[id] = { count: 1, ings: [ingredient] }
                                }
                            })
                            waiting = false;
                        } else {
                            check++
                            if (check === 10) {
                                waiting = false;
                            }
                            console.log("Still waiting")
                            console.log("Still waiting")
                            console.log("Still waiting")
                        }
                    }
                })
            }
            newSort = {}
            idLot.inclusions.forEach(included => {
                if (!idLot.exclusions.includes(included)) {
                    console.log(included)
                    quant = 0
                    console.log(pulls[included])
                    pulls[included].ings.forEach(ing => {
                        if (mix.include.includes(ing)) {
                            quant++
                        }
                    })
                    newSort[included] = quant
                }
            })

            console.log(newSort)
            stub = {}
            Object.keys(newSort).forEach(id => {
                if (stub[newSort[id]] !== undefined) {
                    stub[newSort[id]] = [...stub[newSort[id]], id]
                } else {
                    stub[newSort[id]] = [id]
                }
            })


            nstub = []
            for (let i = Object.keys(stub).length; i > 0; i--) {
                ostub = stub[i]
                ostub.forEach(id => {
                    nstub.push(id)
                })
                console.log(nstub)
            }
            console.log(nstub)
            myMixes.target().results = nstub
            myMixes.f.putFilters(mix.include, mix.exclude)
            myMixes.f.putResults(nstub)
        },
        putResults: (results) => {
            console.log(results)
            const lines = {
                card: (index, drink, drinkid) => {
                    console.log(myMixes.target().include)
                    quant = 0;
                    drink.ings.forEach(ing => {
                        if (myMixes.target().include.includes(ing)) {
                            quant++
                        }
                    })
                    console.log(drink)
                    return `<div class="result-card" id="c-${index}" data-did="${drinkid}"><div class="card-title">${drink.name}</div><div class="card-count">${quant}</div></div>`
                }
            }
            id = myMixes.selected.split('-')[1]
            target = `#r-${id}`
            count = 10;
            if (results.length < 10) {
                count = results.length
            }
            $(target).empty()
            for (let i = 0; i < count; i++) {
                drinkinfo = pulls[results[i]]
                console.log(drinkinfo)
                newEl = $(lines.card(i, pulls[results[i]], results[i]))
                newEl.appendTo(target)
                newEl.css(`background-image`, `url(${pulls[results[i]].img})`)
                newEl.click((event) => {
                    getDrink(event.target.dataset.did);
                    setTimeout(()=>{
                        $('main1').toggleClass('hidden')
                        $('main2').toggleClass('hidden')
                    }, 1000)
                    
                    
                })
            }
        },
        putFilters: (included, excluded) => {
            const lines = {
                header: (to, ing) => {
                    if (to === 1) {
                        return `<p class="included">${ing}</p>`
                    } else if (to === 0) {
                        return `<p class="excluded">${ing}</p>`
                    }
                }
            }
            id = myMixes.selected.split('-')[1]
            target = [`#included-${id}`, `#excluded-${id}`]
            $(target[0]).empty()
            $(target[1]).empty()
            included.forEach(ing => {
                console.log(ing)
                console.log(target[0])
                $(lines.header(1, ing)).appendTo(target[0])
            })
            excluded.forEach(exc => {
                $(lines.header(0, exc)).appendTo(target[1])
            })
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
function getDrink(id) {
    const options = { method: 'GET' };

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`, options)
        .then(response => response.json())
        .then(response => {
            let ingredients = []
            $('#drinkname').text(response.drinks[0].strDrink)
            for (let i = 1; i < 15; i++) {
                if (response.drinks[0][`strIngredient${i}`] !== null) {
                    console.log(response.drinks[0][`strIngredient${i}`])
                    ingredients.push(`${response.drinks[0][`strIngredient${i}`]}-${response.drinks[0][`strMeasure${i}`]}`)
                } else {
                   i=15;
                }
            }
            $(".ingcol").empty()
            ingredients.forEach(ing => {
                console.log(ing)
                let ning = ing.split('-')
                nel1 = `<h2>${ning[0]}</h2>`
                nel2 = `<h2>${ning[1]}</h2>`
                console.log(nel1, nel2)
                $(nel1).appendTo($(".ingcol"))
                $(nel2).appendTo($(".measurecol"))
            })
            console.log('success')
        })
        .catch(err => console.error(err));
}
function createFilterButtons() {
    const lines = {
        type: (type) => { return `<div class="filter-type" id="${type}"></div>` },
        category: (cat) => { return `<div class="filter-cat" id="${cat}"><h4 class="cat-name">${cat}</h4></div>` },
        ingredient: (id, data) => {
            return `<button class="filter-item ignored" id="${data[2]}" data-tags="${data[0]} ${data[1]} ${data[2]}">${data[2].split("-").join(" ")}</button>`
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
            let idList = []
            const options = { method: 'GET' };
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${search}`, options)
                .then(response => response.json()
                )
                .then(response => {
                    console.log(response)
                    response.drinks.forEach(drink => {
                        if (!Object.keys(pulls).includes(drink.idDrink)) {
                            thisObj = {
                                status: 0,
                                name: drink.strDrink,
                                img: drink.strDrinkThumb,
                                ings: [search]
                            }
                            pulls[drink.idDrink] = thisObj
                            idList.push(drink.idDrink)
                        } else {
                            pulls[drink.idDrink].ings.push(search)
                        }
                    })
                })
                .catch(err => console.error(err));

            setTimeout(() => {
                items[search] = idList
                localStorage.setItem('items', JSON.stringify(items))
                localStorage.setItem('drinks', JSON.stringify(pulls))
                return idList
            }, 500)
        }
        checkLocal(ingredient)
    }

    function toggleChoice(id, cont) {
        ostates = {
            ignored: (target) => {
                target.toggleClass('ignored')
                target.toggleClass('included')
                if (cont === 1) {
                    if (!myMixes.target().include.includes(ingredient)) {
                        myMixes.target().include.push(ingredient)
                    }
                }
            },
            included: (target) => {
                target.toggleClass('included')
                target.toggleClass('excluded')
                if (cont === 1) {
                    ind = myMixes.target().include.indexOf(ingredient)
                    myMixes.target().include.splice(ind, 1);
                    myMixes.target().exclude.push(ingredient)
                }
            },
            excluded: (target) => {
                target.toggleClass('excluded')
                target.toggleClass('ignored')
                if (cont === 1) {
                    ind = myMixes.target().exclude.indexOf(ingredient)
                    myMixes.target().exclude.splice(ind, 1)
                }
            }
        }
        currentclass = event.target.classList[1]
        ostates[currentclass]($(`#${id}`))
    }
    searchIngredient(ingredient)

    toggleChoice(id, 1)
    setTimeout(() => {
        myMixes.f.refresh(myMixes.target())
    }, 800)

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
                return `<div class="mix-container" id="mix-${mixId}"><div class="mix-header" id="header-${mixId}"><h2>Mix ${mixId}</h2><div id="filter-container" id="filter-${mixId}"><div class="filterp" id="included-${mixId}"></div><div class="filterp" id="excluded-${mixId}"></div></div><button class="editFilter" id="edit-${mixId}" data-mixid="mix-${mixId}">Edit Filter</button></div></div>`;
            },
            results: () => {
                return `<div class="response-container" id="r-${mixId}"></div>`
            },
            listener: (event) => {
                if (myMixes.selected === event.target.dataset.mixid) {
                    $('.filter-container').toggleClass("hidden")
                } else {
                    $('.filter-item').toggleClass('included excluded', false)
                    $('.filter-item').toggleClass('ignored', true)
                    console.log("*******TESTTESTTESTTEST***********")
                    console.log(myMixes.target())
                    console.log(event.target.dataset.mixid)
                    myMixes.selected = event.target.dataset.mixid
                    myMixes.target()
                    console.log(myMixes.target())
                    includes = myMixes.target().include
                    excludes = myMixes.target().exclude
                    console.log(includes, excludes)
                    includes.forEach(ing => {
                        $(ing.split(' ').join('-')).toggleClass('included', true)
                        $(ing.split(' ').join('-')).toggleClass('ignored excluded', false)
                    })
                    excludes.forEach(ing => {
                        $(ing.split(' ').join('-')).toggleClass('excluded', true)
                        $(ing.split(' ').join('-')).toggleClass('ignored included', false)
                    })
                    console.log(myMixes.selected)
                }


            },
            execute: () => {
                $(lines.element()).appendTo(lines.target[0])
                $(lines.results()).appendTo(lines.target[1])
                $(`#edit-${mixId}`).click(lines.listener)
                myMixes.selected = `#edit-${mixId}`
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