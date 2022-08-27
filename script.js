
//pega o evento do botão submit pra rodar a função searchAddress
const input = document.querySelector('#cep')
const searchButton = document.querySelector('form')
const container = document.querySelector('#container')
const storageKey = 'addresses'
const addresses = []
const emptySearchText = "Você ainda não buscou um endereço, utilize o campo CEP para iniciar a busca."
const base = ` 
  <table cellspacing="0">
    <thead>
        <tr class="table_header">
          <th>CEP</th>
          <th>Endereço</th>
          <th>Bairro</th>
          <th>Cidade/Estado</th>
          <th></th>
        </tr>
    </thead>   
    <tbody id="result">
    </tbody>   
  </table>
`

document.addEventListener('DOMContentLoaded', () => {
  const storedAddresses = JSON.parse(
    window.localStorage.getItem(storageKey)
  ) || []

  storedAddresses.forEach(item => addresses.push(item))

  if (storedAddresses.length) {
    renderAddresses(storedAddresses)
    return;
  }

  container.innerHTML = emptySearchText
})

//função de validação do CEP utilizando rejex mais a 
const validateCepInput = (cep) => {    
  return cep.match(/^[0-9]{5}-[0-9]{3}$/)
}
//função assíncrona que usa o fetch pra pegar as informações do viacep
const searchCep = async (event) => {
  event.preventDefault()  
  const cep = input.value  
  const url = `https://viacep.com.br/ws/${cep}/json/`;  

  if (!validateCepInput(cep)) {
    alert('CEP Inválido');
    return;
  } 
  //if (addresses.includes(data.cep)) {
   // alert('Você já pesquisou esse CEP');
   // return;
 // } 

  const response = await fetch(url)
  const data = await response.json()

  addresses.push(data)
  saveAddresses(addresses)
  renderAddresses(addresses)  
}

const saveAddresses = (_addresses) => {
  window.localStorage.setItem(storageKey, JSON.stringify(_addresses))
}


const renderAddresses = (_addresses) => {
  insertBase()

  const tbody = document.querySelector('tbody')
  
  const tableRows = _addresses.map(address => (
    `
      <tr>
        <td>${address.cep}</td>
        <td>${address.logradouro}</td>
        <td>${address.bairro}</td>
        <td>${address.localidade}/${address.uf}</td>
        <td>
        <button type="button" id="delete">
          <img src="./img/trash-icon.png">
        </button>   
        </td>
      </tr>
    `
  ))
  tbody.innerHTML = tableRows.join('')

  const renderedRows = document.querySelectorAll('#delete')

  renderedRows.forEach((item, index) => {
    item.addEventListener('click', deleteAddress(index))
  })

}

const deleteAddress = (index) => () => {
  addresses.splice(index, 1);

  saveAddresses(addresses)
  renderAddresses(addresses)

  if (!addresses.length) container.innerHTML = emptySearchText
}

const insertBase = () => {
  const tbody = document.querySelector('tbody')
  if (!tbody) {
    container.innerHTML = base
  }
}

searchButton.addEventListener('submit', searchCep)
  

