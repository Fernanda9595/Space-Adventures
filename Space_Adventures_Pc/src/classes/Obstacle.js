class Obstacle {
    /**
     * Cria um novo obstáculo.
     * @param {{x: number, y: number}} position - Posição do canto superior esquerdo.
     * @param {number} width - Largura do obstáculo.
     * @param {number} height - Altura do obstáculo.
     * @param {string} color - Cor do obstáculo (CSS color string).
     */
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    /**
     * Desenha o obstáculo no canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderização 2D.
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    /**
     * Verifica se um projétil colidiu com o obstáculo.
     * Considera a direção do projétil para saber qual extremidade usar na verificação.
     * @param {{ position: { x: number, y: number }, height: number, velocity: number }} projectile - Objeto do projétil.
     * @returns {boolean} - Retorna true se houve colisão.
     */
    hit(projectile) {
        // Determina qual ponto vertical do projétil verificar com base na direção
        const projectileY = projectile.velocity < 0
            ? projectile.position.y // Subindo
            : projectile.position.y + projectile.height; // Descendo

        // Verifica colisão entre os limites do projétil e do obstáculo
        const isWithinX = projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width;

        const isWithinY = projectileY >= this.position.y &&
    projectileY <= this.position.y + this.height;

        return isWithinX && isWithinY;
    }
}

export default Obstacle;
