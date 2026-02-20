class SoundFX {
    static enabled = true
    
    constructor(game) {
        this.game = game
        
        this.ballHitWall = [new Audio("sfx/ball-hit-wall-1.mp3"), new Audio("sfx/ball-hit-wall-2.mp3")]
        this.paddleHitBall = [new Audio("sfx/paddle-hit-1.mp3"), new Audio("sfx/paddle-hit-2.mp3")]
        this.paddleSuperHit = [new Audio("sfx/super-hit-1.mp3"), new Audio("sfx/super-hit-2.mp3")]
        this.explotion = new Audio("sfx/Explotion-1.mp3")
        
    }

    hitWallFX() {
            if (Alert.ballCollideWalls) {
                let sfx = randChoice(this.ballHitWall)
                sfx.currentTime = 0
                sfx.play()
            }
    }

    hitPaddleFX() {
        if (Alert.playerCollideBall) {
            let sfx = randChoice(this.paddleHitBall)
            sfx.currentTime = 0
            sfx.play()
        }
    }
    
    superHitPaddleFX() {
        if (Alert.playerSuperHit) {
            let sfx = randChoice(this.paddleSuperHit)
            sfx.currentTime = 0
            sfx.play()
        }
    }

    playerScoredFX() {
        if (Alert.playerTopScored) {
            this.explotion.currentTime = 0.1
            this.explotion.play()
        }

        if (Alert.playerBottomScored) {
            this.explotion.currentTime = 0.1
            this.explotion.play()
        }
    }
    
    update() {
        if (SoundFX.enabled) {
            this.hitWallFX()
            this.hitPaddleFX()
            this.superHitPaddleFX()
            this.playerScoredFX()
        }
    }
}

