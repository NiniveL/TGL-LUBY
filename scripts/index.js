((_$, doc) => {
  "use strict";
  let app;
  let games;
  let selectedNumbers = [];
  let gameButtons;
  let sumGames = 0;

  function initTogetherPage() {
    readyFileGamesJson();
    initButtonEvent()
  };

  function readyFileGamesJson() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "../assets/games.json", true);
    ajax.send()
    ajax.addEventListener('readystatechange', function () {
      if (ajax.readyState === 4) {
        games = JSON.parse(ajax.responseText);
        app = games.types[0];
        createGame();
        initGamesButton();   
      };
    });
  };

   // essa função esta fazendo mudar de um jogo para outro, lotofacil, mega e Quina
   function initGamesButton() {
     games.types.forEach((games, index,) => {
       let $buttonsContainer = window.DOM('[data-js="buttons-game"]').get();
       let $buttonGame = document.createElement('button');
       $buttonGame.className = games.type;
       $buttonGame.id = index;
       $buttonGame.style = app.color;
       $buttonGame.textContent = games.type;
       $buttonGame.setAttribute("data-js", "games");
       $buttonGame.addEventListener('click', changeGame);
       $buttonsContainer.appendChild($buttonGame);  
      })

      const initialSelectedGame = document.getElementById('0')
      initialSelectedGame.style["background-color"] = games.types[0].color;
      initialSelectedGame.style["color"] = 'white';
      
    gameButtons = Array.from(document.querySelectorAll('[data-js="games"]'));
  };

  // essa função ela muda o jogo e coloca a cor do jogo selecionado
  function changeGame() {
    app = games.types[this.id];
    selectedNumbers = []
    gameButtons.forEach((button => {
      const gameColor = games.types.find(type => type.type === button.className).color;
      button.style.backgroundColor = 'white';
      button.style.color = gameColor;
    }))
    
    this.style["background-color"] = app.color;
    this.style["color"] = 'white';
    createGame();
  };

  // essa função é para chamar a quantidade certa de cada jogo que for selecionado
  function clickButton(param) {
    const button = this ? this : param;
    const selectedAmount = selectedNumbers.length;
    const maxNumbers = app.min_and_max_number;
    const numberExist = selectedNumbers.findIndex(item =>  item === button.id);
    
    if (numberExist == -1) {
      if (selectedAmount > maxNumbers -1) {
        alert('maximum number of balls selected')
        return false;
      }
      button.style.border = `2px solid.color(${app.color})`;
      button.style["background-color"] = app.color;
      selectedNumbers.push(button.id);
    } else{
      button.style["background-color"] = '#ADC0C4'
      selectedNumbers.splice(numberExist, 1); 
    } 
  };

  // essa função ela completa o game total ou parte dele se o cliente não escolher.
  function completGame() {
    let $bolls = window.DOM('[data-js="boll-games"]').get().children;
    let bollsArray = Array.from($bolls)
    const emptyNumbers = app.min_and_max_number - selectedNumbers.length

    this.style["background-color"] = app.color;
    this.style["color"] = 'white';
    
    for (let i = 0; i < emptyNumbers; i++) {
      const existNumbers = randomNumbers(app.range);
      const $boll = bollsArray.find(value => { 
        return +value.id === existNumbers
      }); 
      clickButton($boll)  
    }
  } 
    
  // essa função ela trás os números do complete game aleatórios.
  function randomNumbers(max) {
    let num = Math.ceil(Math.random() * max);
    while (selectedNumbers.indexOf(num.toString()) >= 0) {
      num = Math.ceil(Math.random() * max); 
    }
    return num;
  }

  // essa função ela limpa o jogo.
  function cleanGame() {
    selectedNumbers = [];
    createBoll()
  }
  
  function addGameToCart() {
    selectedNumbers.sort((a, b) => {
      return a -= b;
    });    
  }

  // essa função ela adiciona os jogos no cart
  function addToCart() {
    let $cart = window.DOM('[data-js="cart-carrinho"]').get()
    const emptyCartMessage = document.querySelector('[data-js="remove-text"]')
    emptyCartMessage.classList.add('emptyCart')
    addGameToCart()
    
    let $cartGame = document.createElement('div');
    let $dataGame = document.createElement('div');
    let containeTrash = document.createElement('div');
    let containerValueAndNumber = document.createElement('div');
    let number = document.createElement('h4')
    let title = doc.createElement('h3')
    let $imgTrash = document.createElement('img');
    let $separatorColor = document.createElement('div')
    let valueGame = document.createElement('h4')

    valueGame.style.fontFamily = 'IBM Plex Sans';
    valueGame.style.fontWeight = "600";
    valueGame.style.color = '#868686'
    valueGame.style.marginRight = '16px';
    
    title.style.marginRight = '20px';
    title.style.fontFamily = 'IBM Plex Sans';
    title.style.fontStyle = " italic";
    title.style.fontWeight = "600";
    title.style.fontSize = "17px";
    
    if (app.type !== app.price) {

      title.innerHTML += app.type
      title.style.color = app.color;
      valueGame.innerHTML += `R$ ${app.price}`
      $separatorColor.style.backgroundColor = app.color;

    } else if (app.type === app.price) {

      title.innerHTML = app.type
      title.style.color = app.color;
      valueGame.innerHTML += app.price;
      $separatorColor.style.backgroundColor = app.color;

    } else if (app.type === app.price) {

      title.innerHTML = app.type
      title.style.color = app.color;
      valueGame.innerHTML += app.price;
      $separatorColor.style.backgroundColor = app.color;
    }

    else if (app.type === app.price) {

      title.innerHTML = app.type
      title.style.color = app.color;
      valueGame.innerHTML += app.price;
      $separatorColor.style.backgroundColor = app.color;
    }

    $separatorColor.style.marginLeft = '7px'
    $separatorColor.style.width = '7px'
    $separatorColor.style.height = '80px'
    $separatorColor.style.borderTopLeftRadius = '10px'
    $separatorColor.style.borderBottomLeftRadius = '10px'
      
    containerValueAndNumber.style.width = '190px';
    containerValueAndNumber.style.height = '40px';
    containerValueAndNumber.style.display = 'flex';
    containerValueAndNumber.style.marginTop = '-15px';
    containerValueAndNumber.style.alignItems =  'center';

    $imgTrash.style.width = '20px'
    $imgTrash.style.height = '24px'
    $imgTrash.src = 'img/trash_gray.png'
    $imgTrash.id = app.price

    $imgTrash.onclick = function () {
      $cartGame.remove();
      $dataGame.remove();
      $imgTrash.remove();
      title.remove();
      // text.remove();
      sumGames -= this.id
      remuveCart();
    }

    $dataGame.style.width = '290px';
    $dataGame.style.height = '70px';
    $dataGame.style.alignItems = 'center';
    $dataGame.style.marginTop = '40px';
    $dataGame.style.display = 'flex'
    
    $cartGame.style.justifyContent = 'center';
    $cartGame.style.width = '150%';
    $cartGame.style.padding = '10px';
    $cartGame.style.flexWrap = 'wrap';
   
    number.textContent = selectedNumbers;
    number.style.color = '#868686';
    number.style.display = 'flexbox';
    number.style.fontFamily = 'IBM Plex Sans';
    number.style.fontStyle = " italic";
    number.style.width = '20px';
    number.style.fontSize = "17px";
    
    
    if (!number.textContent) {
      alert('Mistake! select game numbers')
    } else {
      $cart.appendChild($dataGame);
      $dataGame.appendChild(containeTrash)
      $dataGame.appendChild($separatorColor)
      $dataGame.appendChild($cartGame);
      $cartGame.appendChild(number);
      $cartGame.appendChild(containerValueAndNumber)
      containerValueAndNumber.appendChild(title);
      containerValueAndNumber.appendChild(valueGame); 
      containeTrash.appendChild($imgTrash)
      $dataGame.addEventListener('click', $cart);
      valueTotal()
      cleanGame();
      text.remove()
    }
  }

  // essa função ela trás os valores dos jogos e faz a soma de cada Jogo adicionado ao cart
  function valueTotal() {
    let cartTotal = window.DOM('[data-js="cart-valor"]').get() 
    sumGames += app.price
    cartTotal.textContent = currencyFormate(sumGames)
  }

  // essa função ela transforma a moeda para BRL
  function currencyFormate(price) {
    return price.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // essa função ela remove o valor do jogo quando o jogo também é removido
  function remuveCart() {
    let cartTotal = window.DOM('[data-js="cart-valor"]').get() 
    cartTotal.textContent = currencyFormate(sumGames)
    // sumGames.remove()

    if(sumGames == 0){
      const emptyCartMessage = document.querySelector('[data-js="remove-text"]')
      emptyCartMessage.classList.remove('emptyCart')
    }
  }
  
  // essa função é a descrição e nome de cada jogo.
  function createGame() {
    let $nomeDoJogo = window.DOM('[data-js="nome-do-jogo"]').get();
    let $descricaoDoJogo = window.DOM('[data-js="descricao-do-jogo"]').get();
    $nomeDoJogo.textContent = app.type;
    $descricaoDoJogo.textContent = app.description;
    createBoll();
  };

  // essa função é para chamar as bolas de cada jogo que for selecionado.
  function createBoll() {
    let $bollGame = window.DOM('[data-js="boll-games"]').get();
    $bollGame.textContent = ""
    
    for (let i = 1; i <= app.range; i++) {
      let $buttonBoll = document.createElement('button');
      $buttonBoll.className = 'bolas';
      $buttonBoll.id = i;
      $buttonBoll.type = 'button';
      $buttonBoll.textContent = i;
      $buttonBoll.addEventListener('click', clickButton);
      $bollGame.appendChild($buttonBoll);  
    }
  }
  
  function initButtonEvent() {
    doc.querySelector('[data-js="complete-game"]').addEventListener('click', completGame);
    doc.querySelector('[data-js="clear-game"]').addEventListener('click', cleanGame);
    doc.querySelector('[data-js="add-to-cart"]').addEventListener('click', addToCart);
  }

  initTogetherPage()
})(window, document)
