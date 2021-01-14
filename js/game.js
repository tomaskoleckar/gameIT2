const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let test;
function mouseDetection() {
    canvas.addEventListener("mousemove", function (e) {
        if (e.y < 675) {
            gun.y = e.y;
            gun.y -= 134;
        }
    })
}
function addBullet() {
    canvas.addEventListener("click", function () {
        game.addBullets();
    })
}
function addEnemy(difficulty) {
    console.log(difficulty);
    switch (difficulty) {
        case 1: setInterval(function () {
            game.spawnEnemies();
        }, 2000);
            break;
        case 2: setInterval(function () {
            game.spawnEnemies();
        }, 1000);
            break;
        case 3: setInterval(function () {
            game.spawnEnemies();
        }, 500);
            break;
        default: setInterval(function () {
            game.spawnEnemies();
        }, 1000);
            break;
    }
}

function spawnSpeed() {
    return Math.round(Math.random() * 10) * 1000;
}
let gameboard = {
    width: canvas.width,
    height: canvas.height,
    col: 6,
    row: 11,
    draw: function () {
        for (let i = 0; i < this.row + 1; i++) {
            for (let j = 0; j < this.col; j++) {
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(canvas.width / 11 * i * 2, canvas.height / 6 * j);
                ctx.lineTo(canvas.width / 11 * (i - 1) + canvas.width / 11, canvas.height / 6 * j);
                ctx.stroke();
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(canvas.width / 11, 0);
        ctx.lineTo(canvas.width / 11, canvas.height);
        ctx.stroke();
    },

}
let gun = {
    sprite: new Image(),
    x: canvas.width / 33,
    y: canvas.height / 2,
    width: 80,
    height: 64,
    init: function () {
        this.sprite.src = "img/starter-gun.png";
    },
    draw: function () {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    },

};
class Enemies {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
        this.speed = speed;
        this.img = new Image();
        this.img.src = 'img/enemy.svg';
    };
    move() {
        this.x -= this.speed;
    };
    init() {
        this.img.src = 'img/enemy.svg';
    };
    draw() {
        ctx.drawImage(this.img, this.x,this.y, this.width, this.height);
    }

};
class Bullets {
    static FILL_COLOR = "red";
    constructor(x, y, radius = 5, speed = 5) {
        this.x = x + canvas.width / 33;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = Bullets.FILL_COLOR;
    }
    move() {
        this.x += this.speed;
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};
class Game {
    constructor() {
        this.bullets = [];
        this.enemies = [];
        this.speed = 5;
        this.difficulty = 2;
    };
    init() {
        gun.init();
    };
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bullets.forEach(function (bullets, index, arr) {
            bullets.move();
            bullets.draw();
            /* Jestliže koule spadne pod dolní okraj... */
            if (bullets.x + bullets.radius > canvas.width) {
                /*...bude z pole odstraněna */
                arr.splice(index, 1);
            }
            /*if(detectCollisionCircleRect(bullets,enemies)){
                arr.splice(index,1);

            }*/
        });
        this.enemies.forEach(function (enemies, index, arr) {
            enemies.move();
            enemies.draw();
            /* Jestliže koule spadne pod dolní okraj... */
            if (enemies.x < 0) {
                /*...bude z pole odstraněna */
                arr.splice(index, 1);
            }
            /*if(detectCollisionCircleRect(bullets,enemies)){
                arr.splice(index,1);

            }*/
        });
        gun.draw();
        gameboard.draw();
    };
    spawnEnemies() {
        let yHelp = Math.round(Math.random() * 5) + 1;
        let y = canvas.height / yHelp;
        let x = canvas.width;
        let speed = 3;
        this.enemies.push(new Enemies(x, y, speed));
        console.log(game.enemies);
    }
    addBullets() {
        let y = gun.y + 10;
        let radius = 5;
        let speed = 5;
        this.bullets.push(new Bullets(gun.x, y, radius, speed));

    };
}
function animate() {
    game.draw();
    requestAnimationFrame(animate);
}
let game = new Game();
addBullet();
addEnemy(game.difficulty);
mouseDetection();
game.init();
animate();

