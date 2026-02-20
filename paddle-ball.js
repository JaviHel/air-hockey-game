
// Node use in the goals and the corners to simulate sticks on the field
class Node extends VerletParticle {
    constructor(x, y, r) {
        super(x, y, r)
        this.color = "white"
        this.lock()
        this.tag = "N" // Node
        this.interactWithTag = "B" // Ball
        this.isVisible = false
        
        physics.addParticle(this)
        this.fx = new AttractionEffect(this, 0, -0.6)
        physics.addEffect(this.fx)
        
    }

    draw(ctx) {
        // ctx.fillStyle = this.color
        // ctx.beginPath()
        // ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        // ctx.fill()
    }
}




class Ball extends VerletParticle {
    constructor(x, y, r) {
        super(x, y, r)
        this.acc = new Vector(randChoice([-0.1, -0.5, -1, 0.1, 0.5, 1]), randChoice([-1, 1]))
        this.tag = "B" // Ball
        physics.addParticle(this)
        
        this.fillColor = "#00ffaa"
        this.strokeColor = "#00ffaa"
        this.defaultFill = this.fillColor
        this.defaultStroke = this.strokeColor

        this.defaultPos = new Vector(x, y)
    }

    getVel() {
        let velVec = this.oldPos.sub(this.pos)
        return velVec
    }
    
    getColor() {
        return [this.fill, this.stroke]
    }
    
    kill() {
        physics.removeParticle(this)
    }

    reset() {
        this.pos = this.defaultPos
        this.fillColor = this.defaultFill
        this.strokeColor = this.defaultStroke
    }
    
    setPos(x=0, y=0) {
        this.pos.x = x
        this.pos.y = y
    }

    setColor(fill, stroke) {
        this.fillColor = fill
        this.strokeColor = stroke
        this.defaultFill = fill
        this.defaultStroke = stroke
    }

    draw(ctx) {
        if (this.isVisible) {
            ctx.fillStyle = this.fillColor
            // ctx.strokeStyle = this.color
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
            ctx.fill()
            // ctx.stroke()
        }
    }
}




class Paddle extends VerletParticle {
    constructor(x, y, r) {
        super(x, y, r)
        this.accSpeed = 1
        this.friction = 0.8
        this.fillColor = "#00ff66"
        this.strokeColor = "#00ff66"
        this.defaultFill = this.fillColor
        this.defaultStroke = this.strokeColor
        // this.tag = "P" // Paddle
        // this.interactWithTag = "B" // Ball
        
        physics.addParticle(this)
        this.shootPwr = -2
        this.fx = new AttractionEffect(this, this.radius, this.shootPwr)
        physics.addEffect(this.fx)

    }

    kill() {
        physics.removeParticle(this)
    }

    getVel() {
        let velVec = this.oldPos.sub(this.pos)
        return velVec
    }
    
    setPos(x=0, y=0) {
        this.pos.x = x
        this.pos.y = y
    }
    
    setColor(fill, stroke) {
        this.fillColor = fill
        this.strokeColor = stroke
        this.defaultFill = fill
        this.defaultStroke = stroke
    }

    shootBall(bool) {
        // Hits The Ball With More Power
        if (bool) {
            this.fx.radius = this.radius*2
            this.fx.strength = this.shootPwr*4
        } else {
            this.fx.radius = this.radius
            this.fx.strength = this.shootPwr
        }
    }

    slowWalk(bool) {
        if (bool) {
            this.accSpeed = 0.4
        } else {
            this.accSpeed = 1
        }
    }

    keyControlP2() {
        if (UP) {
            this.acc.y -= this.accSpeed*this.accSpeedY
        } 
        if (DOWN) {
            this.acc.y += this.accSpeed*this.accSpeedY
        }
        if (LEFT) {
            this.acc.x -= this.accSpeed*this.accSpeedX
        }
        if (RIGHT) {
            this.acc.x += this.accSpeed*this.accSpeedX
        }

        if (ACTION_J) {
            ACTION_J = false
            this.shootBall(true)
        } else {
            this.shootBall(false)
        }
        
        if (ACTION_K) {
            // ACTION_J = false
            this.slowWalk(true)    
        } else {
            this.slowWalk(false)    
        }
    }
    

    keyControlP1() {
        if (ARROW_UP) {
            this.acc.y -= this.accSpeed*this.accSpeedY
        } 
        if (ARROW_DOWN) {
            this.acc.y += this.accSpeed*this.accSpeedY
        }
        if (ARROW_LEFT) {
            this.acc.x -= this.accSpeed*this.accSpeedX
        }
        if (ARROW_RIGHT) {
            this.acc.x += this.accSpeed*this.accSpeedX
        }

        if (ACTION_1) {
            ACTION_1 = false
            this.shootBall(true)
        } else {
            this.shootBall(false)
        }

        if (ACTION_2) {
            // ACTION_J = false
            this.slowWalk(true)    
        } else {
            this.slowWalk(false)    
        }
    }
    
    draw(ctx) {
        if (this.isVisible) {
            
            ctx.lineWidth = 2
            ctx.fillStyle = this.fillColor
            ctx.strokeStyle = this.strokeColor
            
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, this.radius*0.4, 0, Math.PI*2)
            ctx.fill()
            
        }
    }
}






class PlayerTop extends Paddle {
    constructor(x, y, r) {
        super(x, y, r)
        this.tag = "PT"
        this.interactWithTag = "B"
    }
}


class PlayerBottom extends Paddle {
    constructor(x, y, r) {
        super(x, y, r)
        this.tag = "PB"
        this.interactWithTag = "B"
    }
}


class PaddleCPU extends VerletParticle {
    constructor(x, y, r) {
        super(x, y, r)
        this.lineWidth = 2
        this.fillColor = ""
        this.strokeColor = ""

        this.tag = "PT"
        this.interactWithTag = "B"
        
    }

    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor
        
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        !this.strokeColor==""? ctx.stroke(): false;

        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius*0.4, 0, Math.PI*2)
        !this.fillColor==""? ctx.fill(): false;
    }
}

class BallCPU extends VerletParticle {
    constructor(x, y, r) {
        super(x, y, r)
        this.fillColor = ""
        this.tag = "B"
    }

    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor

        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
     
        !this.fillColor==""? ctx.fill(): false;
        !this.strokeColor==""? ctx.stroke(): false;
    }
}


