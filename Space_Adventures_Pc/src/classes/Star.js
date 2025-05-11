/**
 * Representa uma estrela de fundo animada no espaço.
 */
class Star {
    constructor(canvasWidth, canvasHeight) {
        // Define posição aleatória da estrela dentro dos limites do canvas
        this.position = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
        };

        // Define o tamanho da estrela e a velocidade proporcional ao tamanho
        this.radius = Math.random() * 1 + 0.3; // Entre 0.3 e 1.3
        this.velocity = (Math.random() * 0.4 + 0.1) * this.radius;

        // Armazena o tamanho do canvas para referência ao atualizar a posição
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Cor fixa (branca)
        this.color = "white";
    }

    /**
     * Desenha a estrela no canvas.
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    /**
     * Atualiza a posição da estrela, simulando movimento descendente.
     * Reinicia a estrela no topo se sair da tela.
     */
    update() {
        // Se a estrela ultrapassar o limite inferior da tela, reaparece no topo
        if (this.position.y > this.canvasHeight + this.radius) {
            this.position.y = -this.radius;
            this.position.x = Math.random() * this.canvasWidth;

            // Recalcula a velocidade proporcional ao novo tamanho
            this.velocity = (Math.random() * 0.4 + 0.1) * this.radius;
        }

        // Aplica movimento descendente
        this.position.y += this.velocity;
    }
}

export default Star;
