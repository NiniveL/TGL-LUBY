(($, doc) => {
  "use strict";
  let jogoSelecionado;
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
        jogoSelecionado = games.types[0];
        createGame();
        initGamesButton();   
      };
    });
  };

  // essa função ela muda o jogo e coloca a cor do jogo selecionado
  function mudarJogo() {
    jogoSelecionado = games.types[this.id];
    selectedNumbers = [];

    gameButtons.forEach((button => {
      const gameColor = games.types.find(type => type.type === button.className).color;
      button.style.backgroundColor = 'white';
      button.style.color = gameColor;
    }))

    this.style["background-color"] = jogoSelecionado.color;
    this.style["color"] = 'white';
    createGame();
  };

  // essa função é para chamar a quantidade certa de cada jogo que for selecionado
  function clickButton(param) {
    const button = this ? this : param
    const selectedAmount = selectedNumbers.length;
    const maxNumbers = jogoSelecionado.min_and_max_number;
    const numberExist = selectedNumbers.findIndex(item =>  item === button.id)
    
    if (numberExist == -1) {
      if (selectedAmount > maxNumbers -1) {
        return false;
      }
      button.style.border = `2px solid.color(${jogoSelecionado.color})`;
      button.style["background-color"] = jogoSelecionado.color;
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
    const emptyNumbers = jogoSelecionado.min_and_max_number - selectedNumbers.length
    
    this.style["background-color"] = jogoSelecionado.color;
    this.style["color"] = 'white';
    
    for (let i = 0; i < emptyNumbers; i++) {
      const existNumbers = randomNumbers(jogoSelecionado.range);
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
    this.style["background-color"] = jogoSelecionado.color;
    this.style["color"] = 'white';
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
    addGameToCart()

    let valorLoto = Number(2.50);
    let valorMega = Number(4.50);
    let valorQuina = Number(2.00);
    let $cartGame = document.createElement('div');
    let $dataGame = document.createElement('div');
    let numberAndName = document.createElement('div');
    let containerValueAndNumber = document.createElement('div');
    let number = document.createElement('h4')
    let title = doc.createElement('h3')
    let $imgTrash = document.createElement('img');
    let $separatorColor = document.createElement('div')
    let valueGame = document.createElement('h4')

    valueGame.style.fontFamily = "roboto";
    valueGame.style.color = 'grey'
    valueGame.style.marginRight = '20px';
   
    title.style.marginRight = '20px';
    title.style.fontFamily = "Arial Black";
    title.style.fontStyle = " italic";
    title.style.fontWeight = "900";
    title.style.fontSize = "15px";
   
    if (jogoSelecionado.type === 'Lotofácil') {

      title.innerHTML += jogoSelecionado.type
      title.style.color = '#7F3992';
      valueGame.innerHTML += ` R$: ${valorLoto}`
      $separatorColor.style.backgroundColor = '#7F3992';

    } else if (jogoSelecionado.type === 'Mega-Sena') {

      title.innerHTML = jogoSelecionado.type
      title.style.color = '#01AC66';
      valueGame.innerHTML += ` R$: ${valorMega}`
      $separatorColor.style.backgroundColor = '#01AC66';

    } else if (jogoSelecionado.type === 'Quina') {

      title.innerHTML = jogoSelecionado.type
      title.style.color = '#F79C31';
      valueGame.innerHTML += ` R$: ${valorQuina}`
      $separatorColor.style.backgroundColor = '#F79C31';
    }

    $separatorColor.style.width = '15px'
    $separatorColor.style.height = '80px'
    $separatorColor.style.borderTopLeftRadius = '10px'
    $separatorColor.style.borderBottomLeftRadius = '10px'

    numberAndName.style.width = '50px'
    numberAndName.style.height = '70px'
    numberAndName.style.alignItems = 'center'
    numberAndName.style.display = 'flex'
    numberAndName.style.justifyContent = 'center'
        
    containerValueAndNumber.style.width = '190px';
    containerValueAndNumber.style.height = '40px';
    containerValueAndNumber.style.display = 'flex';
    containerValueAndNumber.style.flexDirection = 'row';
    containerValueAndNumber.style.alignItems =  'center';
    containerValueAndNumber.style.justifyContent = "flex-start";

    $imgTrash.style.width = '20px'
    $imgTrash.style.height = '24px'
    $imgTrash.src = 'img/trash_gray.png'
    $imgTrash.id = jogoSelecionado.price

    $imgTrash.onclick = function () {
      let cartTotal = window.DOM('[data-js="cart-valor"]').get()
      cartTotal.textContent = currencyFormate(sumGames) 
      $cartGame.remove();
      $dataGame.remove();
      $imgTrash.remove();
      title.remove();
      sumGames -= this.id
      console.log(sumGames);
    }

    $dataGame.style.width = '290px';
    $dataGame.style.height = '70px';
    $dataGame.style.alignItems = 'center';
    $dataGame.style.justifyContent = 'center';
    $dataGame.style.flexDirection = 'row'
    $dataGame.style.marginTop = '40px';
    $dataGame.style.display = 'flex'

    $cartGame.style.alignItems = 'flex-start';
    $cartGame.style.justifyContent = 'center';
    $cartGame.style.margin = '0px';
    $cartGame.style.marginTop = '0px';
    $cartGame.style.width = '100%'
    $cartGame.style.display = 'flex'
    $cartGame.style.flexDirection = 'column'
    $cartGame.style.height = '70px'
    $cartGame.style.padding = '10px'

    number.textContent = selectedNumbers;
    number.style.color = 'grey'
    number.style.fontFamily = "roboto";
    number.style.width = '240px'
    number.style.fontSize = "15px";

    if (!number.textContent) {
      alert('Erro, selecione os números')
    } else {
      $cart.appendChild($dataGame);
      $dataGame.appendChild(numberAndName)
      $dataGame.appendChild($separatorColor)
      $dataGame.appendChild($cartGame);
      $cartGame.appendChild(number);
      $cartGame.appendChild(containerValueAndNumber)
      containerValueAndNumber.appendChild(title);
      containerValueAndNumber.appendChild(valueGame); 
      numberAndName.appendChild($imgTrash)
      $dataGame.addEventListener('click', $cart);
    }
    valueTotal()
  }

  // essa função ela trás os valores dos jogos e faz a soma de cada Jogo adicionado ao cart
  function valueTotal() {
    let cartTotal = window.DOM('[data-js="cart-valor"]').get() 
    sumGames = sumGames + +jogoSelecionado.price
    cartTotal.textContent = currencyFormate(sumGames)
  }
  // essa função ela transforma a moeda para BRL
  function currencyFormate(price) {
    return price.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  }
  
  // essa função é a descrição e nome de cada jogo.
  function createGame() {
    let $nomeDoJogo = window.DOM('[data-js="nome-do-jogo"]').get();
    let $descricaoDoJogo = window.DOM('[data-js="descricao-do-jogo"]').get();
    $nomeDoJogo.textContent = jogoSelecionado.type;
    $descricaoDoJogo.textContent = jogoSelecionado.description;
    createBoll();
  };

  // essa função é para chamar as bolas de cada jogo que for selecionado.
  function createBoll() {
    let $bollGame = window.DOM('[data-js="boll-games"]').get();
    $bollGame.textContent = ""
    
    for (let i = 1; i <= jogoSelecionado.range; i++) {
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

  // essa função esta fazendo mudar de um jogo para outro, lotofacil, mega e Quina
  function initGamesButton() {
    games.types.forEach((games, index) => {
      let $buttonsContainer = window.DOM('[data-js="buttons-game"]').get();

      let $buttonGame = document.createElement('button');
      $buttonGame.className = games.type;
      $buttonGame.id = index;
      $buttonGame.textContent = games.type;
      $buttonGame.setAttribute("data-js", "games");
      $buttonGame.addEventListener('click', mudarJogo);
      $buttonsContainer.appendChild($buttonGame);
    })
    gameButtons = Array.from(document.querySelectorAll('[data-js="games"]')); 
  };

  initTogetherPage()
})(window, document)
