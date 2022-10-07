(($, doc) => {
  "use strict";
  let jogoSelecionado;
  let games;
  let selectedNumbers = [];
  let gameButtons;


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
      })
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
      return a - b;
    });
    
  }

  function addToCart() {

    let $cart = window.DOM('[data-js="cart-carrinho"]').get()
    addGameToCart()

    let valorLoto = Number(2.50);
    let valorMega = Number(4.50);
    let valorQuina = Number(4.00);
    let $cartGame = document.createElement('div');
    let $dataGame = document.createElement('div');
    let title = doc.createElement('h3')
    let $imgTrash = document.createElement('img');

    if (jogoSelecionado.type === 'Lotofácil') {

      title.innerHTML += jogoSelecionado.type
      title.style.color = '#7F3992';
      title.innerHTML += ` R$: ${valorLoto}`

    } else if (jogoSelecionado.type === 'Mega-Sena') {

      title.innerHTML = jogoSelecionado.type
      title.style.color = '#01AC66';
      title.innerHTML += ` R$: ${valorMega}`

    } else if (jogoSelecionado.type === 'Quina') {

      title.innerHTML = jogoSelecionado.type
      title.style.color = '#F79C31';
      title.innerHTML += ` R$: ${valorQuina}`

    }
      
    $imgTrash.style.width = '20px'
    $imgTrash.style.height = '24px'
    $imgTrash.src = 'img/trash_gray.png'

    $imgTrash.onclick = function () {
      $cartGame.remove();
      $dataGame.remove();
      $imgTrash.remove();
      title.remove();
      alert('Jogo excluido com sucesso!')
    }

    $dataGame.style.width = '317px';
    $dataGame.style.height = '50px';
    $dataGame.style.background = '#FFFFFF'
    $dataGame.style.marginTop = '0px'
    $dataGame.style.alignItems = 'center';
    $dataGame.style.justifyContent = 'center';

    $cartGame.style.alignItems = 'center';
    $cartGame.style.flexDirection = 'row-reverse'
    $cartGame.style.justifyContent = 'space-between';
    $cartGame.style.margin = '20px';
    $cartGame.style.marginTop = '20px';
    $cartGame.style.display = 'flex';
    $cartGame.textContent = selectedNumbers;

    if (!$cartGame.textContent) {
      alert('Erro, selecione os números')
    } else {
      $cart.appendChild($dataGame);
      $cartGame.addEventListener('click', $cart);
      $dataGame.appendChild($cartGame);
      $dataGame.appendChild(title);
      $cartGame.appendChild($imgTrash)
   
    }

  }

  // essa função é a descrição de cada jogo.
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
