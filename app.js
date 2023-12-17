// Source for basic layout and functionality: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
const huntingGround = document.querySelector(".game-board")

// Creating our targets
let targetX
let targetY
// Creating our player1 starting points
let player1X = 8
let player1Y = 8
// Add onto player1 body after touching target
let player1Body = []
// Initializing movement
let speedX = 0
let speedY = 0

// Using math.random to change target location, and +1 to make sure that the random number does not land on 0 or 34. Sources: chatGPT and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function targetRandomizer() {
    targetX = Math.floor(Math.random() * 35) + 1;
    targetY = Math.floor(Math.random() * 35) + 1;
}

// Keyboard controls. We use the switch conditional statement instead of "if else" so that both lower and upper case keys are recognized. Switch statements perform different actions based on different conditions. W3 documentation: https://www.w3schools.com/jsref/jsref_switch.asp#:~:text=The%20switch%20statement%20is%20a,%2C%20nested%20if%2Felse%20statements.
function changeDirection(e) {
    switch (e.key) {
        case "w":
        case "W":
            speedX = 0
            speedY = -1
            break

        case "s":
        case "S":
            speedX = 0
            speedY = 1
            break
        case "d":
        case "D":
            speedX = 1
            speedY = 0
            break
        case "a":
        case "A":
            speedX = -1
            speedY = 0
            break
    }
    gameStart();
}

function gameStart() {
    // Add target
    let htmlTemplate = `<div class="target" style="grid-area: ${targetY} / ${targetX}"></div>`;

    // Check to see if player1 made contact with target, then adding onto player1 body if true.
    if(player1X === targetX && player1Y === targetY) {
        targetRandomizer();
        player1Body.push([targetX, targetY])
    }

    // This loop iterates through the body segments, excluding the head, starting from the last segment of the body through all segments up to the second one. It then updates each segment to have the position of the segment before it.  Solution found by CodingNepal: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
    for (let i = player1Body.length -1; i > 0; i--){
        player1Body[i] = player1Body[i - 1]
    }
    // Setting the first element of player1's body to the current player1 position
    player1Body[0] = [player1X, player1Y]

    player1X += speedX
    player1Y += speedY

    // Add a div for each part of the player's body when a target is reached.
    for (let i=0; i < player1Body.length; i++) {
        htmlTemplate += `<div class="player1" style="grid-area: ${player1Body[i][1]} / ${player1Body[i][0]}"></div>`;   
    }
    huntingGround.innerHTML = htmlTemplate;
}

targetRandomizer();
// Using setInterval so player moves automatically
setInterval(gameStart, 165);

//Adding event listeners for keyboard movement.
document.addEventListener("keydown", changeDirection)