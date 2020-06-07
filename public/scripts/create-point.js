function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML= "<option value>Selecione a Cidade</option>"    // essas duas linhas são para limpara e bloquear o campo de cidades
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities) /** Quando mudar o select do uf, vai liberar o getCities */

//Itens de coleta
//pegas todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)   /** Para cada item do 'itemsCollect' vai ser adicionado um evento que é o ouvidor de eventos que será o 'click' */
}

const collectedItems = document.querySelector("input[name=items]")   // atualizar o campo escondido com os itens selecionados

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    //adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id  /** o dataset pega apenas o id */

    console.log('ITEM ID:', itemId)

    // verificar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId    // isso será true ou false
        return itemFound
    })

    // se já estiver selecionado,
    if ( alreadySelected >= 0 ) {   //Maior que 0 porque 0 é a primeira posição do array (let selectedItems)
        // tirar da seleção 
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId // false
            return itemIsDifferent
        })

        selectedItems = filteredItems
    } else {
    // se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId) 
    }
        console.log(selectedItems)

        console.log('selectedItems: ', selectedItems)

    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}   

//Substitui o event.target pelo 'itemLi' 