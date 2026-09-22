# 🐍 Snake Game Pro

Esse é um jogo da cobrinha que eu fiz usando **HTML**, **CSS** e **JavaScript puro** (sem nenhum framework ou biblioteca).

O jogo roda direto no navegador, é só abrir o arquivo `index.html` e jogar!

---

## 📸 Como funciona

Basicamente a cobrinha se move pelo tabuleiro e o objetivo é comer as comidinhas laranjas que aparecem na tela. Cada vez que ela come, ela cresce e ganha 1 ponto. O jogo acaba se a cobra bater na parede ou no próprio corpo.

Tem 3 modos de dificuldade:
- **Fácil** → a cobra anda devagar
- **Médio** → velocidade normal
- **Difícil** → cobra rápida e aparece 2 comidas ao mesmo tempo

A pontuação mais alta fica salva no navegador (usa o `localStorage`), então mesmo se fechar a página o recorde continua lá.

---

## 📁 Estrutura dos arquivos

O projeto tem só 3 arquivos principais:

```
📂 extensao21092026/
├── index.html   ← estrutura da página (botões, placar, canvas, etc)
├── style.css    ← toda a parte visual (cores, fontes, animações)
└── script.js    ← a lógica do jogo inteiro (movimentação, colisão, pontuação)
```

---

## 🎮 Controles

| Ação | Teclado | Celular |
|------|---------|---------|
| Mover para cima | `↑` ou `W` | Botão ▲ ou swipe pra cima |
| Mover para baixo | `↓` ou `S` | Botão ▼ ou swipe pra baixo |
| Mover para esquerda | `←` ou `A` | Botão ◄ ou swipe pra esquerda |
| Mover para direita | `→` ou `D` | Botão ► ou swipe pra direita |
| Pausar / Despausar | `Esc` ou `P` | Botão de pausa na tela |

---

## 🛠️ Tecnologias usadas

- **HTML5** → pra montar a estrutura da página e o `<canvas>` onde o jogo é desenhado
- **CSS3** → pra estilizar tudo (usei bastante variáveis CSS, flexbox e media queries pra ficar responsivo)
- **JavaScript** → pra toda a lógica do jogo (movimentação, colisão, pontuação, efeitos visuais)

---

## 💡 O que eu aprendi fazendo esse projeto

- Como usar o **Canvas API** pra desenhar coisas na tela (retângulos, círculos, linhas)
- Como fazer um **game loop** usando `setTimeout`
- Como detectar **teclas do teclado** e **toques na tela** do celular
- Como usar **localStorage** pra salvar dados no navegador
- Como fazer o site ficar **responsivo** (funcionar bem no celular e no computador)
- Como criar **efeitos de partículas** e animações com JavaScript

---

## 🚀 Como rodar

1. Baixa ou clona esse repositório
2. Abre o arquivo `index.html` no navegador
3. Escolhe a dificuldade e clica em "Jogar"
4. Diverte-se! 🎉

Não precisa instalar nada, não precisa de servidor, é só abrir o HTML e jogar.

---

## 📝 Observações

- O jogo foi feito pra funcionar tanto no computador quanto no celular
- No celular aparecem botões de seta na tela e também dá pra controlar com swipe
- A cobra vai acelerando conforme come (fica mais desafiador!)
- Quando bate o recorde aparece uma mensagem especial de "Novo Recorde! ★"

