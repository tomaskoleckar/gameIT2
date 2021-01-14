const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let test;
function mouseDetection(){
    canvas.addEventListener("mousemove", function(e){
        if(e.y < 675){
            gun.y = e.y;
            gun.y -= 134;
    }
    })
}
function addBullet(){
    canvas.addEventListener("click",function(){
        game.addBullets();
        console.log(game.bullets);
    })
}


let gameboard = {
    width: canvas.width,
    height: canvas.height,
    col: 6,
    row: 11,
    draw: function(){
        for(let i = 0;i<this.row+1;i++){
            for(let j = 0;j<this.col;j++){
                ctx.strokeStyle = "green"
                ctx.beginPath();
                ctx.moveTo(canvas.width/11*i*2,canvas.height/6*j);
                ctx.lineTo(canvas.width/11*(i-1)+canvas.width/11,canvas.height/6*j);
                ctx.stroke();
            }
        }
        ctx.beginPath();
        ctx.moveTo(canvas.width/11,0);
        ctx.lineTo(canvas.width/11,canvas.height);
        ctx.stroke();
    },
    
}
let gun = {
    sprite: new Image(),
    x: canvas.width/33,
    y: canvas.height/2,
    width: 80,
    height: 64,
    init: function(){
        this.sprite.src = "img/starter-gun.png";
    },
    draw: function(){
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    },
    
};
class enemies {
    constructor() {
        this.enemies = [];
    }
    
};
class Bullets{
    static FILL_COLOR = "red";
    constructor(x,y, radius=5,speed = 5) {
        this.x = x + canvas.width/33;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = Bullets.FILL_COLOR;
    }
    move(){
        this.x += this.speed;
    }
    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};
class Game{
    constructor(){
        this.bullets = [];
        this.enemies = [];
    };
    init(){
        gun.init();
    };
    draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.bullets.forEach(function(bullets, index,arr){
            bullets.move();
            bullets.draw();
            /* Jestliže koule spadne pod dolní okraj... */
            if (bullets.x + bullets.radius > canvas.width) {
                /*...bude z pole odstraněna */
                arr.splice(index, 1);    
            }
        });
        gun.draw();
        gameboard.draw();
    };
    addBullets(){
            let y = gun.y;
            let radius = 5;
            let speed = 5;
            this.bullets.push(new Bullets(gun.x, y, radius, speed));
        
    };
}
function animate(){
    game.draw();
    requestAnimationFrame(animate);
}
let game = new Game();
addBullet();
mouseDetection();
game.init();
animate();


