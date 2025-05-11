import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Invader {
    /**
     * Cria um novo invasor com posição e velocidade iniciais.
     * @param {{x: number, y: number}} position - Posição inicial do invasor.
     * @param {number} velocity - Velocidade horizontal do invasor.
     */
    constructor(position, velocity) {
        this.position = position;
        this.scale = 0.8;
        this.width = 50 * this.scale;
        this.height = 37 * this.scale;
        this.velocity = velocity;

        this.image = this.loadImage(PATH_INVADER_IMAGE); // Carrega imagem do invasor
    }

    /**
     * Move o invasor para a direita.
     */
    moveRight() {
        this.position.x += this.velocity;
    }

    /**
     * Move o invasor para a esquerda.
     */
    moveLeft() {
        this.position.x -= this.velocity;
    }

    /**
     * Move o invasor para baixo (normalmente quando atinge uma borda).
     */
    moveDown() {
        this.position.y += this.height;
    }

    /**
     * Aumenta a velocidade do invasor.
     * @param {number} boost - Valor a ser adicionado à velocidade atual.
     */
    incrementVelocity(boost) {
        this.velocity += boost;
    }

    /**
     * Carrega a imagem do invasor.
     * @param {string} path - Caminho para a imagem.
     * @returns {HTMLImageElement} - Elemento de imagem carregado.
     */
    loadImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    /**
     * Desenha o invasor na tela.
     * @param {CanvasRenderingContext2D} ctx - Contexto de desenho do canvas.
     */
    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    /**
     * Dispara um projétil a partir do centro inferior do invasor.
     * @param {Projectile[]} projectiles - Array de projéteis ativos.
     */
    shoot(projectiles) {
        const projectile = new Projectile(
            {
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + this.height,
            },
            10 // Velocidade vertical do projétil
        );

        projectiles.push(projectile);
    }

    /**
     * Verifica se o invasor foi atingido por um projétil.
     * @param {Projectile} projectile - O projétil a ser verificado.
     * @returns {boolean} - Verdadeiro se houver colisão.
     */
    hit(projectile) {
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }

    /**
     * Verifica colisão com obstáculos (ex: barreiras ou o jogador).
     * @param {{ position: { x: number, y: number }, width: number }} obstacle - Objeto a ser testado.
     * @returns {boolean} - Verdadeiro se colidiu.
     */
    collided(obstacle) {
        const withinBoundsX =
            (obstacle.position.x >= this.position.x &&
                obstacle.position.x <= this.position.x + this.width) ||
            (obstacle.position.x + obstacle.width >= this.position.x &&
                obstacle.position.x <= this.position.x);

        const withinBoundsY =
            obstacle.position.y >= this.position.y &&
            obstacle.position.y <= this.position.y + this.height;

        return withinBoundsX && withinBoundsY;
    }
}

export default Invader;
