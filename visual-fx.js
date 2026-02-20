// VisualFX contains a list of effects
// adds effects to the list at certain moments
// and updates the effect at that position

class VisualFX {
    constructor(game=null) {
        this.game = game
        this.effects = []
        this.fxCacheSize = 10
        this.trail = new Trail(35)


    }

    removeFX(fx) {
        let fxIndex = this.effects.indexOf(fx)
        this.effects.splice(fxIndex, 1)
    }
    
    topPlayerGoalFX() {
        // When Bottom player scores 
        // the Top goal explodes
        if (Alert.playerTopScored) {
            let table = this.game.table
            let expDuration = 60
            let sparksFX = new Sparks(table.cx, table.y+table.h, expDuration)
            sparksFX.fillColor = this.game.ball.fillColor
            sparksFX.enabled = true

            let shakeTableFX = new ShakeTable(this.game.table)
            shakeTableFX.enabled = true
            
            this.effects.push(sparksFX, shakeTableFX)
        }
    }

    bottomPlayerGoalFX() {
        // When Top player scores 
        // the bottom goal explodes 
        if (Alert.playerBottomScored) {
            let table = this.game.table
            let expDuration = 60
            let sparksFX = new Sparks(table.cx, table.y, expDuration)
            sparksFX.fillColor = this.game.ball.fillColor
            sparksFX.enabled = true

            let shakeTableFX = new ShakeTable(this.game.table)
            shakeTableFX.enabled = true
            
            this.effects.push(sparksFX, shakeTableFX)
        }
    }

    ballTrailFX() {
        if (Alert.playerCollideBall) {
            let ball = this.game.ball
            let ballVelVec = ball.pos.sub(ball.oldPos)
            let ballVelX = Math.abs(ballVelVec.x)
            let ballVelY = Math.abs(ballVelVec.y)
            let absVelInt = Math.max(ballVelX, ballVelY)
            
            if (absVelInt > 6) {
                this.trail.enabled = true
                Alert.playerSuperHit = true
            }
        }

        if (this.trail.enabled) {
            let ball = this.game.ball
            this.trail.addParticle(ball.pos.x, ball.pos.y, ball.radius*2, ball.fillColor)
        }
        
        this.trail.update()

    }
    
    update() {
        this.topPlayerGoalFX()
        this.bottomPlayerGoalFX()
        this.ballTrailFX()
    
        this.effects.forEach(fx=>{
            fx.update()
            
            if (!fx.enabled) {
                this.removeFX(fx)
            }
            
        })
        
    }
}

