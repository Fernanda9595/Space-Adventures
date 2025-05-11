/**
 * Gerencia todos os efeitos sonoros do jogo.
 */
class SoundEffects {
    constructor() {
        // Efeitos sonoros de disparo 
        this.shootSounds = Array.from({ length: 5 }, () => new Audio("src/assets/audios/shoot.mp3"));

        // Efeitos sonoros de acerto de inimigo
        this.hitSounds = Array.from({ length: 5 }, () => new Audio("src/assets/audios/hit.mp3"));

        // Som de explosão
        this.explosionSound = new Audio("src/assets/audios/explosion.mp3");

        // Som de avanço para o próximo nível
        this.nextLevelSound = new Audio("src/assets/audios/next_level.mp3");

        // Índices para alternar os sons e evitar sobreposição ou falha na reprodução
        this.currentShootSound = 0;
        this.currentHitSound = 0;

        // Ajuste inicial dos volumes
        this.adjustVolumes();
    }

    /**
     * Toca o próximo som de disparo disponível.
     */
    playShootSound() {
        const sound = this.shootSounds[this.currentShootSound];
        sound.currentTime = 0;
        sound.play();

        // Alterna para o próximo som da fila circular
        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length;
    }

    /**
     * Toca o próximo som de acerto disponível.
     */
    playHitSound() {
        const sound = this.hitSounds[this.currentHitSound];
        sound.currentTime = 0;
        sound.play();

        // Alterna para o próximo som da fila circular
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    /**
     * Toca o som de explosão.
     */
    playExplosionSound() {
        this.explosionSound.play();
    }

    /**
     * Toca o som de transição de fase.
     */
    playNextLevelSound() {
        this.nextLevelSound.play();
    }

    /**
     * Ajusta os volumes individuais dos sons para balanceamento da mixagem.
     */
    adjustVolumes() {
        this.shootSounds.forEach(sound => sound.volume = 0.5);
        this.hitSounds.forEach(sound => sound.volume = 0.2);
        this.explosionSound.volume = 0.2;
        this.nextLevelSound.volume = 0.4;
    }
}

export default SoundEffects;
