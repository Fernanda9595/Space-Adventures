import Invader from "./Invader.js";

class Grid {
    /**
     * Construtor que inicializa a grade de invasores com as configurações.
     * @param {number} rows - Número de linhas de invasores.
     * @param {number} cols - Número de colunas de invasores.
     */
    constructor(rows, cols) {
        this.rows = rows; // Define o número de linhas
        this.cols = cols; // Define o número de colunas
        this.direction = "right"; // Direção inicial de movimento
        this.moveDown = false; // Flag para determinar se os invasores devem descer
        this.boost = 0.1; // Aumento da velocidade dos invasores ao descer
        this.invadersVelocity = 1; // Velocidade inicial dos invasores

        // Inicializa a grade de invasores
        this.invaders = this.init();
    }

    /**
     * Inicializa os invasores em uma matriz de acordo com as linhas e colunas definidas.
     * @returns {Array} - Array de objetos Invader.
     */
    init() {
        const array = [];

        // Cria invasores para cada posição na grade
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                const invader = new Invader(
                    {
                        x: col * 50 + 20, // Define a posição horizontal do invasor
                        y: row * 37 + 120, // Define a posição vertical do invasor
                    },
                    this.invadersVelocity // Atribui a velocidade inicial
                );

                array.push(invader); // Adiciona o invasor à grade
            }
        }

        return array; // Retorna a lista de invasores
    }

    /**
     * Desenha todos os invasores na tela.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderização do canvas.
     */
    draw(ctx) {
        this.invaders.forEach((invader) => invader.draw(ctx)); // Desenha cada invasor
    }

    /**
     * Atualiza a posição e a velocidade dos invasores, verificando se atingiram os limites da tela.
     * @param {boolean} playerStatus - Status do jogador (usado para parar o movimento dos invasores em algumas condições).
     */
    update(playerStatus) {
        // Verifica se os invasores atingiram os limites e altera a direção
        if (this.reachedRightBoundary()) {
            this.direction = "left";
            this.moveDown = true; // Os invasores devem descer ao atingir o limite direito
        } else if (this.reachedLeftBoundary()) {
            this.direction = "right";
            this.moveDown = true; // Os invasores devem descer ao atingir o limite esquerdo
        }

        if (!playerStatus) this.moveDown = false; // Se o status do jogador for falso, os invasores não descem

        // Atualiza a posição de cada invasor
        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown(); // Move os invasores para baixo
                invader.incrementVelocity(this.boost); // Aumenta a velocidade
                this.invadersVelocity = invader.velocity; // Atualiza a velocidade dos invasores
            }

            // Movimenta os invasores de acordo com a direção
            if (this.direction === "right") invader.moveRight();
            if (this.direction === "left") invader.moveLeft();
        });

        // Reseta o movimento para não continuar descendo
        this.moveDown = false;
    }

    /**
     * Verifica se algum invasor atingiu o limite direito da tela.
     * @returns {boolean} - Retorna verdadeiro se algum invasor atingiu o limite direito.
     */
    reachedRightBoundary() {
        return this.invaders.some(
            (invader) => invader.position.x + invader.width >= innerWidth
        );
    }

    /**
     * Verifica se algum invasor atingiu o limite esquerdo da tela.
     * @returns {boolean} - Retorna verdadeiro se algum invasor atingiu o limite esquerdo.
     */
    reachedLeftBoundary() {
        return this.invaders.some((invader) => invader.position.x <= 0);
    }

    /**
     * Retorna um invasor aleatório da grade.
     * @returns {Invader} - Um objeto Invader aleatório.
     */
    getRandomInvader() {
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }

    /**
     * Reinicia a grade de invasores, resetando sua posição e direção.
     */
    restart() {
        this.invaders = this.init(); // Recria os invasores
        this.direction = "right"; // Reseta a direção para "right"
    }
}

export default Grid;
