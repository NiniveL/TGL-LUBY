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
        // completGame()
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
  function clickButton() {
    const selectedAmount = selectedNumbers.length;
    const maxNumbers = jogoSelecionado.min_and_max_number;
    const numberExist = selectedNumbers.findIndex(item => item === this.id);
    console.log(selectedAmount)

    if (numberExist == -1) {
      if (selectedAmount > maxNumbers - 1) {
        return false;
      }
      this.style.border = `2px solid.color(${jogoSelecionado.color})`;
      this.style["background-color"] = jogoSelecionado.color;
      selectedNumbers.push(this.id);
    } else {
      this.style["background-color"] = '#ADC0C4'
      selectedNumbers.splice(numberExist, 1);
    }
    
  };

  // essa função ela completa o game total ou parte dele se o cliente não escolher.
  function completGame() {
    const existNumber = randomNumbers(jogoSelecionado.range)
    const emptyNumbers = jogoSelecionado.min_and_max_number - selectedNumbers.length
    
    this.style["background-color"] = jogoSelecionado.color;
    this.style["color"] = 'white';
    
    for (let i = 0; i < emptyNumbers; i++) {
      selectedNumbers.push(randomNumbers(jogoSelecionado.range));
      
    }
    
    
    console.log('test:', selectedNumbers)
    console.log('test3:', existNumber)
  }
    
    
  


  // essa função ela trás os números do complete game aleatórios.
  function randomNumbers(max) {
    let num = Math.ceil(Math.random() * max);
    while (selectedNumbers.indexOf(num) >= 0) {
      num = Math.ceil(Math.random() * max);
    }
    return num
  }

  function cleanGame() {
    this.style["background-color"] = jogoSelecionado.color;
    this.style["color"] = 'white';
    selectedNumbers = [];
    createBoll()
  }

  function addToCart() {

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
      $buttonBoll.addEventListener('click', clickButton,);
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
      console.log($buttonGame)
    })
    gameButtons = Array.from(document.querySelectorAll('[data-js="games"]'));


  };

  initTogetherPage()
})(window, document)
