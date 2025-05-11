// Caminhos das imagens usadas no jogo
export const PATH_SPACESHIP_IMAGE = "src/assets/images/spaceship.png";       // Nave do jogador
export const PATH_ENGINE_IMAGE = "src/assets/images/engine.png";             // Fumaça ou motor da nave
export const PATH_ENGINE_SPRITES = "src/assets/images/engine_sprites.png";   // Animação de motor
export const PATH_INVADER_IMAGE = "src/assets/images/invader.png";           // Inimigos

// Quantidade de estrelas no fundo animado
export const NUMBER_STARS = 100;

// Número de quadros entre cada mudança no sprite do motor da nave
export const INITIAL_FRAMES = 8;

// Estados possíveis do jogo
export const GameState = {
    START: "start",         // Tela inicial
    PLAYING: "playing",     // Jogo em andamento
    GAME_OVER: "gameOver",  // Tela de fim de jogo
};
