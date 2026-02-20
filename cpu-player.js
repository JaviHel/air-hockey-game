const DIFFICULTY = {
    EASY: {
        shootRange: 0.55,
        rangeOfVision: 25,
        followAccuracy: 6,
        reactionDealy: 12,
        reactionSpeed: "slow",
    },
    
    NORMAL: {
        shootRange: 0.45,
        rangeOfVision: 30,
        followAccuracy: 4,
        reactionDealy: 6,
        reactionSpeed: "medium",
    },
        
    HARD: {
        shootRange: 0.35,
        rangeOfVision: 50,
        followAccuracy: 2,
        reactionDealy: 2,
        reactionSpeed: "fast",
    }
}





class PlayerCPU {
    constructor(game) {
        this.game = game
        this.ball = game.ball
        this.table = this.game.table
        this.player = [this.game.playerTop, this.game.playerBot]
        this.cpu = this.player[0]

        this.speedx = 2
        // this.speedy = 0.5

        this.shootRange = 0.35 // 0.35
        this.rangeOfVision = 50 // 40 normal - 50 hard
        this.followAccuracy = 2 // Less is more precise
        this.reactionDealy = 12 //
        this.reactionSpeed = "fast"

    }

    setDifficulty(level) {
        let d = DIFFICULTY[level]
        this.shootRange = d.shootRange
        this.rangeOfVision = d.rangeOfVision 
        this.followAccuracy = d.followAccuracy 
        this.reactionDealy = d.reactionDealy 
        this.reactionSpeed = d.reactionSpeed
    }


    // Basic Movements
    moveLeft(str="fast") {
        let speed = {slow:0.25, medium:0.5, fast:1,}
        this.cpu.pos.x -= this.speedx*speed[str]
    }

    moveRight(str="fast") {
        let speed = {slow:0.25, medium:0.5, fast:1,}
        this.cpu.pos.x += this.speedx*speed[str]
    }

    moveUp(str="fast") {
        let speed = {slow:0.25, medium:0.5, fast:1,}
        this.cpu.pos.y += this.speedy*speed[str]
    }

    moveDown(str="fast") {
        let speed = {slow:0.25, medium:0.5, fast:1,}
        this.cpu.pos.y += this.speedy*speed[str]
    }

    // X-axis
    followBall() {
        if (this.ball.pos.x+this.followAccuracy < this.cpu.pos.x) {
            this.moveLeft()
        } 
        
        if (this.ball.pos.x-this.followAccuracy > this.cpu.pos.x) {
            this.moveRight()
        }
    }

    
    // x-axis
    preciseFollowBall() {
        this.cpu.pos.x = this.ball.pos.x
    }

    // Imitates the y-axis movement of the player
    mirrorPlayerY() {
        this.cpu.pos.y += this.player[1].getVel().y*0.25
    }

    mirrorPlayerX() {
        this.cpu.pos.x += this.player[1].getVel().x*0.25
    }

    moveTowardsBall(str="slow") {
        let speed = {slow:0.25, medium:0.5, fast:1,}
        let vec = this.cpu.pos.sub(this.ball.pos).setMag(speed[str])
        this.cpu.pos = this.cpu.pos.sub(vec)
    }

    moveBackwardsBall(speed=0.5) {
        let vec = this.cpu.pos.sub(this.ball.pos).setMag(speed)
        this.cpu.pos = this.cpu.pos.sub(vec.mul(-1))
    }
    


    // Positive value ball moves up
    // Negative value ball moves down
    ballTowardsMe() {
        if (this.ball.getVel().y > 0) {
            return true
        }
        return false
    }

    ballInField() {
        if (this.ball.pos.y < this.table.cy) {
            return true
        }
        return false
    }

    ballInRange(scale=1) {
        if (this.cpu.pos.dist(this.ball.pos) < this.rangeOfVision*scale) {
            return true
        }
        return false
    }

    ballInFront() {
        if (this.ball.pos.y > this.cpu.pos.y) {
            return true
        }
        return false
    }

    ballInFrontGoal() {
        if (this.ball.pos.x > this.game.nodes[0].pos.x &&
            this.ball.pos.x < this.game.nodes[1].pos.x) {
            return true
        }
        return false
    }

    ballOnLeft() {
        if (this.ball.pos.x < this.cpu.pos.x) {
            return true
        }
        return false
    }

    ballOnRight() {
        return !this.ballOnLeft()
    }

    ballSpeedStr() {
        if (this.ball.getVel().y > 5) {
            return "fast"
        } else if (this.ball.getVel().y > 2) {
            return "medium"
        } else {
            return "slow"
        }
    }
    
    
    

    defendGoal(str="slow") {
        let speed = {slow:0.005, medium:0.01, fast:0.025,}
        
        let distX = (this.cpu.pos.x - this.game.table.cx)*speed[str]
        let distY = (this.cpu.pos.y - (this.game.table.cy*0.2))*speed[str]
        this.cpu.pos.x -= distX
        this.cpu.pos.y -= distY
    }
    
    defendMiddle(str="slow") {
        let speed = {slow:0.005, medium:0.01, fast:0.025,}
        
        let distX = (this.cpu.pos.x - this.game.table.cx)*speed[str]
        let distY = (this.cpu.pos.y - (this.game.table.cy*0.4))*speed[str]
        this.cpu.pos.x -= distX
        this.cpu.pos.y -= distY
    }

    defendTop(str="slow") {
        let speed = {slow:0.005, medium:0.01, fast:0.025,}
        
        let distX = (this.cpu.pos.x - this.game.table.cx)*speed[str]
        let distY = (this.cpu.pos.y - (this.game.table.cy*0.8))*speed[str]
        this.cpu.pos.x -= distX
        this.cpu.pos.y -= distY
    }
    
    
            
    update() {
        // this.drawCircle()
        // this.drawCircle(this.shootRange)
        // printScreen(this.reactionSpeed)

        if (this.ballInField()) {

            // DEFEND
            if (this.ballInFrontGoal()) {
                this.followBall(this.reactionSpeed)
            } 
    
            if (this.ballTowardsMe() && this.ballSpeedStr() == "medium" || !this.ballInFront()) {
                randPer(400)? this.defendMiddle(this.reactionSpeed): 
                              this.defendGoal(this.reactionSpeed);
            }

            // CHASE
            if (!this.ballInFrontGoal() && this.ballInFront() && this.ballSpeedStr() == "slow") {
                this.moveTowardsBall(this.reactionSpeed)
            }

            // ATTACK
            if (this.ballInRange() && this.ballInFrontGoal() && this.ballInFront() &&
                this.ballSpeedStr() == "medium" || this.ballSpeedStr() == "slow") {

                this.moveTowardsBall()

                if (this.ballInRange(this.shootRange) && randPer(200)) {
                    this.cpu.shootBall()
                } 
            }
            
            
        } else {
            if (randPer(200)) {
                this.defendTop()
                this.mirrorPlayerX()
            } else {
                this.defendMiddle()
            }
        }
    }


    

    // DEBUGGING METHODS
    drawCircle(scale=1) {
        ctx.beginPath()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.arc(this.cpu.pos.x, this.cpu.pos.y, this.rangeOfVision*scale, 0, Math.PI*2)
        ctx.stroke()
    }
}







