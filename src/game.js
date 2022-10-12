import SAT from 'sat';
import {Routes, Router, Route, useNavigate, useParams} from 'react-router-dom';


const game = {

canvas: null,
ctx: null, 

//set initial ball location to be the center of the pitch
x: null,
y: null,
//set ball radius
ballRadius: 6,

//set ball speed
dx: 3,
dy: -3,

//initialize teams' X
m: 0,
j: 0,

aiSpeed: 1.25,

//set paddle dimensions
paddleHeight: 10,
paddleWidth: 30, // same as the player width

paddleX: null,
//initialize keypress status
rightPressed: false,
leftPressed: false,  

//set goalpost dimensions
goalpostWidth: 150,
goalpostHeight: 10,

//initialize scorecard
ownScore: 0,
opponentScore: 0,

//set player dimensions
playerHeight: 40,
playerWidth: 20,


//set flags
// let initFlag = true;
gameOver: false,
flag1: 1,
flag2: 1,
drawFlag: true,




//initialize SAT.js letiables
V: SAT.Vector,
C: SAT.Circle,
B: SAT.Box,

circle: null,
box: null,

//initialize images
ownPlayer: new Image(),
opponentPlayer: new Image(),
ballImage: new Image(),


//it all starts here
    init(canvas, ownPlayerImg, opponentPlayerImg) {
        console.log('init()canvas', canvas);
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.x = this.canvas.width/2;
        this.y = this.canvas.height/2;
        this.paddleX = (this.canvas.width-this.paddleWidth);
        this.removeStatus();
        this.ownPlayer.src = `/img/${ownPlayerImg}.png`;
        this.opponentPlayer.src = `/img/${opponentPlayerImg}.png`;
        this.ballImage.src = '/img/soccorball.svg.png';
        // document.getElementById('startScreen').style['z-index'] = '-1';
        // document.getElementById('gameOverScreen').style['z-index'] = '-1';
        // document.getElementById('own').innerHTML = '0';
        // document.getElementById('opponent').innerHTML = '0';
        this.opponentScore = 0;
        this.ownScore = 0;
        this.gameOver = 0;
        this.setInitialDelay();
        //register for keypress events
        // document.addEventListener("keydown", this.keyDownHandler, false);
        // console.log(this.keyDownHandler);
        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 39) {
                this.rightPressed = true;
            } else if (e.keyCode == 37) {
                this.leftPressed = true;
            }
        });
        
        // document.addEventListener("keyup", this.keyUpHandler, false);
        document.addEventListener("keyup", (e) => {
            if (e.keyCode == 39) {
        this.rightPressed = false;
    } else if (e.keyCode == 37) {
        this.leftPressed = false;
    }
        });
    },

setInitialDelay() {
    setTimeout(() => {
        this.startTimer(60 * 2);
        this.drawFlag = true;
        window.requestAnimationFrame(() => this.draw());
        this.updateStatus('You are team <br> in <span style="color:red">RED</span>');
    }, 1500);
},

setDelay() {
    setTimeout(() => {
        this.drawFlag = true;
        window.requestAnimationFrame(() => this.draw());
    }, 1500);
},

startTimer(duration) {
    let timer = duration,
        minutes, seconds;
    let countdown = setInterval(() => {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('countdown').innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            document.getElementById('gameOverScreen').style['z-index'] = 3;
            this.gameOver = true;
            clearInterval(countdown);
            if (this.ownScore > this.opponentScore)
            this.updateStatus('GAME OVER!<br>You Won!');
            else if (this.opponentScore > this.ownScore)
            this.updateStatus('GAME OVER!<br>You Lost!');
            else
            this.updateStatus('GAME OVER!<br>Draw!')
        }
    }, 1000);
},

// draw the match
draw() {
    // console.log('draw', this);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBall();
    this.drawPlayers();
    this.drawGoalPost();
    this.x += this.dx;
    this.y += this.dy;
    if (this.rightPressed && this.paddleX * 3 / 4 + this.m < this.canvas.width - this.paddleWidth) {
        this.m += 2;
    } else if (this.leftPressed && this.paddleX / 4 + this.m > 0) {
        this.m -= 2;
    }
    if (this.drawFlag && !this.gameOver)
        window.requestAnimationFrame(() => this.draw());
},

// ball picture

drawBall() {

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2, true);
    // ctx.clip();
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    // ctx.fillStyle = ctx.createPattern(ballImage, 'no-repeat')
    this.ctx.drawImage(this.ballImage, this.x-7.5, this.y-7.5, 12, 12)
    
    this.ctx.fill();
    
    this.ctx.closePath();
    
    this.circle = new this.C(new this.V(this.x, this.y), 6);
    if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
            if(this.x<0)
            this.x=0;
            if(this.x>this.canvas.width)
            this.x = this.canvas.width; 
    }
    if (this.y + this.dy > this.canvas.height - this.ballRadius || this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
    }

},

drawPlayers() {
    this.drawOwnTeam();
    this.drawOpponentTeam();
    
},

drawOwnTeam() {
    // own team
    this.drawGoalkeeper();
    this.drawDefenders();
    this.drawMidfielders();
    this.drawStrikers();
},

drawOpponentTeam() {
    //opponent
    this.drawOpponentGoalkeeper();
    this.drawOpponentDefenders();
    this.drawOpponentMidfielders();
    this.drawOpponentStrikers();
},

drawGoalPost() {

    // own team
    this.ctx.beginPath();
    let goalpostOwnX = (this.canvas.width - this.goalpostWidth) / 2;
    let goalpostOwnY = this.canvas.height - this.goalpostHeight;
    this.ctx.rect(goalpostOwnX, goalpostOwnY, this.goalpostWidth, this.goalpostHeight);
    this.ctx.fillStyle = "#9C9C9C";
    this.ctx.fill();
    this.ctx.closePath();
    this.box = new this.B(new this.V(goalpostOwnX, goalpostOwnY), this.goalpostWidth, this.goalpostHeight).toPolygon();
    if (this.goalDetection(this.box)) {
        this.updateScore('own');
        this.updateStatus('GOAL!<br>The Opponent Score!');
        this.removeStatus();
        this.resetBall();
        this.setDelay();
    }
    //opponent
    this.ctx.beginPath();
    let goalpostOpponentX = (this.canvas.width - this.goalpostWidth) / 2;
    let goalpostOpponentY = this.paddleHeight - this.goalpostHeight;
    this.ctx.rect(goalpostOpponentX, goalpostOpponentY, this.goalpostWidth, this.goalpostHeight);
    this.ctx.fillStyle = "#9C9C9C";
    this.ctx.fill();
    this.ctx.closePath();

    this.box = new this.B(new this.V(goalpostOpponentX, goalpostOpponentY), this.goalpostWidth, this.goalpostHeight).toPolygon();
    if (this.goalDetection(this.box)) {
        this.updateScore('opponent');
        this.updateStatus('GOAL!<br>Your Team Score!');
        this.removeStatus();
        this.resetBall();
        this.setDelay();
    }
},


updateScore(goal) {

    if (goal === 'own') {
        this.opponentScore += 1;
        document.getElementById('opponent').innerHTML = this.opponentScore;
    } else {
        this.ownScore += 1;
        document.getElementById('own').innerHTML = this.ownScore;
    }
},

resetBall() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.drawBall();
    this.drawFlag = false;
    window.requestAnimationFrame(() => this.draw());

},

updateStatus(message) {
    document.getElementById('status').innerHTML = message;

},

removeStatus() {
    setTimeout(function() {
        document.getElementById('status').innerHTML = '';
    }, 1500);
},



drawGoalkeeper() {

    let goalkeeperX = this.paddleX / 2 + this.m;
    let goalkeeperY = this.canvas.height * 7 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, goalkeeperX, goalkeeperY - 15, this.playerWidth, this.playerHeight);
    // drawRods(goalkeeperY);
    this.box = new this.B(new this.V(goalkeeperX, goalkeeperY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, goalkeeperX);

},


drawDefenders() {

    let leftCenterBackX = this.paddleX / 4 + this.m;
    let leftCenterBackY = this.canvas.height * 13 / 16 - this.paddleHeight;
    // drawRods(leftCenterBackY);
    this.ctx.drawImage(this.ownPlayer, leftCenterBackX, leftCenterBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftCenterBackX, leftCenterBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, leftCenterBackX);

    let rightCenterBackX = this.paddleX * 3 / 4 + this.m;
    let rightCenterBackY = this.canvas.height * 13 / 16 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, rightCenterBackX, rightCenterBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightCenterBackX, rightCenterBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, rightCenterBackX);
},

drawMidfielders() {

    //midfielders
    let leftWingBackX = this.paddleX * 1 / 8 + this.m;
    let leftWingBackY = this.canvas.height * 5 / 8 - this.paddleHeight;
    // drawRods(leftWingBackY);
    this.ctx.drawImage(this.ownPlayer, leftWingBackX, leftWingBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftWingBackX, leftWingBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, leftWingBackX);

    let leftCenterMiddleX = this.paddleX * 3 / 8 + this.m;
    let leftCenterMiddleY = this.canvas.height * 5 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, leftCenterMiddleX, leftCenterMiddleY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftCenterMiddleX, leftCenterMiddleY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, leftCenterMiddleX);

    let rightCenterMiddleX = this.paddleX * 5 / 8 + this.m;
    let rightCenterMiddleY = this.canvas.height * 5 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, rightCenterMiddleX, rightCenterMiddleY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightCenterMiddleX, rightCenterMiddleY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, rightCenterMiddleX);

    let rightWingBackX = this.paddleX * 7 / 8 + this.m;
    let rightWingBackY = this.canvas.height * 5 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, rightWingBackX, rightWingBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightWingBackX, rightWingBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, rightWingBackX);

},

drawStrikers() {
    //attackers
    let leftWingForwardX = this.paddleX / 4 + this.m;
    let leftWingForwardY = this.canvas.height * 9 / 32 - this.paddleHeight;
    // drawRods(leftWingForwardY);
    this.ctx.drawImage(this.ownPlayer, leftWingForwardX, leftWingForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftWingForwardX, leftWingForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, leftWingForwardX);

    let centerForwardX = this.paddleX / 2 + this.m;
    let centerForwardY = this.canvas.height * 9 / 32 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, centerForwardX, centerForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(centerForwardX, centerForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, centerForwardX);

    let rightWingForwardX = this.paddleX * 3 / 4 + this.m;
    let rightWingForwardY = this.canvas.height * 9 / 32 - this.paddleHeight;
    this.ctx.drawImage(this.ownPlayer, rightWingForwardX, rightWingForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightWingForwardX, rightWingForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetection(this.box, rightWingForwardX);

},



drawOpponentGoalkeeper() {

    let goalkeeperX = this.paddleX / 2 + this.j;
    let goalkeeperY = this.canvas.height * 1 / 8 - this.paddleHeight;
    // drawRods(goalkeeperY);
    this.ctx.drawImage(this.opponentPlayer, goalkeeperX, goalkeeperY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(goalkeeperX, goalkeeperY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, goalkeeperX);

    if (this.x > goalkeeperX && goalkeeperX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (goalkeeperX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;

},

drawOpponentDefenders() {

    let leftCenterBackX = this.paddleX / 4 + this.j;
    let leftCenterBackY = this.canvas.height * 3 / 16 - this.paddleHeight;
    // drawRods(leftCenterBackY);
    this.ctx.drawImage(this.opponentPlayer, leftCenterBackX, leftCenterBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftCenterBackX, leftCenterBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, leftCenterBackX);

    let rightCenterBackX = this.paddleX * 3 / 4 + this.j;
    let rightCenterBackY = this.canvas.height * 3 / 16 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, rightCenterBackX, rightCenterBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightCenterBackX, rightCenterBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, rightCenterBackX);

    if (this.x > rightCenterBackX && rightCenterBackY < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (leftCenterBackX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > rightCenterBackX && rightCenterBackX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (rightCenterBackX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
},

drawOpponentMidfielders() {

    //midfielders
    let leftWingBackX = this.paddleX * 1 / 8 + this.j;
    let leftWingBackY = this.canvas.height * 3 / 8 -this. paddleHeight;
    // drawRods(leftWingBackY)
    this.ctx.drawImage(this.opponentPlayer, leftWingBackX, leftWingBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftWingBackX, leftWingBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, leftWingBackX);

    let leftCenterMiddleX = this.paddleX * 3 / 8 + this.j;
    let leftCenterMiddleY = this.canvas.height * 3 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, leftCenterMiddleX, leftCenterMiddleY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftCenterMiddleX, leftCenterMiddleY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, leftCenterMiddleX);

    let rightCenterMiddleX = this.paddleX * 5 / 8 + this.j;
    let rightCenterMiddleY = this.canvas.height * 3 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, rightCenterMiddleX, rightCenterMiddleY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightCenterMiddleX, rightCenterMiddleY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, rightCenterMiddleX);

    let rightWingBackX = this.paddleX * 7 / 8 + this.j;
    let rightWingBackY = this.canvas.height * 3 / 8 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, rightWingBackX, rightWingBackY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightWingBackX, rightWingBackY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, rightWingBackX);

    if (this.x > leftWingBackX && leftWingBackX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (leftWingBackX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > rightWingBackX && rightWingBackX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (rightWingBackX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > rightCenterMiddleX && rightCenterMiddleX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (rightCenterMiddleX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > leftCenterMiddleX && leftCenterMiddleX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (leftCenterMiddleX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
},


drawOpponentStrikers() {
    //attackers
    this.ctx.beginPath();
    let leftWingForwardX = this.paddleX / 4 + this.j;
    let leftWingForwardY = this.canvas.height * 23 / 32 - this.paddleHeight;
    // drawRods(leftWingForwardY);
    this.ctx.drawImage(this.opponentPlayer, leftWingForwardX, leftWingForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(leftWingForwardX, leftWingForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, leftWingForwardX);

    this.ctx.beginPath();
    let centerForwardX = this.paddleX / 2 + this.j;
    let centerForwardY = this.canvas.height * 23 / 32 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, centerForwardX, centerForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(centerForwardX, centerForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, centerForwardX);

    this.ctx.beginPath();
    let rightWingForwardX = this.paddleX * 3 / 4 + this.j;
    let rightWingForwardY = this.canvas.height * 23 / 32 - this.paddleHeight;
    this.ctx.drawImage(this.opponentPlayer, rightWingForwardX, rightWingForwardY - 15, this.playerWidth, this.playerHeight);
    this.box = new this.B(new this.V(rightWingForwardX, rightWingForwardY), this.playerWidth, this.paddleHeight).toPolygon();
    this.collisionDetectionOpponent(this.box, rightWingForwardX);



    if (this.x > leftWingForwardX && leftWingForwardX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (leftWingForwardX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > rightWingForwardX && rightWingForwardX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if (rightWingForwardX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    if (this.x > centerForwardX &&  centerForwardX < this.paddleX * 3 / 4)
    this.j += this.aiSpeed;
    else if ( centerForwardX > this.paddleX * 1 / 4)
    this.j -= this.aiSpeed;
    


},


collisionDetection(box, pX) {
    let response = new SAT.Response();
    if (SAT.testPolygonCircle(box, this.circle, response)) {
        let speed = (this.x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (this.flag1 == 1) {
            if (this.dy > 0) {
                this.dy = -this.dy;
                this.y = this.y - speed;
                if (this.dx > 0)
                this.x = this.x + speed;
                else
                this.x = this.x - speed;
            } else {
                this.y = this.y - speed;
                if (this.dx > 0)
                this.x = this.x - speed;
                else
                this.x = this.x + speed;
            }
            this.flag1 = 0;
        }
    } else
    this.flag1 = 1;
},

collisionDetectionOpponent(box, pX) {
    let response = new SAT.Response();
    if (SAT.testPolygonCircle(box, this.circle, response)) {
        let speed = (this.x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (this.flag2 == 1) {
            if (this.dy < 0) {
                this.dy = -this.dy;
                this.y = this.y + speed;
                if (this.dx > 0)
                this.x = this.x + speed;
                else
                this.x = this.x - speed;
            } else {
                this.y = this.y + speed;
                if (this.dx > 0)
                this.x = this.x + speed;
                else
                this.x = this.x - speed;
            }
        }
    } else
    this.flag2 = 1;
},


goalDetection(box) {
    let response = new SAT.Response();
    return SAT.testPolygonCircle(box, this.circle, response);
},



// keyDownHandler(e) {
//     console.log('down');
    
//     if (e.keyCode == 39) {
//         this.rightPressed = true;
//     } else if (e.keyCode == 37) {
//         this.leftPressed = true;
//     }
// },

// keyUpHandler(e) {
//     if (e.keyCode == 39) {
//         this.rightPressed = false;
//     } else if (e.keyCode == 37) {
//         this.leftPressed = false;
//     }
// }
}; // game

export default game;