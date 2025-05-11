class Particle {
    /**
     * Cria uma nova partícula para efeitos visuais (explosão, faíscas, etc.).
     * @param {{x: number, y: number}} position - Posição inicial da partícula.
     * @param {{x: number, y: number}} velocity - Velocidade da partícula em cada eixo.
     * @param {number} radius - Raio (tamanho visual) da partícula.
     * @param {string} color - Cor da partícula (CSS color string).
     */
    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1; // Opacidade começa em 1 (totalmente visível)
    }

    /**
     * Desenha a partícula no canvas com opacidade.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderização 2D.
     */
    draw(ctx) {
        ctx.save(); // Salva o estado atual do contexto
        ctx.beginPath();
        ctx.globalAlpha = this.opacity; // Aplica transparência
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore(); // Restaura o estado anterior (sem transparência)
    }

    /**
     * Atualiza a posição da partícula e reduz sua opacidade gradualmente.
     */
    update() {
        // Move a partícula
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Reduz a opacidade com limite mínimo de 0
        this.opacity = Math.max(0, this.opacity - 0.008);
    }
}

export default Particle;
