console.log('connected!');

const dino = document.querySelector('.dino');
const grid = document.querySelector('.grid');
const gameStat = document.querySelector('#game-stat');
const scoreStat = document.querySelector('#score-stat');
const jumpSound = new Audio('./sounds/jump.mp3');
const gameOverSound = new Audio('./sounds/game-over.mp3');

let startGame = false;
let isJumping = false;
let gameOver = false;
const gravity = 0.9;
let score = 0;
let step = false;


let control = (event) => {
    
    if(isJumping === false && gameOver === false){

        isJumping = true;

        if(event.keyCode === 32){
            jumpSound.play();
            jump();
        }
    }
    
}


let jump = () => {

    let position = 60;
    let count = 0;

    let upTimerId = setInterval(() => {

        if(count === 30){
            clearInterval(upTimerId);
            
            let downTimerId = setInterval(() => {
                if(count === 21){
                    clearInterval(downTimerId);
                    isJumping = false;
                }
               
                count--;
                position = position - 3.6;
                position = position*gravity;
                dino.style.bottom = `${position}px`; 
            },20);
        }
        
        count++;
        position = position + 30;
        position = position*gravity;
        dino.style.bottom = `${position}px`;
    },20);
}


let generateObstacle = () => {

    if(gameOver === false){

        let randomTime = Math.round(Math.random()*2000 + 1000);
        let obstaclePosition = 1920;
        let obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        grid.appendChild(obstacle);
        obstacle.style.left = `${obstaclePosition}px`;

        let obstacleTimerId = setInterval(() => {

            let dinoC = dino.getBoundingClientRect();
            let obstacleC = obstacle.getBoundingClientRect();

            //Collision Detection Algorithm
            /*
            A.X < B.X + B.Width
            A.X + A.Width > B.X
            A.Y < B.Y + B.Height
            A.Y + A.Height > B.Y
            */
            
            if(dinoC.x <= (obstacleC.x + obstacleC.width) &&
                (dinoC.x + dinoC.width) >= obstacleC.x &&
                dinoC.y <= (obstacleC.y + obstacleC.height) &&
                (dinoC.y + dinoC.height) >= obstacleC.y){
                
                clearInterval(obstacleTimerId);
                gameOver = true;
                
               //Remove dino and all obstacles
                while (grid.firstChild){
                    grid.removeChild(grid.lastChild);
                }

                gameStat.innerHTML = 'Game Over!<br><span>Reload to Play Again.</span>';
                gameOverSound.play();
            }
            
            obstaclePosition = obstaclePosition - 10;
            obstacle.style.left = `${obstaclePosition}px`;
            
        },20);

        setTimeout(generateObstacle, randomTime);
    }

}


//For counting score every 0.5s
let scoreCount = () => {
    let scoreTimerId = setInterval(() => {

        if(gameOver === true){
            clearInterval(scoreTimerId);
            score--;
        }

        score++;
        scoreStat.textContent = `Score: ${score}`;
    },500);
}


//For dino running animation
let runAnimation = () => {
    let runTimerId = setInterval(()=>{
        if(gameOver === true){
            clearInterval(runTimerId);
        }
        
        if(step === false){
            dino.style.backgroundImage = 'url("./images/dino.png")';
        }

        if(step === true){
            dino.style.backgroundImage = 'url("./images/dino2.png")';
        }

        step = !step;
    },100);
}


//Starting the game
let start = (event) => {
    if(event.keyCode === 32){
        startGame = true;
        document.removeEventListener('keypress', start);
        gameStat.textContent = '';
    }

    if(startGame){
        generateObstacle();
        scoreCount();
        runAnimation();
        document.addEventListener('keypress', control);
    }
}

document.addEventListener('keypress', start);

