/*
THREE TYPES OF EFFECTS

1. Static position moves by it self and it handles how many objects needs
2. Parameters changes based on the parameters of an external object
3. Affects directly an external object

*/



// FX PRIMITIVES
class Point {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.speed = 10
        this.dx = randInt(0, this.speed)-this.speed/2
        this.dy = randInt(0, this.speed)-this.speed/2
        this.radius = radius

        this.color = "red"
    }
}

// this (-) is a dash
class Dash {
    constructor(x, y, length) {
        this.x = x
        this.y = y
        this.speed = 10
        this.dx = randInt(0, this.speed)-this.speed/2
        this.dy = randInt(0, this.speed)-this.speed/2
        this.length = length
        this.oriented = randChoice([/*"top", "bottom", "left", "right",*/
                                      "topleft","topright","bottomleft","bottomright"])
    }
}


/*##########################################################################*/


// Handle primitives to create EFFECTS
class Explotion {
    constructor(x, y, radius=20, duration=20) {
        this.x = x
        this.y = y
        this.radius = radius
        this.fillColor = ""
        this.strokeColor = ""
        
        this.particles = []
        this.numberOfParticles = 20
        this.addParticles(this.numberOfParticles)

        this.enabled = false
        this.timer = 0
        this.duration = duration        
    }
    
    addParticles(n=1) {
        for (let i = 0; i < n; i++) {
            this.particles.push(new Point(this.x, this.y, this.radius))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    move(p) {
        p.x += p.dx
        p.y += p.dy
    }
    
    effect(p) {
        if (p.radius <= 1) {
            this.removeParticle(p)
        }

        if (this.timer % this.duration == 0) {
            this.removeParticle(p)
        }
        
        // p.radius -= 1
    }

    draw(p) {
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        
        this.fillColor != ""? ctx.fill(): false;
        this.strokeColor != ""? ctx.stroke(): false;
        
    }
    
    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationTimer()
        this.particles.forEach(p=>{
            this.move(p)
            this.effect(p)
            this.draw(p)
        })            
    }
}





class Trail {
    constructor(duration=10) {
        this.fillColor = "red"
        this.particles = []
        
        this.enabled = false
        this.timer = 0
        this.duration = duration
    }
    
    addParticle(x=0, y=0, radius, color="red") {
        this.fillColor = color
        this.particles.push(new Point(x, y, radius))
    }
    
    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    effect(p) {
        if (p.radius < 2) {
            this.removeParticle(p)
        }
        
        if (this.particles.length >= 20) {
            this.removeParticle(p)
        }
        
        p.radius -= 1

    }

    colorShift() {
        let greenCycle = sineInt(255, this.timer%90, 4,)*0.5+50
        let blueCycle = sineInt(255, this.timer, 8,)*0.01
        this.fillColor = `rgb(${255}, ${greenCycle}, ${blueCycle})`
    }

    draw(p) {
        ctx.fillStyle = this.fillColor
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        ctx.fill()
    }

    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationTimer()
        this.particles.forEach(p=>{
            this.effect(p)
            this.draw(p)
        })
    }
}




class Sparks {
    constructor(x, y, duration=10) {
        this.x = x
        this.y = y
        this.particles = []
        
        this.addParticles(20)
        
        this.fillColor = "red"
        this.defaultStroke = this.strokeColor

        this.enabled = false
        this.timer = 0
        this.duration = duration
    }  

    setColor(color) {
        this.strokeColor = color
        this.defaultStroke = this.strokeColor
    }
    
    addParticles(n=1) {
        for (let i = 0; i < n; i++) {
            this.particles.push(new Dash(this.x, this.y, randInt(0, 10)+5))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    move(p) {
        p.x += p.dx*0.8
        p.y += p.dy*0.8
    }

    effect(p) {
        if (p.length <= 0) {
            this.removeParticle(p)
        }
        
        if (this.timer % this.duration == 0) {
            this.removeParticle(p)
        }

        p.length -= 0.25
        
    }
    
    draw(p) {
        ctx.lineWidth = randInt(0, 4)+1
        ctx.strokeStyle = this.fillColor
        // Crosshair Horizontal-Vertical
        // if (p.oriented === "right") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x+p.length, p.y)
        // }

        // if (p.oriented === "left") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x-p.length, p.y)
        // }

        // if (p.oriented === "top") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x, p.y-p.length)
        // }

        // if (p.oriented === "bottom") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x, p.y+p.length)
        // }
        
        // Crosshair Diagonals
        if (p.oriented === "topright") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x+p.length, p.y-p.length)
        }

        if (p.oriented === "topleft") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x-p.length, p.y-p.length)
        }

        if (p.oriented === "bottomleft") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x-p.length, p.y+p.length)
        }

        if (p.oriented === "bottomright") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x+p.length, p.y+p.length)
        }

        ctx.stroke()            
    }
    
    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationTimer()
        this.particles.forEach(p=>{
            this.move(p)
            this.effect(p)
            this.draw(p)
        }) 
    }
}





class Pulse {
    constructor(p1, duration=100) {
        this.p1 = p1
        this.maxim = 50
        this.freq = 4
        this.customFill = false
        this.customStroke = false
        this.lineWidth = 2

        this.enabled = false
        this.timer = 0
        this.duration = duration
    }

    effect() {
        let cycle = sineInt(this.maxim, this.timer%360, this.freq)
        this.p1.lineWidth = this.lineWidth
        
        if (this.customFill) {
            this.p1.fillColor = `hsl(${150}, ${cycle+50}%, ${60}%)`
        }
        if (this.customStroke) {
            this.p1.lineWidth = (cycle%4)+1
            this.p1.strokeColor = `hsl(${150}, ${cycle+50}%, ${60}%)`
        }
    }

    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationTimer()
        this.effect()
    }
}





class ShakeTable {
    constructor(table) {
        this.table = table
        
        this.enabled = false
        this.timer = 0
        this.duration = 30
    
        this.freq = 64
        this.maxCycle = 20
        this.decayRate = this.maxCycle/this.duration
        this.cycle = 0
    }

    effect() {
        this.table.x = sineInt(this.maxCycle, this.timer, this.freq, tableX-(this.maxCycle*0.5))
        this.maxCycle -= this.decayRate
        if (!this.enabled) {this.table.x = tableX}
    }

    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationTimer()
        this.effect()
    }
}





class Wormhole {
    constructor(game) {
        this.game = game
        this.particles = []
        this.maxParticles = 15

        this.enabled = true
        this.timer = 0
        this.reset = 20 // draw new circle every 100 fps
        this.subTimer = 0
        this.subReset = 15

        this.x = CCX
        this.y = CCY
        this.growSpeed = 0.55//0.5
        this.speed = this.growSpeed*2 // Speed Towards Center
        this.radius = 40
        this.maxRadius = 200
        this.angle = 45
        this.turnOffset = 100 // Turns offset positions
        this.strokeColor = "red"
        this.lineWidth = 1


        this.isTurning = "F" // U, D, L, R, F
        this.isCircular = randChoice([true, false])

        // To calculate the global alpha value
        this.distance = 0 // Distance to center CCX, CCY
        this.maxDistance = 300
        this.addParticle()
    }

    addParticle(n=1) {        
        for (let i = 0; i < n; i++) {
            this.particles.push(new Point(this.x, this.y, this.radius))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    fx() {
        // Updated every frame
        if (this.particles.length < this.maxParticles) {
            if (this.timer == 0) {
                this.addParticle()
            }
        }

        if (this.isTurning == "F") {
            this.moveForward()
            
        } else if (this.isTurning == "U") {
            this.moveUp()
            
        } else if (this.isTurning == "D") {
            this.moveDown()
        
        } else if (this.isTurning == "L") {
            this.turnLeft()
            
        } else if (this.isTurning == "R") {
            this.turnRight()
        }
        
    }
    
    effect(p) {
        // UPdated for each element in the list
        p.radius += this.growSpeed
        
        if (p.radius > this.maxRadius) {
            this.removeParticle(p)
        }

        if (p.x != CCX || p.y != CCY) {
            let dx = p.x - CCX
            let dy = p.y - CCY

            let vec = new Vector(dx, dy).setMag(this.speed)
            p.x -= vec.x
            p.y -= vec.y

            p.distance = Math.hypot(dx, dy)
            
        }
    }


    turnRight() {
        this.x = CCX+this.turnOffset
    }

    turnLeft() {
        this.x = CCX-this.turnOffset
    }

    moveUp() {
        this.y = CCY-this.turnOffset
    }

    moveDown() {
        this.y = CCY+this.turnOffset
    }

    moveForward() {
        this.x = CCX
        this.y = CCY
    }
            

    drawCircle(p) {
        ctx.save()
        ctx.globalAlpha = 1 - (p.distance/this.maxDistance)
        
        ctx.beginPath()
        ctx.strokeStyle = this.strokeColor
        ctx.lineWidth = this.lineWidth
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        ctx.stroke()

        ctx.restore()
    }

    drawSquare(p) {
        ctx.save()
        ctx.globalAlpha = 1 - (p.distance/this.maxDistance)
        
        ctx.beginPath()
        ctx.translate(p.x, p.y)
        ctx.rotate(this.angle)

        ctx.moveTo(-p.radius, -p.radius)
        ctx.lineTo(p.radius, -p.radius)
        ctx.lineTo(p.radius, p.radius)
        ctx.lineTo(-p.radius, p.radius)
        ctx.lineTo(-p.radius, -p.radius)
        
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeColor

        ctx.stroke()
        
        ctx.restore()
    }
    
    animationTimer() {
        if (this.enabled) {
            this.timer += 1
        }

        // reset timer
        if (this.timer%this.reset == 0) {
            this.timer = 0
            this.subTimer += 1
        }

        // reset subtimer
        if (this.subTimer%this.subReset == 0) {
            this.subTimer = 0
            this.isTurning = randChoice(["U", "D", "L", "R"])
        }

    }


    update() {
        this.strokeColor = this.game.table.strokeColor
        this.animationTimer()
        this.enabled? this.fx():false;

        this.particles.forEach(p=>{
            this.enabled? this.effect(p):false;
            
            if (this.isCircular) {
                this.drawCircle(p)
            } else {
                this.drawSquare(p)
            }
        })
        
    }
}
