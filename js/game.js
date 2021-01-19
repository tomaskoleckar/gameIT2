const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let paused = false;
let upgradesBought = 0;
function togglePause() {
    if (!paused) {
        paused = true;
    }
    else if (paused) {
        paused = false;
    }
    animate();
}
window.addEventListener('keydown', function (e) {
    pauseGame(e);
});
function pauseGame(e) {
    let key = e.key;
    if (key === "Escape") {
        togglePause();
    }
}
function buttons() {
    let upgradeCost = 10;
    let maxHpCost = 10;
    let maxHpBought = 0;
    let turretCost = 100;
    let buttonActive = false;
    let y;
    let level = document.getElementById("level");
    let upgrade = document.getElementById("upgbtn");
    let maxHp = document.getElementById("maxhpbtn");
    let turret = document.getElementById("trtbtn");
    let menu = document.getElementById("menubtn");
    level.innerHTML = "Level : " + game.level + "";
    upgrade.innerHTML = "+Damage (" + upgradeCost + ")";
    maxHp.innerHTML = "+MaxHp (" + maxHpCost + ")";
    turret.innerHTML = "+Turret (" + turretCost + ")";
    upgrade.addEventListener("click", function () {
        if (game.coins >= upgradeCost) {
            game.coins -= upgradeCost;
            upgradesBought++;
            upgradeCost += (1 + Math.round(upgradesBought / 10)) * upgradesBought;
            upgrade.innerHTML = "+Damage (" + upgradeCost + ")";
        }
        updateScore();
    });
    turret.addEventListener("click", function () {
        console.log(buttonActive);
        if (!buttonActive) {
            buttonActive = true;
            turret.style.backgroundColor = "yellow";
        }
        else if (buttonActive) {
            buttonActive = false;
            turret.style.backgroundColor = "#CCC";
        }
        console.log(buttonActive);
        if (game.coins >= turretCost) {
            canvas.addEventListener("click", function (e) {
                let x = canvas.width / 10;
                let shootingSpeed = 1;
                y = Math.floor((e.y + 9) / 100);
                switch (y) {
                    case 2:
                        y = 20;
                        break;
                    case 3:
                        y = 120;
                        break;
                    case 4:
                        y = 220;
                        break;
                    case 5:
                        y = 320;
                        break;
                    case 6:
                        y = 420;
                        break;
                    case 7:
                        y = 520;
                        break;
                }
                if (buttonActive && game.coins >= turretCost) {
                    game.coins -= turretCost;
                    turretCost += 100;
                    game.turret.push(new Turret(x, y, shootingSpeed));
                    turretShoot(shootingSpeed, y);
                    turret.innerHTML = "+Turret (" + turretCost + ")";

                }
            })
        }
    })
    maxHp.addEventListener("click", function () {
        if (game.coins >= maxHpCost) {
            game.coins -= maxHpCost;
            maxHpBought++;
            maxHpCost += (1 + Math.round(maxHpBought / 10)) * maxHpBought;
            game.health += Math.round(game.maxHealth / 10);
            if (game.health > game.maxHealth) {
                game.health = game.maxHealth;
            }
            game.maxHealth += maxHpBought + Math.round(maxHpBought / 10);
            maxHp.innerHTML = "+MaxHp (" + maxHpCost + ")";
        }
        updateScore();
    });
}
function mouseDetection() {
    canvas.addEventListener("mousemove", function (e) {
        if (e.y < 740) {
            gun.y = e.y;
            gun.y -= 195;
        }
    })
}
function updateScore() {
    let score = document.getElementById("score");
    let health = document.getElementById("health");
    let coins = document.getElementById("coins");
    score.innerHTML = "Score : " + game.score + "";
    health.innerHTML = "Health : " + game.health + "";
    coins.innerHTML = "Coins : " + game.coins + "";
    level.innerHTML = "Level : " + game.level + "";

    if (game.health <= 0) {
        game.turret = [];
        game = new Game();
        paused = true;
    }
    if (upgradesBought == 10) {
        gun.sprite.src = "img/ak47.png";
        gun.width += 50;
        gun.height += 20;
        gun.x = 0;
        upgradesBought++;
    }
}
function addBullet() {
    canvas.addEventListener("click", function () {
        game.addBullets(1, 0);
        console.log(game.bullets);
    })
}
function turretShoot(shootingSpeed, y) {
    setInterval(function () {
        if (paused == false) {
            game.addBullets(0, y);
        }
    }, 1000 / shootingSpeed);
}

function addEnemy(difficulty) {
    switch (difficulty) {
        case 1: setInterval(function () {
            if (paused == false) {
                game.spawnEnemies();
            }
        }, 2000);
            break;
        case 2: setInterval(function () {
            if (paused == false) {
                game.spawnEnemies();
            }
        }, 1000);
            break;
        case 3: setInterval(function () {
            if (paused == false) {
                game.spawnEnemies();
            }
        }, 500);
            break;
        default: setInterval(function () {
            if (paused == false) {
                game.spawnEnemies();
            }
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
class Turret {
    constructor(x, y, shootingSpeed) {
        this.x = x;
        this.y = y;
        this.health = 1;
        this.shootingSpeed = shootingSpeed;
        this.width = 80;
        this.height = 80;
        this.img = new Image();
        this.img.src = 'img/turret.png';
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
class Boss {
    constructor(x, y, speed, health) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.speed = speed;
        this.width = 160;
        this.height = 160;
        this.img = new Image();
        this.img.src = 'img/boss.svg';
    }
    move() {
        this.x -= this.speed;
    };
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

}
class Enemies {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.health = game.level ** 2;
        this.width = 50;
        this.height = 80;
        this.speed = speed;
        this.img = new Image();
        this.img.src = 'img/enemy.svg';
    };
    move() {
        this.x -= this.speed;
    };
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

};
class Bullets {
    static FILL_COLOR = "red";
    constructor(x, y, radius = 5, speed = 5, damage = 1) {
        this.x = x + canvas.width / 33;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.damage = damage;
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
        this.boss = [];
        this.turret = [];
        this.speed = 5;
        this.difficulty = 2;
        this.score = 0;
        this.coins = 0;
        this.health = 10;
        this.level = 1;
        this.maxHealth = 10;
    };
    init() {
        gun.init();
    };
    play() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bullets.forEach(function (bullets, index, arr,) {
            bullets.move();
            bullets.draw();
            if (bullets.x + bullets.radius > canvas.width) {
                arr.splice(index, 1);
            }
        });
        this.enemies.forEach(function (enemies, index, arr) {
            enemies.move();
            enemies.draw();
            if (enemies.x < (canvas.width / 11)) {
                game.health -= Math.round(game.level / 2);
                arr.splice(index, 1);
            }
            game.bullets.forEach(function (bullets, indexb, arrb) {
                let odds = Math.ceil(Math.random() * 3);
                if (detectCollisionCircleRect(bullets, enemies)) {
                    enemies.health -= bullets.damage;
                    if (enemies.health <= 0) {
                        arr.splice(index, 1);
                        game.score++;
                        if (game.score % 50 == 0) {
                            game.enemies = [];
                            game.bullets = [];
                            game.spawnBoss();
                        }
                    }
                    arrb.splice(indexb, 1);
                    if (odds == 3) {
                        game.coins += game.level;
                    }
                }
            })
        });
        this.boss.forEach(function (boss, index, arr) {
            boss.move();
            boss.draw();
            game.enemies = [];
            if (boss.x < (canvas.width / 11)) {
                game.health -= 10*game.level;
                arr.splice(index, 1);
            }
            game.bullets.forEach(function (bullets, indexb, arrb) {
                if (detectCollisionCircleRect(bullets, boss)) {
                    boss.health -= bullets.damage;
                    if (boss.health <= 0) {
                        arr.splice(index, 1);
                        game.coins += (Math.round(Math.random() * 9 + 1)) * game.level;
                        game.health = game.maxHealth;
                        game.level++;
                        game.enemies = [];
                        game.bullets = [];
                        paused = true;
                    }
                    arrb.splice(indexb, 1);
                }
            })

        })
        this.turret.forEach(function (turret, index, arr) {
            turret.draw();
        })
        gun.draw();
        gameboard.draw();
    };
    spawnEnemies() {
        let yHelp = Math.round(Math.random() * 6 - 0.49);
        let y = canvas.height / 6 * yHelp + 22;
        let x = canvas.width;
        let speed = 3;
        if (yHelp > 6) {
            yhelp = 6;
        }
        this.enemies.push(new Enemies(x, y, speed * game.difficulty));
    }
    addBullets(e, yhelp) {
        let y = gun.y + 10;
        let x = gun.x;
        let radius = 5;
        let speed = 5;
        let damage = 1;
        damage += upgradesBought + Math.round(upgradesBought / 10);
        if (e == 0) {
            damage = Math.round(damage / 2);
            x = canvas.width / 10 + 20;
            radius = 3;
            y = yhelp + 30;
        }
        this.bullets.push(new Bullets(x, y, radius, speed, damage));

    };
    spawnBoss() {
        let yHelp = Math.round(Math.random() * 3 - 0.49);
        let y = canvas.height / 3 * yHelp + 22;
        let x = canvas.width;
        let speed = 1;
        let health = 50 * game.level * Math.round(game.level / 2);

        if (yHelp > 3) {
            yhelp = 3;
        }
        this.boss.push(new Boss(x, y, speed * game.difficulty, health));
    }
}
function animate() {
    if (!paused) {
        game.play();
        requestAnimationFrame(animate);
        updateScore();
    }

}
let game = new Game();
addBullet();
addEnemy(game.difficulty);
mouseDetection();
game.init();
animate();
buttons();


