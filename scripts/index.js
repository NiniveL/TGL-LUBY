(($,doc) => {
  "use strict";
  let jogoSelecionado;
  let games;
  let selectedNumbers = [];
   

  function initTogetherPage() {
    readyFileGamesJson();
    initEvent();
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


  function mudarJogo() {
    jogoSelecionado = games.types[this.id];
    
    console.log('botão clicado:', jogoSelecionado); 
    
    games.types.forEach((type) => {

      if(jogoSelecionado == type) {
        console.log('selecionado:', type);

        this.style.border = `2px solid.color(${jogoSelecionado.color})`;
        this.style["background-color"] = jogoSelecionado.color;
        this.style["color"] = 'white'
        
      }else {
        console.log('Não selecionado:', type); 

        this.style.border = `2px solid.color(${jogoSelecionado.color})`;
        this.style["background-color"] = 'white';
        this.style["color"] = jogoSelecionado.color;   
      }
      
    }); 
    createGame(); 
  };

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
    $bollGame.textContent=""
    
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
  
  // essa função é para chamar a quantidade certa de cada jogo que for selecionado
  function clickButton() {
    const selectedAmount = selectedNumbers.length;
    const maxNumbers = jogoSelecionado.min_and_max_number;
    const numberExist = selectedNumbers.findIndex(item => item === this.id);

    if(numberExist == -1) {
      if(selectedAmount > maxNumbers -1) {
        return false;
      }
      this.style.border = `2px solid.color(${jogoSelecionado.color})`;
      this.style["background-color"] = jogoSelecionado.color;
      selectedNumbers.push(this.id);
    }else{
      this.style["background-color"] = '#ADC0C4'
      selectedNumbers.splice(numberExist, 1);
    }
    
  };


  function initEvent() { 
   
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
      console.log($buttonGame);
    })
  };

  initTogetherPage()
})(window, document)



