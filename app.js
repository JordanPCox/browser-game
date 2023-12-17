// Source for basic layout and functionality: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
const huntingGround = document.querySelector(".game-board")
const scoreTracker = document.querySelector(".game-info")
const highScoreTracker = document.querySelector(".high-score")

let highScore = localStorage.getItem("high-score") || 0;
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
let score =0;

// Using math.random to change target location, and +1 to make sure that the random number does not land on 0 or 34. Sources: chatGPT and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function targetRandomizer() {
    targetX = Math.floor(Math.random() * 35) + 1;
    targetY = Math.floor(Math.random() * 35) + 1;
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

function handleGameOver() {
    openModal();
    clearInterval(gameInterval)
}


function playAgain() {
    window.location.reload();
}

// Keyboard controls. We use the switch conditional statement instead of "if else" so that both lower and upper case keys are recognized. Switch statements perform different actions based on different conditions. W3 documentation: https://www.w3schools.com/jsref/jsref_switch.asp#:~:text=The%20switch%20statement%20is%20a,%2C%20nested%20if%2Felse%20statements.
function changeDirection(e) {
    switch (e.key) {
        case "w":
        case "W":
            if (speedY !== 1){
            speedX = 0
            speedY = -1
            }
            break

        case "s":
        case "S":
            if (speedY !== -1){
            speedX = 0
            speedY = 1
            }
            break

        case "d":
        case "D":
            if (speedX !== -1) {
            speedX = 1
            speedY = 0
            }
            break

        case "a":
        case "A":
            if (speedX !== 1){
            speedX = -1
            speedY = 0
            }
            break
    }
    gameStart();
}

function gameStart() {
    if(gameOver) return handleGameOver();
    // Add target
    let htmlTemplate = `<div class="target" style="grid-area: ${targetY} / ${targetX}"></div>`;

    // Check to see if player1 made contact with target.
    if(player1X === targetX && player1Y === targetY) {
        targetRandomizer();
        player1Body.push([targetX, targetY]) //Pushes target to player1Body array after target is eaten.
        score++; //Increments score by 1

        highScore = score >= highScore ? score : highScore; //Storing score/high score
        localStorage.setItem("high-score", highScore)
        scoreTracker.innerText = `Score: ${score}`
        highScoreTracker.innerText = `High Score: ${highScore}`
        
    }

    // This loop iterates through the body segments, excluding the head, starting from the last segment of the body through all segments up to the second one. It then updates each segment to have the position of the segment before it.  Solution found from CodingNepal: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
    for (let i = player1Body.length -1; i > 0; i--){
        player1Body[i] = player1Body[i - 1]
    }
    // Setting the first element of player1's body to the current player1 position
    player1Body[0] = [player1X, player1Y]

    //Updates the polayer's "head" position based on current speed.
    player1X += speedX
    player1Y += speedY

    //Add game over state if player hits wall
    if(player1X <= 0 || player1X > 35 || player1Y <= 0 || player1Y >35) {
        gameOver = true
    }

    // Add a div for each part of the player's body when a target is reached.
    for (let i=0; i < player1Body.length; i++) {
        htmlTemplate += `<div class="player1" style="grid-area: ${player1Body[i][1]} / ${player1Body[i][0]}"></div>`;
        //Add game over state if player hits own body.  Solution found from CodingNepal: https://www.codingnepalweb.com/create-snake-game-htm-css-javascript/
    if(i !== 0 && player1Body[0][1] === player1Body[i][1] && player1Body[0][0] === player1Body[i][0]){
        gameOver = true
        }   
    }
    huntingGround.innerHTML = htmlTemplate;
}

targetRandomizer();
// Using setInterval so player moves automatically
gameInterval = setInterval(gameStart, 165);

//Adding event listeners for keyboard movement.
document.addEventListener("keydown", changeDirection)