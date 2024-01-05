// Sources for basic layout and functionality: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/ & https://codepen.io/andhouse/pen/wzjKjw
const stage = document.querySelector(".game-board")
const scoreTracker = document.querySelector(".current-score")
const highScoreTracker = document.querySelector(".high-score")
const snakeGif = document.getElementById("snakeGif")
const controls = document.querySelectorAll(".controls i")

let highScore = parseInt(localStorage.getItem("high-score")) || 0;
highScoreTracker.innerText = `High Score: ${highScore}`

let gameOver = false;
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
//Record score
let score = 0

// Establishing snake starting speed, and the icrement for each time a target is eaten.
let snakeSpeed = 165
let speedIncrement = 6

//Adding event listeners for keyboard movement.
document.addEventListener("keydown", changeDirection)

// Using Math.random to generate a random number between 0 (inclusive) and 30 (exclusive). Math.floor will round down to the nearest whole number. THe +1 ensures that the result is somewhere within 1-30 instead of 0-29. This function is randomizing the location of the nxt food target. Sources: chatGPT and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function targetRandomizer() {
    targetX = Math.floor(Math.random() * 30) + 1
    targetY = Math.floor(Math.random() * 30) + 1
}

function handleGameOver() {
    openModal()
    clearInterval(gameInterval)
}


function playAgain() {
    window.location.reload();
}

// Adding a modal for a game over screen
function openModal() {
    document.getElementById('gameOverModal').style.display = 'block'
}

// Adding functionality to close the modal by clicking outside of it
function closeModal() {
    let modal = document.getElementById('gameOverModal')
    if (modal) {
        modal.style.display = 'none'
    }
}

window.onclick = function(event) {
    let modal = document.getElementById('gameOverModal')
    if (event.target === modal) {
        modal.style.display = 'none'
    }
}

// Keyboard controls. We use the switch conditional statement instead of "if else" so that both lower and upper case keys are recognized, as well as arrow keys. Switch statements perform different actions based on different conditions. W3 documentation: https://www.w3schools.com/jsref/jsref_switch.asp#:~:text=The%20switch%20statement%20is%20a,%2C%20nested%20if%2Felse%20statements.
function changeDirection(e) {
    let direction

    switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
            if (speedY !== 1){
                speedX = 0;
                speedY = -1;
                direction = "up";
            }
                break;

        case "s":
        case "S":
        case "ArrowDown":
            if (speedY !== -1){
                speedX = 0;
                speedY = 1;
                direction = "down";
            }
                break;

        case "d":
        case "D":
        case "ArrowRight":
            if (speedX !== -1) {
                speedX = 1;
                speedY = 0;
                direction = "right";
            }
                break;

        case "a":
        case "A":
        case "ArrowLeft":
            if (speedX !== 1){
                speedX = -1;
                speedY = 0;
                direction = "left";
            }
                break;
    }

    updateSnakeGif(direction);
}

function updateSnakeGif(direction) {
     const upGif = "./assets/Images/snake-up.gif"
     const downGif = "./assets/Images/snake-down.gif"
     const leftGif = "./assets/Images/snake-left.gif"
     const rightGif = "./assets/Images/snake-right.gif"

     switch (direction) {
         case "up":
             snakeGif.style.backgroundImage = `url('${upGif}')`;
             break;
         case "down":
             snakeGif.style.backgroundImage = `url('${downGif}')`;
             break;
         case "left":
             snakeGif.style.backgroundImage = `url('${leftGif}')`;
             break;
         case "right":
             snakeGif.style.backgroundImage = `url('${rightGif}')`;
             break;
     }
 }


//Add functionality for clickable controls. Calls changeDirection on each key click and passes key dataset value as an object. Source: https://www.freecodecamp.org/news/how-to-build-a-snake-game-in-javascript/
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }))
})


function gameStart() {
    if (gameOver) return handleGameOver();


    // Add target
    let htmlTemplate = `<div class="target" style="grid-area: ${targetY} / ${targetX}"></div>`;

    // This loop iterates through the body segments, excluding the head, starting from the last segment of the body through all segments up to the second one.
    // It then updates each segment to have the position of the segment before it.
    // Solution found from CodingNepal: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
    for (let i = player1Body.length - 1; i > 0; i--) {
        player1Body[i] = player1Body[i - 1];
    }


    // Setting the first element of player1's body to the current player1 position
    player1Body[0] = [player1X, player1Y];


    // Updates the player's "head" position based on the current speed.
    player1X += speedX;
    player1Y += speedY;


    // Add a div for each part of the player's body when a target is reached.
    for (let i = 0; i < player1Body.length; i++) {
        htmlTemplate += `<div class="player1" style="grid-area: ${player1Body[i][1]} / ${player1Body[i][0]}"></div>`;


        // Add game over state if player hits own body.  Solution found from CodingNepal: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
        if (i !== 0 && player1Body[0][1] === player1Body[i][1] && player1Body[0][0] === player1Body[i][0]) {
            gameOver = true;
        }
    }

    if (player1X === targetX && player1Y === targetY) {  // Check to see if player1 made contact with target, then randomize next target location if true.
        targetRandomizer();
        player1Body.push([targetX, targetY]) // Pushes target to player1Body array after the target is eaten.
        score++;

        highScore = score >= highScore ? score : highScore // Storing score/high score
        localStorage.setItem("high-score", highScore)
        scoreTracker.innerText = `Score: ${score}`
        highScoreTracker.innerText = `High Score: ${highScore}`
        snakeSpeed -= speedIncrement // Applying the speed increment before the next interval starts.
        clearInterval(gameInterval);
        gameInterval = setInterval(gameStart, snakeSpeed);
    }


    if (player1X <= 0 || player1X > 30 || player1Y <= 0 || player1Y > 30) { // Add game over state if player hits wall
        gameOver = true;
    }

    stage.innerHTML = htmlTemplate // Display the updated HTML template
}


gameStart();

targetRandomizer();


// Using setInterval so player moves automatically
gameInterval = setInterval(gameStart, snakeSpeed);