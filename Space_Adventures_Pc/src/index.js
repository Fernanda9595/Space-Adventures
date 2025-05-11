// Importação das classes utilizadas no jogo
import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
import Star from "./classes/Star.js";

// Importação de constantes
import { GameState, NUMBER_STARS } from "./utils/constants.js";

// Instância do gerenciador de efeitos sonoros
const soundEffects = new SoundEffects();

// Elementos da interface
const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove(); // Oculta tela de game over inicialmente

// Configuração do canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

// Estado inicial do jogo
let currentState = GameState.START;

// Dados do jogo
const gameData = {
    score: 0,
    level: 1,
    high: 0,
};

// Atualiza HUD do jogo
const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

// Criação das entidades principais
const player = new Player(canvas.width, canvas.height);
const stars = [];
const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];
const obstacles = [];

// Inicializa obstáculos no cenário
const initObstacles = () => {
    const y = canvas.height - 250;
    const x = canvas.width / 2 - 50;
    const offset = canvas.width * 0.15;

    obstacles.push(new Obstacle({ x: x - offset, y }, 100, 20, "crimson"));
    obstacles.push(new Obstacle({ x: x + offset, y }, 100, 20, "crimson"));
};

initObstacles();

// Geração da grade de invasores com tamanho aleatório
const grid = new Grid(
    Math.round(Math.random() * 9 + 1),
    Math.round(Math.random() * 9 + 1)
);

// Teclas controladas
const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    },
};

// Funções de controle de score e level
const incrementScore = (value) => {
    gameData.score += value;
    if (gameData.score > gameData.high) gameData.high = gameData.score;
};

const incrementLevel = () => {
    gameData.level += 1;
};

// Cria estrelas de fundo
const generateStars = () => {
    for (let i = 0; i < NUMBER_STARS; i++) {
        stars.push(new Star(canvas.width, canvas.height));
    }
};

// Funções de desenho
const drawStars = () => stars.forEach(star => { star.draw(ctx); star.update(); });
const drawProjectiles = () => [...playerProjectiles, ...invadersProjectiles].forEach(p => { p.draw(ctx); p.update(); });
const drawParticles = () => particles.forEach(p => { p.draw(ctx); p.update(); });
const drawObstacles = () => obstacles.forEach(o => o.draw(ctx));

// Limpeza de projéteis e partículas fora da tela
const clearProjectiles = () => {
    playerProjectiles.forEach((p, i) => { if (p.position.y <= 0) playerProjectiles.splice(i, 1); });
    invadersProjectiles.forEach((p, i) => { if (p.position.y > canvas.height) invadersProjectiles.splice(i, 1); });
};

const clearParticles = () => {
    particles.forEach((p, i) => { if (p.opacity <= 0) particles.splice(i, 1); });
};

// Gera explosão de partículas
const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i++) {
        particles.push(new Particle(
            { x: position.x, y: position.y },
            { x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 1.5 },
            2,
            color
        ));
    }
};

// Verifica colisões
const checkShootInvaders = () => {
    grid.invaders.forEach((invader, i) => {
        playerProjectiles.some((projectile, j) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound();
                createExplosion({
                    x: invader.position.x + invader.width / 2,
                    y: invader.position.y + invader.height / 2,
                }, 10, "#941CFF");

                incrementScore(10);
                grid.invaders.splice(i, 1);
                playerProjectiles.splice(j, 1);
                return true;
            }
        });
    });
};

const checkShootPlayer = () => {
    invadersProjectiles.some((projectile, i) => {
        if (player.hit(projectile)) {
            soundEffects.playExplosionSound();
            invadersProjectiles.splice(i, 1);
            gameOver();
        }
    });
};

const checkShootObstacles = () => {
    obstacles.forEach(obstacle => {
        playerProjectiles.some((p, i) => obstacle.hit(p) && playerProjectiles.splice(i, 1));
        invadersProjectiles.some((p, i) => obstacle.hit(p) && invadersProjectiles.splice(i, 1));
    });
};

const checkInvadersCollidedObstacles = () => {
    obstacles.forEach((obstacle, i) => {
        grid.invaders.some(invader => {
            if (invader.collided(obstacle)) {
                obstacles.splice(i, 1);
                return true;
            }
        });
    });
};

const checkPlayerCollidedInvaders = () => {
    grid.invaders.some(invader => {
        if (
            invader.position.x >= player.position.x &&
            invader.position.x <= player.position.x + player.width &&
            invader.position.y >= player.position.y
        ) {
            gameOver();
        }
    });
};

// Reinicializa grade se invasores forem eliminados
const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();
        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);
        grid.restart();
        incrementLevel();
        if (obstacles.length === 0) initObstacles();
    }
};

// Game Over
const gameOver = () => {
    createExplosion({ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }, 10, "white");
    createExplosion({ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }, 5, "#4D9BE6");
    createExplosion({ x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 }, 5, "crimson");
    player.alive = false;
    currentState = GameState.GAME_OVER;
    showGameOverScreen();
};

const showGameOverScreen = () => {
    document.body.append(gameOverScreen);
    gameOverScreen.classList.add("zoom-animation");
};

// Loop principal do jogo
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();

    if (currentState === GameState.PLAYING) {
        showGameData();
        spawnGrid();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        checkShootInvaders();
        checkShootPlayer();
        checkShootObstacles();
        checkInvadersCollidedObstacles();
        checkPlayerCollidedInvaders();

        grid.draw(ctx);
        grid.update(player.alive);

        ctx.save();
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);

        if (keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        if (keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
        player.draw(ctx);
        ctx.restore();
    }

    if (currentState === GameState.GAME_OVER) {
        checkShootObstacles();
        drawProjectiles();
        drawParticles();
        drawObstacles();
        clearProjectiles();
        clearParticles();
        grid.draw(ctx);
        grid.update(player.alive);
    }

    requestAnimationFrame(gameLoop);
};

// Reinicializa o jogo
const restartGame = () => {
    currentState = GameState.PLAYING;
    player.alive = true;
    grid.invaders.length = 0;
    grid.invadersVelocity = 1;
    invadersProjectiles.length = 0;
    gameData.score = 0;
    gameData.level = 1;
    gameOverScreen.remove();
};

// Controles de teclado
addEventListener("keydown", ({ key }) => {
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === "Enter") keys.shoot.pressed = true;
});

addEventListener("keyup", ({ key }) => {
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === "Enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

// Início do jogo
buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    // Invasores atiram a cada 1 segundo
    setInterval(() => {
        const invader = grid.getRandomInvader();
        if (invader) invader.shoot(invadersProjectiles);
    }, 1000);
});

buttonRestart.addEventListener("click", restartGame);

generateStars();
gameLoop();
