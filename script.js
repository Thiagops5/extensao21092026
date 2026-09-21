let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let elementoPontuacao = document.getElementById("score");
let elementoRecorde = document.getElementById("highScore");

let botaoPausa = document.getElementById("pause-btn");
let botoesControle = document.querySelectorAll(".ctrl-btn");

let telaMenu = document.getElementById("overlay-menu");
let telaPausa = document.getElementById("overlay-pause");
let telaGameOver = document.getElementById("overlay-gameover");

let botaoIniciar = document.getElementById("start-btn");
let botaoContinuar = document.getElementById("resume-btn");
let botaoTentarDeNovo = document.getElementById("retry-btn");

let pontuacaoFinal = document.getElementById("final-score");
let recordeFinal = document.getElementById("final-highscore");
let medalhaNovoRecorde = document.getElementById("new-record-badge");

let QUANTIDADE_CASAS = 20;
let tamanhoCasa;
let cobra = [];
let comidas = [];
let maximoComidas = 1;

let direcaoX = 0;
let direcaoY = 0;

let pontuacao = 0;
let recorde = parseInt(localStorage.getItem("snake-high-score")) || 0;
let loopDoJogo;

let jogoAcabou = false;
let jogoPausado = false;
let mudandoDirecao = false;
let ehNovoRecorde = false;

let velocidadeAtual = 120;
let velocidadeBase = 120;

let particulas = [];
let textosFlutuantes = [];
let tempoAnimacaoComida = 0;

elementoRecorde.innerText = recorde;

function ajustarTamanhoCanvas() {
    let container = canvas.parentElement;
    let tamanho = container.clientWidth;

    canvas.width = tamanho;
    canvas.height = tamanho;

    tamanhoCasa = tamanho / QUANTIDADE_CASAS;
}

ajustarTamanhoCanvas();

let observadorDeTamanho = new ResizeObserver(function() {
    ajustarTamanhoCanvas();
});

observadorDeTamanho.observe(canvas.parentElement);

function reiniciarJogo(dificuldade) {
    cobra = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];

    direcaoX = 0;
    direcaoY = -1;

    pontuacao = 0;
    jogoAcabou = false;
    jogoPausado = false;
    ehNovoRecorde = false;
    mudandoDirecao = false;
    particulas = [];
    textosFlutuantes = [];
    tempoAnimacaoComida = 0;

    elementoPontuacao.innerText = pontuacao;

    if (dificuldade === 'easy') {
        velocidadeBase = 170;
        velocidadeAtual = 170;
        maximoComidas = 1;
    } else if (dificuldade === 'medium') {
        velocidadeBase = 120;
        velocidadeAtual = 120;
        maximoComidas = 1;
    } else if (dificuldade === 'hard') {
        velocidadeBase = 80;
        velocidadeAtual = 80;
        maximoComidas = 2;
    }

    inicializarComidas();
}

function inicializarComidas() {
    comidas = [];

    for (let i = 0; i < maximoComidas; i++) {
        comidas.push(gerarPosicaoComida());
    }
}

function gerarPosicaoComida() {
    let novaComida;
    let posicaoOcupada = true;

    while (posicaoOcupada) {
        novaComida = {
            x: Math.floor(Math.random() * QUANTIDADE_CASAS),
            y: Math.floor(Math.random() * QUANTIDADE_CASAS)
        };

        let emCimaDaCobra = cobra.some(function(pedaco) {
            return pedaco.x === novaComida.x && pedaco.y === novaComida.y;
        });

        let emCimaDeOutraComida = comidas.some(function(comida) {
            return comida.x === novaComida.x && comida.y === novaComida.y;
        });

        posicaoOcupada = emCimaDaCobra || emCimaDeOutraComida;
    }

    return novaComida;
}

function rodarJogo() {
    if (jogoAcabou || jogoPausado) return;

    mudandoDirecao = false;
    tempoAnimacaoComida = tempoAnimacaoComida + 0.08;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1a2235";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    desenharGrade();
    moverCobra();
    verificarColisao();

    if (jogoAcabou) {
        desenharComida();
        desenharCobra();
        criarParticulasMorte();
        processarGameOver();
        animarGameOver();
        return;
    }

    desenharComida();
    desenharCobra();

    atualizarParticulas();
    desenharParticulas();
    atualizarTextosFlutuantes();
    desenharTextosFlutuantes();

    loopDoJogo = setTimeout(rodarJogo, velocidadeAtual);
}

function desenharGrade() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
    ctx.lineWidth = 0.5;

    for (let i = 1; i < QUANTIDADE_CASAS; i++) {
        let posicao = i * tamanhoCasa;

        ctx.beginPath();
        ctx.moveTo(posicao, 0);
        ctx.lineTo(posicao, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, posicao);
        ctx.lineTo(canvas.width, posicao);
        ctx.stroke();
    }
}

function moverCobra() {
    let novaCabeca = {
        x: cobra[0].x + direcaoX,
        y: cobra[0].y + direcaoY
    };

    cobra.unshift(novaCabeca);

    let indiceComidaComida = comidas.findIndex(function(comida) {
        return comida.x === novaCabeca.x && comida.y === novaCabeca.y;
    });

    if (indiceComidaComida !== -1) {
        pontuacao = pontuacao + 1;
        elementoPontuacao.innerText = pontuacao;

        elementoPontuacao.classList.remove('pop');
        void elementoPontuacao.offsetWidth;
        elementoPontuacao.classList.add('pop');

        if (pontuacao > recorde) {
            recorde = pontuacao;
            elementoRecorde.innerText = recorde;
            localStorage.setItem("snake-high-score", recorde);
            ehNovoRecorde = true;
        }

        if (velocidadeAtual > 45) {
            velocidadeAtual = velocidadeAtual - 2;
        }

        criarParticulasComida(comidas[indiceComidaComida].x, comidas[indiceComidaComida].y);
        criarTextoFlutuante(comidas[indiceComidaComida].x, comidas[indiceComidaComida].y);

        comidas[indiceComidaComida] = gerarPosicaoComida();
    } else {
        cobra.pop();
    }
}

function desenharCobra() {
    let totalPedacos = cobra.length;

    for (let i = 0; i < cobra.length; i++) {
        let pedaco = cobra[i];

        let x = pedaco.x * tamanhoCasa;
        let y = pedaco.y * tamanhoCasa;
        let tamanho = tamanhoCasa;

        let espacoInterno = tamanho * 0.08;
        let tamanhoQuadrado = tamanho - espacoInterno * 2;
        let raioCantos = tamanho * 0.25;

        let t = 0;
        if (totalPedacos > 1) {
            t = i / (totalPedacos - 1);
        }

        let corCabeca = { r: 103, g: 232, b: 249 };
        let corRabo = { r: 8, g: 145, b: 178 };

        let r = Math.round(corCabeca.r + (corRabo.r - corCabeca.r) * t);
        let g = Math.round(corCabeca.g + (corRabo.g - corCabeca.g) * t);
        let b = Math.round(corCabeca.b + (corRabo.b - corCabeca.b) * t);

        if (i === 0) {
            ctx.shadowBlur = 18;
            ctx.shadowColor = "rgba(34, 211, 238, 0.6)";
        } else {
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(34, 211, 238, 0.2)";
        }

        ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";

        desenharRetanguloArredondado(
            x + espacoInterno,
            y + espacoInterno,
            tamanhoQuadrado,
            tamanhoQuadrado,
            raioCantos
        );
        ctx.fill();

        if (i === 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            desenharRetanguloArredondado(
                x + espacoInterno + tamanhoQuadrado * 0.15,
                y + espacoInterno + tamanhoQuadrado * 0.1,
                tamanhoQuadrado * 0.7,
                tamanhoQuadrado * 0.35,
                raioCantos * 0.6
            );
            ctx.fill();
        }
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    desenharOlhos();
}

function desenharOlhos() {
    let cabeca = cobra[0];

    let centroX = cabeca.x * tamanhoCasa + tamanhoCasa / 2;
    let centroY = cabeca.y * tamanhoCasa + tamanhoCasa / 2;

    let raioOlho = tamanhoCasa * 0.09;
    let raioPupila = tamanhoCasa * 0.05;
    let distanciaLateral = tamanhoCasa * 0.18;
    let distanciaFrente = tamanhoCasa * 0.08;

    let olho1x, olho1y, olho2x, olho2y;

    if (direcaoX === 1) {
        olho1x = centroX + distanciaFrente; olho1y = centroY - distanciaLateral;
        olho2x = centroX + distanciaFrente; olho2y = centroY + distanciaLateral;
    } else if (direcaoX === -1) {
        olho1x = centroX - distanciaFrente; olho1y = centroY - distanciaLateral;
        olho2x = centroX - distanciaFrente; olho2y = centroY + distanciaLateral;
    } else if (direcaoY === -1) {
        olho1x = centroX - distanciaLateral; olho1y = centroY - distanciaFrente;
        olho2x = centroX + distanciaLateral; olho2y = centroY - distanciaFrente;
    } else {
        olho1x = centroX - distanciaLateral; olho1y = centroY + distanciaFrente;
        olho2x = centroX + distanciaLateral; olho2y = centroY + distanciaFrente;
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(olho1x, olho1y, raioOlho, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(olho2x, olho2y, raioOlho, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0a0e1a";
    ctx.beginPath();
    ctx.arc(olho1x, olho1y, raioPupila, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(olho2x, olho2y, raioPupila, 0, Math.PI * 2);
    ctx.fill();
}

function desenharComida() {
    for (let i = 0; i < comidas.length; i++) {
        let comida = comidas[i];

        let centroX = comida.x * tamanhoCasa + tamanhoCasa / 2;
        let centroY = comida.y * tamanhoCasa + tamanhoCasa / 2;

        let raioBase = (tamanhoCasa / 2) - tamanhoCasa * 0.12;
        let pulso = 1 + Math.sin(tempoAnimacaoComida) * 0.08;
        let raio = raioBase * pulso;

        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(249, 115, 22, 0.5)";

        let gradiente = ctx.createRadialGradient(
            centroX - raio * 0.3, centroY - raio * 0.3, raio * 0.1,
            centroX, centroY, raio
        );
        gradiente.addColorStop(0, "#fbbf24");
        gradiente.addColorStop(0.7, "#f97316");
        gradiente.addColorStop(1, "#ea580c");

        ctx.fillStyle = gradiente;
        ctx.beginPath();
        ctx.arc(centroX, centroY, raio, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(centroX - raio * 0.25, centroY - raio * 0.25, raio * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    }
}

function desenharRetanguloArredondado(x, y, largura, altura, raio) {
    raio = Math.min(raio, largura / 2, altura / 2);

    ctx.beginPath();
    ctx.moveTo(x + raio, y);
    ctx.arcTo(x + largura, y, x + largura, y + altura, raio);
    ctx.arcTo(x + largura, y + altura, x, y + altura, raio);
    ctx.arcTo(x, y + altura, x, y, raio);
    ctx.arcTo(x, y, x + largura, y, raio);
    ctx.closePath();
}

function criarParticulasComida(comidaX, comidaY) {
    let centroX = comidaX * tamanhoCasa + tamanhoCasa / 2;
    let centroY = comidaY * tamanhoCasa + tamanhoCasa / 2;

    let cores = ["#fbbf24", "#f97316", "#ea580c", "#22d3ee"];

    for (let i = 0; i < 10; i++) {
        let angulo = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
        let velocidade = 1.5 + Math.random() * 2.5;

        particulas.push({
            x: centroX,
            y: centroY,
            vx: Math.cos(angulo) * velocidade,
            vy: Math.sin(angulo) * velocidade,
            life: 1,
            decay: 0.025 + Math.random() * 0.02,
            size: 2 + Math.random() * 3,
            color: cores[Math.floor(Math.random() * cores.length)]
        });
    }
}

function criarParticulasMorte() {
    let cabeca = cobra[0];
    let centroX = cabeca.x * tamanhoCasa + tamanhoCasa / 2;
    let centroY = cabeca.y * tamanhoCasa + tamanhoCasa / 2;

    let cores = ["#f43f5e", "#e11d48", "#fb7185", "#fda4af"];

    for (let i = 0; i < 20; i++) {
        let angulo = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
        let velocidade = 2 + Math.random() * 3;

        particulas.push({
            x: centroX,
            y: centroY,
            vx: Math.cos(angulo) * velocidade,
            vy: Math.sin(angulo) * velocidade,
            life: 1,
            decay: 0.015 + Math.random() * 0.01,
            size: 2 + Math.random() * 4,
            color: cores[Math.floor(Math.random() * cores.length)]
        });
    }
}

function atualizarParticulas() {
    for (let i = particulas.length - 1; i >= 0; i--) {
        let p = particulas[i];

        p.x = p.x + p.vx;
        p.y = p.y + p.vy;

        p.vx = p.vx * 0.96;
        p.vy = p.vy * 0.96;

        p.life = p.life - p.decay;

        if (p.life <= 0) {
            particulas.splice(i, 1);
        }
    }
}

function desenharParticulas() {
    for (let i = 0; i < particulas.length; i++) {
        let p = particulas[i];

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

function criarTextoFlutuante(comidaX, comidaY) {
    textosFlutuantes.push({
        x: comidaX * tamanhoCasa + tamanhoCasa / 2,
        y: comidaY * tamanhoCasa,
        text: "+1",
        life: 1,
        decay: 0.025
    });
}

function atualizarTextosFlutuantes() {
    for (let i = textosFlutuantes.length - 1; i >= 0; i--) {
        let texto = textosFlutuantes[i];

        texto.y = texto.y - 0.8;
        texto.life = texto.life - texto.decay;

        if (texto.life <= 0) {
            textosFlutuantes.splice(i, 1);
        }
    }
}

function desenharTextosFlutuantes() {
    for (let i = 0; i < textosFlutuantes.length; i++) {
        let texto = textosFlutuantes[i];

        ctx.globalAlpha = texto.life;
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold " + (tamanhoCasa * 0.7) + "px Inter, sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(texto.text, texto.x, texto.y);
    }

    ctx.globalAlpha = 1;
}

function verificarColisao() {
    let cabeca = cobra[0];

    if (cabeca.x < 0 || cabeca.x >= QUANTIDADE_CASAS || cabeca.y < 0 || cabeca.y >= QUANTIDADE_CASAS) {
        jogoAcabou = true;
    }

    for (let i = 1; i < cobra.length; i++) {
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
            jogoAcabou = true;
        }
    }
}

function processarGameOver() {
    clearTimeout(loopDoJogo);

    pontuacaoFinal.innerText = pontuacao;
    recordeFinal.innerText = recorde;

    if (ehNovoRecorde) {
        medalhaNovoRecorde.classList.remove("hidden");
    } else {
        medalhaNovoRecorde.classList.add("hidden");
    }

    let container = canvas.parentElement;
    container.classList.add("shake");
    setTimeout(function() {
        container.classList.remove("shake");
    }, 500);

    setTimeout(function() {
        mostrarTela(telaGameOver);
        botaoPausa.classList.add("hidden");
    }, 600);
}

function animarGameOver() {
    if (particulas.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a2235";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    desenharGrade();
    desenharComida();
    desenharCobra();
    atualizarParticulas();
    desenharParticulas();
    atualizarTextosFlutuantes();
    desenharTextosFlutuantes();

    requestAnimationFrame(animarGameOver);
}

function mostrarTela(tela) {
    tela.classList.add("active");
}

function esconderTela(tela) {
    tela.classList.remove("active");
}

function esconderTodasAsTelas() {
    telaMenu.classList.remove("active");
    telaPausa.classList.remove("active");
    telaGameOver.classList.remove("active");
}

function alternarPausa() {
    if (jogoAcabou) return;

    if (jogoPausado) {
        jogoPausado = false;
        esconderTela(telaPausa);
        atualizarIconePausa(false);
        rodarJogo();
    } else {
        jogoPausado = true;
        clearTimeout(loopDoJogo);
        mostrarTela(telaPausa);
        atualizarIconePausa(true);
    }
}

function atualizarIconePausa(estaPausado) {
    let iconePausa = botaoPausa.querySelector('.pause-icon');
    let iconePlay = botaoPausa.querySelector('.play-icon');

    if (estaPausado) {
        iconePausa.classList.add('hidden');
        iconePlay.classList.remove('hidden');
    } else {
        iconePausa.classList.remove('hidden');
        iconePlay.classList.add('hidden');
    }
}

function mudarDirecao(tecla) {
    if (mudandoDirecao || jogoAcabou) return;

    let indoParaCima = (direcaoY === -1);
    let indoParaBaixo = (direcaoY === 1);
    let indoParaDireita = (direcaoX === 1);
    let indoParaEsquerda = (direcaoX === -1);

    if ((tecla === "ArrowUp" || tecla === "w" || tecla === "W") && !indoParaBaixo) {
        direcaoX = 0;
        direcaoY = -1;
        mudandoDirecao = true;
    } else if ((tecla === "ArrowDown" || tecla === "s" || tecla === "S") && !indoParaCima) {
        direcaoX = 0;
        direcaoY = 1;
        mudandoDirecao = true;
    } else if ((tecla === "ArrowLeft" || tecla === "a" || tecla === "A") && !indoParaDireita) {
        direcaoX = -1;
        direcaoY = 0;
        mudandoDirecao = true;
    } else if ((tecla === "ArrowRight" || tecla === "d" || tecla === "D") && !indoParaEsquerda) {
        direcaoX = 1;
        direcaoY = 0;
        mudandoDirecao = true;
    }
}

window.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape" || evento.key === "p" || evento.key === "P") {
        if (!jogoAcabou && !telaMenu.classList.contains("active")) {
            alternarPausa();
        }
        return;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(evento.key)) {
        evento.preventDefault();
    }

    if (!jogoPausado) {
        mudarDirecao(evento.key);
    }
});

botoesControle.forEach(function(botao) {
    botao.addEventListener("click", function() {
        if (!jogoPausado) {
            mudarDirecao(botao.dataset.key);
        }
    });
});

let toqueInicialX = 0;
let toqueInicialY = 0;
let DISTANCIA_MINIMA_SWIPE = 30;

canvas.addEventListener("touchstart", function(evento) {
    let toque = evento.touches[0];
    toqueInicialX = toque.clientX;
    toqueInicialY = toque.clientY;
}, { passive: true });

canvas.addEventListener("touchend", function(evento) {
    if (jogoPausado || jogoAcabou) return;

    let toque = evento.changedTouches[0];
    let movimentoX = toque.clientX - toqueInicialX;
    let movimentoY = toque.clientY - toqueInicialY;

    if (Math.abs(movimentoX) < DISTANCIA_MINIMA_SWIPE && Math.abs(movimentoY) < DISTANCIA_MINIMA_SWIPE) {
        return;
    }

    if (Math.abs(movimentoX) > Math.abs(movimentoY)) {
        if (movimentoX > 0) {
            mudarDirecao("ArrowRight");
        } else {
            mudarDirecao("ArrowLeft");
        }
    } else {
        if (movimentoY > 0) {
            mudarDirecao("ArrowDown");
        } else {
            mudarDirecao("ArrowUp");
        }
    }
}, { passive: true });

botaoPausa.addEventListener("click", alternarPausa);

function iniciarJogo() {
    clearTimeout(loopDoJogo);

    let dificuldadeEscolhida = document.querySelector('input[name="difficulty"]:checked').value;

    esconderTodasAsTelas();

    botaoPausa.classList.remove("hidden");
    atualizarIconePausa(false);

    reiniciarJogo(dificuldadeEscolhida);
    rodarJogo();
}

botaoIniciar.addEventListener("click", iniciarJogo);
botaoTentarDeNovo.addEventListener("click", iniciarJogo);
botaoContinuar.addEventListener("click", alternarPausa);

function desenharTelaInicial() {
    ctx.fillStyle = "#1a2235";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    desenharGrade();
}

desenharTelaInicial();