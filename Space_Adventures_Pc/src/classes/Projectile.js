/**
 * Representa um projétil disparado no jogo (por jogador ou inimigo).
 */
class Projectile {
    constructor(position, velocity) {
        this.position = position;   // Posição inicial do projétil
        this.velocity = velocity;   // Velocidade vertical (positiva para baixo, negativa para cima)

        this.width = 2;             // Largura do projétil
        this.height = 20;           // Altura do projétil
    }

    /**
     * Desenha o projétil no canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
     */
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    /**
     * Atualiza a posição vertical do projétil com base na sua velocidade.
     */
    update() {
        this.position.y += this.velocity;
    }
}

export default Projectile;
