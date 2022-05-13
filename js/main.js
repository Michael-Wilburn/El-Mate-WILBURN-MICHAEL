// ----------------------------------------
//Elementos de la parte de productos
const productsDOM = document.querySelector(".products-center");
const titleProduct = document.querySelector("#title-product");

//Selectores de elementos que llaman a funciones
const lowHigh = document.querySelector("#lowHigh");
const highLow = document.querySelector("#highLow");

//Elementos de la parte del buscador
const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#searchInfo");

//Elementos pertenecientes a la parte del carrito
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");

//cart
let cart = [];
//botones
let buttonsDOM = [];
//Prodcutos
var productos;

const getData = async () =>{
  try {
    const resp = await fetch("../js/productos.json")
    const data = await resp.json();
    productos = data;   
    //Toma los valores de los titulos de las paginas y los convierte a variables
    switch (titleProduct.textContent.toLocaleLowerCase().split(" ").join("")) {
      case 'mates':
        productSite = productos.mates;
        break;
      case 'bombillas': 
        productSite = productos.bombillas;
        break;
      case 'mochilasmateras':
        productSite = productos.mochilasmateras;
        break;
      case 'equiposdemate':
        productSite = productos.equiposdemate;
        break;
      case 'yerberas':
        productSite = productos.yerberas;
        break;
      case 'termos':
        productSite = productos.termos;
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error)
  }

}

//Funcion que despliega los productos desde objeto productos en la pagina
const displayProducts = (products) => {
  let result = "";
  products.forEach((product) => {
    result += ` 
            <article class="product">
              <div class="img-container">
                  <button class="left" data-id=${product.id}><i class="fas fa-chevron-left"></i></button>
                  <img src=${product.images[0]} alt="product" class="product-img">
                  <button class="right" data-id=${product.id}><i class="fas fa-chevron-right"></i></button>
                  <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>agregar al carrito</button>
              </div>
              <h3>${product.name}</h3>
              <h4>$ ${product.price}</h4>
            </article>`;
  });
  productsDOM.innerHTML = result;
};

//Carga los productos al cargar la pagina
document.addEventListener("DOMContentLoaded", async () => {
  getData();
 setTimeout(() => {
   setupApp();
   displayProducts(productSite);
   saveProducts(productSite);
   getBagButtons();
   carrousel();
 }, 100);
});

//trae los botones de los productos desplegados
const getBagButtons = () => {
  //desestructuro nodo de bag-btn para tener botones por separado
  const buttons = [...document.querySelectorAll(".bag-btn")];
  buttonsDOM = buttons;
  buttons.forEach((button) => {
    let id = button.dataset.id;
    id = parseInt(id);
    let inCart = cart.find((item) => item.id === id);
    //Si el boton ya fue apredado cambia el titulo del boton y se desactiva el boton para agregar
    if (inCart) {
      button.innerText = "En el Carrito";
      button.disabled = true;
    }
    //evento que desactiva el boton
    button.addEventListener("click", (event) => {
      event.target.innerHTML = "En el Carrito";
      event.target.disabled = true;
      //traer producuto de los productos
      let cartItem = {...getProducts(id),amount:1};//agrego propiedad de amount a 1 para el contador
      // agregar productos al carrito
      cart = [...cart,cartItem];
      // guardar el carrito en el local storage
      saveCart(cart);
      // setear cantidad de productos en carrito
      setCartValues(cart);
      // mostrar producto en el carrito
      addCartItem(cartItem);
      // mostrar el carrito
      showCart();
    });
  });
};

//Seteo un contador para la cantidad de productos y el saldo total a pagar del Carrito
const setCartValues = (cart) =>{
  let billTotal = 0;
  let itemsTotal = 0;
  cart.map(item =>{
    billTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });

  //Utiliza solo dos decimales para el dinero a pagar
  cartTotal.innerHTML = parseFloat(billTotal.toFixed(2));
  cartItems.innerHTML = itemsTotal;
}

//Agrego los productos al carrito con DOM
const addCartItem = (item) =>{
  const div = document.createElement('div');
  div.classList.add('cart-item');
  div.innerHTML = `
          <img src=${item.images[0]} alt="product">
          <div>
              <h4>${item.name}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>eliminar</span>
          </div>
          <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
          </div>`;
  cartContent.appendChild(div);
}

//funcion que muestra el carrito en el sitio agregando clases css
const showCart = () =>{
  cartOverlay.classList.add('transparentBcg');
  cartDOM.classList.add('showCart');
};
cartBtn.addEventListener('click',()=>{
  showCart();
});

//funcion que esconde carrito en el removiendo clases css
const hideCart = () =>{
  cartOverlay.classList.remove('transparentBcg');
  cartDOM.classList.remove('showCart');
};
closeCartBtn.addEventListener('click',()=>{
  hideCart();
});

//Funcion que llama a otras funciones para setaer el carrito desde el local storege cuando carga la pagina
const setupApp = () =>{
  cart = getCart();
  setCartValues(cart);
  populate(cart);
};

///LOCAL STORAGE///
// Funcion que guarda en el localStorage los productos que son pasados como argumentos
const saveProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};

//Funcion que trae los productos desde el localStorage
const getProducts = (id) => {
  id = parseInt(id);
  let products = JSON.parse(localStorage.getItem("products"));
  return products.find((product) => product.id === id);
};

//Funcion que guarda los productos seleccionados en el carrito al localstorage
const saveCart = (cart) =>{
  localStorage.setItem("cart",JSON.stringify(cart));
};

//Trae los productos del carrito desde el local storage si es que existen
const getCart = () =>{
  return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')):[];
};

//Funcion que carga cada item del carrito
const populate = (cart) =>{
  cart.forEach(item => addCartItem(item));
};

//Funcion que elimina producto/productos con id y reestablece estado de los botones
const removeItem = (id) =>{
  cart = cart.filter(item => item.id != id);
  setCartValues(cart);
  saveCart(cart);
  let button = getSingleButton(id);
  if(button){
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>agregar al carrito`
  }
}

const getSingleButton = (id) =>{
  return buttonsDOM.find(btn => btn.dataset.id == id);
}

//Elimina el Carrito por completo
const clearCart = () =>{
  let cartItem = cart.map(item => item.id);
  cartItem.forEach(id => removeItem(id));
  cartContent.innerHTML='';
}
clearCartBtn.addEventListener('click',()=>{
  clearCart();
});

//Eliminar elemento especifico del carrito, agrega o quita cantidad de producto especifico
cartContent.addEventListener('click',(event)=>{
  if(event.target.classList == 'remove-item'){
    let removeOneItem = event.target;
    let id = removeOneItem.dataset.id;
    removeItem(id);
    cartContent.removeChild(removeOneItem.parentElement.parentElement)
  } else if(event.target.classList == "fas fa-chevron-up"){
    let addAmount = event.target;
    let id = addAmount.dataset.id;
    let tempItem = cart.find(item => item.id == id);
    tempItem.amount = tempItem.amount + 1;
    saveCart(cart);
    setCartValues(cart);
    addAmount.nextElementSibling.innerHTML = tempItem.amount;
  } else if(event.target.classList == "fas fa-chevron-down"){
    let lowerAmount = event.target;
    let id = lowerAmount.dataset.id;
    let tempItem = cart.find(item => item.id == id);
    tempItem.amount = tempItem.amount - 1;
    saveCart(cart);
    setCartValues(cart);
    lowerAmount.previousElementSibling.innerHTML = tempItem.amount;
    if(tempItem.amount < 1){
    removeItem(id);
    cartContent.removeChild(lowerAmount.parentElement.parentElement);
    }
  }
});

//Funcion que ordena por precio o id de menor a mayor
const lowToHigh = (arr) => {
  arr.sort((a, b) => a.price - b.price);
};

//Funcion que ordena por precio de mayor a menor
const highToLow = (arr) => {
  arr.sort((a, b) => b.price - a.price);
};

//Funcion que filtra mates por marca
let productbyBrand = [];
const filterByBrand = (brandName, arr) => {
  productbyBrand = arr.filter(function (object) {
    return object.brand == brandName;
  });
};

//Busca los productos segun la marca con click sobre el boton
btnSearch.addEventListener("click", () => {
  filterByBrand(inputSearch.value.toLocaleLowerCase(), productSite);
  displayProducts(productbyBrand);
  getBagButtons();
  carrousel();
});

//Busca los productos segun la marca aprentando la tecla enter
inputSearch.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    btnSearch.click();
  }
});

//Ordena los prodcutos de menor a mayor
lowHigh.addEventListener("click", () => {
  
  async function order() {
    return lowToHigh(productSite);
  }
  order()
          .then(displayProducts(productSite))
          .then(getBagButtons())
          .then(carrousel())
});

//Ordena los productos de mayor a menor
highLow.addEventListener("click", () => {
  async function order() {
    return highToLow(productSite); 
  }
  order()
          .then(displayProducts(productSite))
          .then(getBagButtons())
          .then(carrousel())
});

//carrousel
const carrousel = () =>{
  let leftBtn = [...document.querySelectorAll(".left")];
  let rightBtn = [...document.querySelectorAll(".right")];
  let img = [...document.querySelectorAll(".product-img")];
  
  leftBtn.forEach(element => {
    element.addEventListener('click',()=>{
      let id = element.dataset.id;
      id = parseInt(id);
      let pictures = getProducts(id).images;
        
      const idFinder = () =>{
        for (let i = 0; i < img.length; i++) {
          for(let j = 0; j < img.length; j++ ){
            if(img[i].getAttribute("src") === pictures[j]){
              return i;
            }
          }
        }
      }
      
      let id2 = idFinder();
      let position = pictures.indexOf(img[id2].getAttribute("src"));  

      const moveLeft = () => {
        if (position < 1) {
            position = pictures.length - 1;
            img[id2].src = pictures[position];
            return;
        }
        img[id2].src = pictures[position - 1];
        position--;
    }
      moveLeft();
    })
  });

  rightBtn.forEach(element => {
    element.addEventListener('click',()=>{
      let id = element.dataset.id;
      id = parseInt(id);
      let pictures = getProducts(id).images;

      const idFinder = () =>{
        for (let i = 0; i < img.length; i++) {
          for(let j = 0; j < img.length; j++ ){
            if(img[i].getAttribute("src") === pictures[j]){
              return i;
            }
          }
        }
      }
      
      let id2 = idFinder();
      let position = pictures.indexOf(img[id2].getAttribute("src")); 

      const moveRight = () => {
        if (position >= pictures.length - 1) {
            position = 0
            img[id2].src = pictures[position];
            return;
        }
        img[id2].src = pictures[position + 1];
        position++;
    }
      moveRight();
    })
  });
}
