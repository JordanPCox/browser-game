// Source for basic layout and functionality: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
const huntingGround = document.querySelector(".game-board")

// Creating our targets
let targetX
let targetY
// Creating our snakes/kittens starting points
let player1X = 8
let player1Y = 8

// Using math.random to change target location, and +1 to make sure that the random number does not land on 0 or 34. Sources: chatGPT and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function targetRandomizer() {
    targetX = Math.floor(Math.random() * 35) + 1;
    targetY = Math.floor(Math.random() * 35) + 1;
}

function gameStart() {
    let htmlTemplate = `<div class="target" style="grid-area: ${targetY} / ${targetX}"></div>`;
    htmlTemplate += `<div class="player1" style="grid-area: ${player1Y} / ${player1X}"></div>`;
    huntingGround.innerHTML = htmlTemplate;
}

targetRandomizer();
gameStart();