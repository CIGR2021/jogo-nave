const start = () => {
  $('.inicio').hide();

  $('.fundoGame').append("<div class='jogador anima1'></div>");
  $('.fundoGame').append("<div class='inimigo1 anima2'></div>");
  $('.fundoGame').append("<div class='inimigo2 anima4'></div>");
  $('.fundoGame').append("<div class='amigo anima3'></div>");
  $('.fundoGame').append("<div class='placar'></div>");
  $('.fundoGame').append("<div class='energia'></div>");
  
  // Principais Variáveis do Jogo
  const jogo = {};
  let velocidadeInimigo1 = 5;
  let velocidadeInimigo2 = 3;
  let velocidadeAmigo = 1;
  let velocidadeDisparo = 15;
  const DIFICULDADE = 0.3;
  const TIME = 30;
  let pontos = 0;
  let salvos = 0;
  let perdidos = 0;
  let energiaAtual = 3;
  let posicaoY = parseInt(Math.random() * 334);
  let podeAtirar = true;
  let fimDeJogo = false;
  const TECLA = {
    W: 87,
    S: 83,
    UPARROW: 38,
    DOWNARROW: 40,
    D: 68,
    SPACE: 32,
  }

  jogo.pressionou = [];
  
  // Sons
  const somDisparo = document.getElementById('somDisparo');
  const somExplosao = document.getElementById('somExplosao');
  const musica = document.getElementById('musica');
  const somGameOver = document.getElementById('somGameOver');
  const somPerdido = document.getElementById('somPerdido');
  const somResgate = document.getElementById('somResgate');

  musica.addEventListener('ended', function(){
    musica.currentTime = 0;
    musica.play();
  }, false);

  musica.play();

  // Verifica se foi pressionado alguma tecla
  $(document).keydown(function(event) {
    jogo.pressionou[event.which] = true;
  });

  $(document).keyup(function(event) {
    jogo.pressionou[event.which] = false;
  });

  // Game Loop

  const disparo = () => {
    if(podeAtirar) {
      const TIME = 30;
      podeAtirar = false;

      let topo = parseInt($('.jogador').css('top'));
      let posicaoX = parseInt($('.jogador').css('left'));
      let tiroX = posicaoX + 130;
      let topoTiro = topo + 35;

      $('.fundoGame').append("<div class='disparo'></div>");
      $('.disparo').css('top', topoTiro);
      $('.disparo').css('left', tiroX);

      const executaDisparo = () => {
        let positionX = parseInt($('.disparo').css('left'));
        
        somDisparo.play();
        $('.disparo').css('left', positionX + velocidadeDisparo);
        
        if(positionX > 900) {
          window.clearInterval(tempoDisparo);
          tempoDisparo = null;
          
          $('.disparo').remove();
          
          podeAtirar = true;
        }
      }

      let tempoDisparo = window.setInterval(executaDisparo, TIME);
    }
  }

  const moveFundo = () => {
    let esquerda = parseInt($('.fundoGame').css('background-position'));
    $('.fundoGame').css('background-position', esquerda - 1);
  }

  const moveJogador = () => {
    if(jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.UPARROW]) {
      let topo = parseInt($('.jogador').css('top'));
      $('.jogador').css('top', topo - 10);
      if(topo <= 0) {
        $('.jogador').css('top', topo);
      }
    }

    if(jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.DOWNARROW]) {
      let topo = parseInt($('.jogador').css('top'));
      $('.jogador').css('top', topo + 10);
      if(topo >= 520) {
        $('.jogador').css('top', topo);
      }
    }

    if(jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.SPACE]) {
      disparo();
    }
  }

  const moveInimigo1 = () => {
    let posicaoX = parseInt($('.inimigo1').css('left'));
    $('.inimigo1').css('left', posicaoX - velocidadeInimigo1);
    $('.inimigo1').css('top', posicaoY);
    
    if(posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334);
      $('.inimigo1').css('left', 694);
      $('.inimigo1').css('top', posicaoY);
    }
  }

  const moveInimigo2 = () => {
    let posicaoX = parseInt($('.inimigo2').css('left'));
    $('.inimigo2').css('left', posicaoX - velocidadeInimigo2);
    
    if(posicaoX <= 0) {
      $('.inimigo2').css('left', 775);
    }
  }

  const moveAmigo = () => {
    let posicaoX = parseInt($('.amigo').css('left'));
    $('.amigo').css('left', posicaoX + velocidadeAmigo);
    
    if(posicaoX > 906) {
      $('.amigo').css('left', 0);
    }
  }

  const colisao = () => {
    let colisaoJogadorInimigo1 = ($('.jogador').collision($('.inimigo1')));
    let colisaoJogadorInimigo2 = ($('.jogador').collision($('.inimigo2')));
    let colisaoDisparoInimigo1 = ($('.disparo').collision($('.inimigo1')));
    let colisaoDisparoInimigo2 = ($('.disparo').collision($('.inimigo2')));
    let colisaoJogadorAmigo = ($('.jogador').collision($('.amigo')));
    let colisaoInimigo2Amigo = ($('.inimigo2').collision($('.amigo')));
    
    const explosao1 = (inimigo1X, inimigo1Y) => {
      $('.fundoGame').append("<div class='explosao1'></div>");
      
      const div = $('.explosao1')
      const UM_SEGUNDO = 1000;
      let tempoExplosao = null;

      somExplosao.play();
      div.css('background-image', "url('/img/explosion.png')");
      div.css('top', inimigo1Y);
      div.css('left', inimigo1X);
      div.animate({width: 200, opacity: 0}, 'slow');

      const removeExplosao = () => {
        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;
      }
      
      tempoExplosao = window.setInterval(removeExplosao, UM_SEGUNDO);
    }

    const explosao2 = (inimigo2X, inimigo2Y) => {
      $('.fundoGame').append("<div class='explosao2'></div>");
      
      const div2 = $('.explosao2')
      const UM_SEGUNDO = 1000;
      let tempoExplosao2 = null;

      somExplosao.play();
      div2.css('background-image', "url('/img/explosion.png')");
      div2.css('top', inimigo2Y);
      div2.css('left', inimigo2X);
      div2.animate({width: 200, opacity: 0}, 'slow');

      const removeExplosao2 = () => {
        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2 = null;
      }
      
      tempoExplosao2 = window.setInterval(removeExplosao2, UM_SEGUNDO);
    }

    const explosao3 = (amigoX, amigoY) => {
      $('.fundoGame').append("<div class='explosao3 anima4'></div>");
      
      const div3 = $('.explosao3')
      const UM_SEGUNDO = 1000;
      let tempoExplosao3 = null;

      somPerdido.play();
      div3.css('top', amigoY);
      div3.css('left', amigoX);

      const removeExplosao3 = () => {
        div3.remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3 = null;
      }
      
      tempoExplosao3 = window.setInterval(removeExplosao3, UM_SEGUNDO);
    }

    const reposicionar = (div, TEMPO) => {
      const SEGUNDOS = TEMPO;
      let tempoColisao = null;

      const reposicionar4 = () => {
        window.clearInterval(tempoColisao);
        tempoColisao = null;

        if(fimDeJogo === false) {
          $('.fundoGame').append(div);
        }
      }

      tempoColisao = window.setInterval(reposicionar4, SEGUNDOS);
    }

    // Colisão do Jogador com Inimigo1
    if(colisaoJogadorInimigo1.length > 0) {
      let inimigo1X = parseInt($('.inimigo1').css('left'));
      let inimigo1Y = parseInt($('.inimigo1').css('top'));
      
      energiaAtual -= 1;
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $('.inimigo1').css('left', 694);
      $('.inimigo1').css('top', posicaoY);
    }

    // Colisão do Jogador com Inimigo2
    if(colisaoJogadorInimigo2.length > 0) {
      const CINCO_SEGUNDOS = 5000
      let inimigo2X = parseInt($('.inimigo2').css('left'));
      let inimigo2Y = parseInt($('.inimigo2').css('top'));
      
      energiaAtual -= 1;
      explosao2(inimigo2X, inimigo2Y);

      $('.inimigo2').remove();

      reposicionar("<div class='inimigo2'></div>", CINCO_SEGUNDOS);
    }

    // Colisão de Disparo com Inimigo1
    if(colisaoDisparoInimigo1.length > 0) {
      let inimigo1X = parseInt($('.inimigo1').css('left'));
      let inimigo1Y = parseInt($('.inimigo1').css('top'));
      
      pontos += 100;
      velocidadeInimigo1 += DIFICULDADE;
      explosao1(inimigo1X, inimigo1Y);
      $('.disparo').css('left', 950);

      posicaoY = parseInt(Math.random() * 334);
      $('.inimigo1').css('left', 694);
      $('.inimigo1').css('top', posicaoY);
    }

    // Colisão de Disparo com Inimigo2
    if(colisaoDisparoInimigo2.length > 0) {
      const CINCO_SEGUNDOS = 5000
      let inimigo2X = parseInt($('.inimigo2').css('left'));
      let inimigo2Y = parseInt($('.inimigo2').css('top'));
      
      pontos += 50;
      velocidadeInimigo2 += DIFICULDADE;
      explosao2(inimigo2X, inimigo2Y);
      $('.disparo').css('left', 950);

      $('.inimigo2').remove();

      reposicionar("<div class='inimigo2'></div>", CINCO_SEGUNDOS);
    }

    // Colisão do Jogador com Amigo
    if(colisaoJogadorAmigo.length > 0) {
      const SEIS_SEGUNDOS = 6000

      salvos += 1;
      somResgate.play();
      reposicionar("<div class='amigo anima3'></div>", SEIS_SEGUNDOS);

      $('.amigo').remove();
    }

    // Colisão do Inimigo2 com Amigo
    if(colisaoInimigo2Amigo.length > 0) {
      const SEIS_SEGUNDOS = 6000
      let amigoX = parseInt($('.amigo').css('left'));
      let amigoY = parseInt($('.amigo').css('top'));
      
      perdidos += 1;
      somPerdido.play();
      explosao3(amigoX, amigoY);
      
      $('.amigo').remove();

      reposicionar("<div class='amigo anima3'></div>", SEIS_SEGUNDOS);
    }
  }

  const placar = () => {
    $('.placar').html(`<h2>Pontos: ${pontos}   |   Salvos: ${salvos}   |   Perdidos: ${perdidos}</h2>`)
  }

  const gameOver = () => {
    fimDeJogo = true;
    musica.pause();
    somGameOver.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;
    
    $('.jogador').remove();
    $('.inimigo1').remove();
    $('.inimigo2').remove();
    $('.amigo').remove();

    $('.fundoGame').append("<div class='fim'></div>");
    $('.fim').html(`
      <h1>Game Over</h1>
      <p>Sua pontuação foi: ${pontos}</p>
      <button class='reinicia' onclick='reiniciaJogo()'>
        <h3>Jogar Novamente!</h3>
      </button>`);
  }

  const energia = () => {
    switch(energiaAtual) {
      case 3:
        $('.energia').css('background-image', 'url(/img/energia-cheia.png)');
        break;
      case 2:
        $('.energia').css('background-image', 'url(/img/energia-media.png)');
        break;
      case 1:
        $('.energia').css('background-image', 'url(/img/energia-baixa.png)');
        break;
      case 0:
        $('.energia').css('background-image', 'url(/img/energia-vazia.png)');
        gameOver();
        break;
    }
  }

  const loop = () => {
    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveAmigo();
    colisao();
    placar();
    energia();
  }
  
  jogo.timer = setInterval(loop, TIME);
}

const reiniciaJogo = () => {
  somGameOver.pause();
  $('.fim').remove();
  start();
}