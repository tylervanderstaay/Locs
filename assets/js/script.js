alcs={
    baseliquors:['Gin','Vodka','Whiskey','Tequila','Rum','Brandy'],
    liqueurs:['amaretto','kahlua','campari','baileys'],
    wines:['vermouth','sherry','marsala'],
}


function getDrinks(drink){
    const options = {method: 'GET'};

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
}

const mylist = alcs.baseliquors



for(let i=0;i<mylist.length;i++){
    const newEl = $(`<button class="liq" id="${mylist[i]}">${mylist[i]}</button>`)
    newEl.appendTo('.btn-list')
}

var btnlist = $('.btn-list')[0].childNodes

function printName(event){
    console.log(event)
    let drink = event.target.id
    getDrinks(drink)

}

for(let i=1;i<7;i++){
    btnlist[i].addEventListener('click',printName)
}