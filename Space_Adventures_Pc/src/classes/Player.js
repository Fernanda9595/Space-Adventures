import {
    INITIAL_FRAMES,
    PATH_ENGINE_IMAGE,
    PATH_ENGINE_SPRITES,
    PATH_SPACESHIP_IMAGE,
} from "../utils/constants.js";

import Projectile from "./Projectile.js";

/**
 * Representa o jogador controlando a nave.
 */
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;

        // Tamanho da nave
        this.width = 48 * 2;
        this.height = 48 * 2;

        // Velocidade de movimento lateral
        this.velocity = 6;

        // Posição inicial centralizada horizontalmente
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        // Imagens da nave e efeitos de propulsão
        this.image = this.loadImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.loadImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.loadImage(PATH_ENGINE_SPRITES);

        // Controle de animação dos sprites da propulsão
        this.sx = 0; // Posição horizontal da imagem (spritesheet)
        this.framesCounter = INITIAL_FRAMES;
    }

    /**
     * Move a nave para a esquerda.
     */
    moveLeft() {
        this.position.x -= this.velocity;
    }

    /**
     * Move a nave para a direita.
     */
    moveRight() {
        this.position.x += this.velocity;
    }

    /**
     * Carrega uma imagem a partir de um caminho.
     * @param {string} path - Caminho da imagem.
     * @returns {HTMLImageElement}
     */
    loadImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    /**
     * Desenha a nave e os efeitos visuais de propulsão.
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
     */
    draw(ctx) {
        // Nave principal
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        // Sprite da propulsão (animado)
        ctx.drawImage(
            this.engineSprites,
            this.sx, 0, 48, 48,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height
        );

        // Imagem fixa da propulsão
        ctx.drawImage(
            this.engineImage,
            this.position.x,
            this.position.y + 8,
            this.width,
            this.height
        );

        // Atualiza frames de animação
        this.updateEngineAnimation();
    }

    /**
     * Atualiza a animação da propulsão da nave.
     */
    updateEngineAnimation() {
        if (this.framesCounter === 0) {
            // Avança para o próximo frame do sprite ou reinicia
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INITIAL_FRAMES;
        }

        this.framesCounter--;
    }

    /**
     * Dispara um projétil a partir da posição atual da nave.
     * @param {Projectile[]} projectiles - Lista de projéteis ativos no jogo.
     */
    shoot(projectiles) {
        const projectile = new Projectile(
            {
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + 2,
            },
            -10 // Velocidade negativa (vai pra cima)
        );

        projectiles.push(projectile);
    }

    /**
     * Verifica se a nave foi atingida por um projétil.
     * @param {Projectile} projectile - Projétil inimigo.
     * @returns {boolean} - Verdadeiro se houver colisão.
     */
    hit(projectile) {
        const hitboxX = this.position.x + 20;
        const hitboxWidth = this.width - 38;
        const hitboxY = this.position.y + 22;
        const hitboxHeight = this.height - 34;

        return (
            projectile.position.x >= hitboxX &&
            projectile.position.x <= hitboxX + hitboxWidth &&
            projectile.position.y + projectile.height >= hitboxY &&
            projectile.position.y + projectile.height <= hitboxY + hitboxHeight
        );
    }
}

export default Player;
