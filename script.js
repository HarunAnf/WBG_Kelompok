const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird;
let pipes = [];
let score = 0;
let isGameOver = false;

function startGame() {
    const username = document.getElementById("username").value;
    if (username) {
        document.getElementById("login-form").style.display = "none";
        bird = new Bird();
        pipes = [];
        score = 0;
        isGameOver = false;
        gameLoop();
    } else {
        alert("Please enter a username");
    }
}

function Bird() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.gravity = 0.6;
    this.velocity = 0;

    this.draw = function() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.update = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Check for collision with ground or ceiling
        if (this.y + this.height >= canvas.height || this.y < 0) {
            gameOver();
        }
    };

    this.flap = function() {
        this.velocity = -10;
    };
}

function Pipe() {
    this.x = canvas.width;
    this.gap = 100; // Jarak antara pipa atas dan pipa bawah
    // Tinggi pipa atas diacak, dengan batas minimum untuk memberikan celah
    this.topHeight = Math.random() * (canvas.height - this.gap - 60) + 20; 
    this.bottomHeight = canvas.height - this.topHeight - this.gap; 

    this.draw = function() {
        ctx.fillStyle = "green";
        // Gambar pipa atas
        ctx.fillRect(this.x, 0, 40, this.topHeight);
        // Gambar pipa bawah
        ctx.fillRect(this.x, canvas.height - this.bottomHeight, 40, this.bottomHeight);
    };

    this.update = function() {
        this.x -= 2; // Kecepatan pipa
        if (this.x + 40 < 0) {
            score++;
            pipes.splice(pipes.indexOf(this), 1);
        }

        // Check for collision with pipes
        if (
            bird.x < this.x + 40 &&
            bird.x + bird.width > this.x &&
            (bird.y < this.topHeight || bird.y + bird.height > canvas.height - this.bottomHeight)
        ) {
            gameOver();
        }
    };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();

    if (Math.random() < 0.02) {
        pipes.push(new Pipe());
    }

    pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();
    });

    if (isGameOver) return;

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true;
    document.getElementById("finalScore").innerText = `Score: ${score}`;
    document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
    document.getElementById("gameOver").classList.add("hidden");
    startGame();
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isGameOver) {
        bird.flap();
    }
});
