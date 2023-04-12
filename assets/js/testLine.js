const liquor = "Vodka"
const id = '11007'


testGets ={

    LiquorSearch : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${liquor}`,
    id: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`



}




let objDrink = {
    id: drink.idDrink,
    img: drink.strDrinkThumb,
    ings: [],
    ins: drink.strInstructions,
}

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