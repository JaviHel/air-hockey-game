class VerletParticle {
    static ID = 0
    constructor(x=0, y=0, radius=1) {
        this.pos = new Vector(x, y)
        this.oldPos = this.pos.sub(new Vector())
        this.acc = new Vector()
        this.accSpeed = 1
        this.accSpeedX = 1
        this.accSpeedY = 1
        this.friction = 1
        this.radius = radius
        this.isLocked = false
        this.isSolid = true
        this.isVisible = true
        this.color = ""
        this.tag = ""
        this.interactWithTag = ""
        this.fx = null
        this.ID = VerletParticle.ID
        VerletParticle.ID += 1
    }
    
    applyForce(forceVec) {
        this.acc.x += forceVec.x
        this.acc.y += forceVec.y
    }

    shootBall(bool) {
        
    }

    // Particle Movement
    UP(bool){}
    DOWN(bool){}
    LEFT(bool){}
    RIGHT(bool){}

    // Particle Action
    ACTION_1(bool){}
    ACTION_2(bool){}
    ACTION_3(bool){}


    

    lock(boolean=true) {
        this.isLocked = boolean
    }
}




class VerletSegment {
    constructor(particleA, particleB, stiffness=0.5, restLength=0) {
        this.particleA = particleA
        this.particleB = particleB
        this.stiffness = stiffness
        restLength != 0? this.length = restLength:
        this.length = particleA.pos.dist(particleB.pos);
    }

    constraint() {
        // Segment current int-length and desire int-length
        let currLen = this.particleA.pos.dist(this.particleB.pos)
        let desireLen = this.length
        let diff = currLen - desireLen

        // Unit/Normalized Vector of the current distance 
        // between particles
        let vecLen = this.particleA.pos.sub(this.particleB.pos).unit()
        let scaledVecLen = vecLen.mul(diff*this.stiffness)

        // Apply the new segment/vector length
        // to the position of the particles
        if (!this.particleB.isLocked) {
            this.particleB.pos = this.particleB.pos.add(scaledVecLen)
        }
        if (!this.particleA.isLocked) {
            this.particleA.pos = this.particleA.pos.add(scaledVecLen.mul(-1))
        }
    }
}




// EFFECTS           


class AttractionEffect {
    constructor(particle, radius=0, strength=1, blackHoleBool=false,) {
        this.particle = particle
        this.radius = radius
        this.strength = strength
        this.blackHoleBool = blackHoleBool
    }

    setStrength(s=1) {
        this.strength = s
    }
    
    update(particles) {
        particles.forEach(p=>{
            let radius = 0
            this.radius == 0? radius = p.radius+this.particle.radius: radius = this.radius+p.radius;
            
            if (p != this.particle && !p.isLocked && 
                p.ID != this.particle.ID &&
                p.tag == this.particle.interactWithTag &&
                p.pos.dist(this.particle.pos) < radius) {
                
                let distVec = this.particle.pos.sub(p.pos)
                let newVel = distVec.setMag(this.strength)
                p.pos = p.pos.add(newVel)
                this.blackHole? p.oldPos = p.pos:false;

                
                if (this.particle.tag === "PT" || 
                    this.particle.tag === "PB") {
                    Alert.playerCollideBall = true
                } 
                
                if (this.particle.tag === "PT") {
                    Alert.playerTopCollideBall = true
                } 

                if (this.particle.tag === "PB") {
                    Alert.playerBottomCollideBall = true
                }
                
                if (this.particle.tag === "N") {
                    Alert.ballCollideNodes = true
                }

            }
        })
    }
}




class GravityEffect {
    constructor(gravity) {
        this.gravity = new Vector(0, gravity)
    }

    update(particles) {
        particles.forEach(particle=>{
            if (!particle.isLocked) {
                particle.applyForce(this.gravity)
            }
        })
    }
}





class GravAttractionEffect {
    constructor(particle, radius=0, strength=2, gravAttr=50,) {
        this.particle = particle
        this.radius = radius
        this.strength = strength
        this.gravAttr = gravAttr
    }

    update(particles) {
        particles.forEach(p=>{
            let radius = 0
            this.radius == 0? radius = p.radius+this.particle.radius: radius = this.radius;
           
            if (p != this.particle && !p.isLocked && p.ID != this.particle.ID &&
                p.pos.dist(this.particle.pos) <= radius) {

                let distVec = this.particle.pos.sub(p.pos)
                distVec = distVec.unit().mul(this.strength)
                // let strength = distVec.mul(1/this.gravAttr)
                let strength = distVec.div(this.gravAttr)
                distVec.setMag(strength)
                p.applyForce(distVec)
            }
        })
    }
}












// MAIN CLASS - VERLET PHYSICS 


class VerletPhysics {
    constructor() {
        this.particles = []
        this.segments = []
        this.effects = []
    }

    // ADD OBJECTS
    addParticle(particle) {
        this.particles.push(particle)
    }
    addSegment(segment) {
        this.segments.push(segment)
    }
    addEffect(effect) {
        this.effects.push(effect)
    }

    
    // REMOVE OBJECTS
    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }
    removeSegment(segment) {
        let segmIndex = this.segments.indexOf(segment)
        this.segments.splice(segmIndex, 1)
    }
    removeEffect(effect) {
        let fxIndex = this.effects.indexOf(effect)
        this.effects.splice(fxIndex, 1)
    }
       
    // GET OBJECTS
    getParticles() {
        return this.particles
    }
    getSegments() {
        return this.segments
    }
    getEffects() {
        return this.effects
    }
    

    // UTILITY METHODS
    rectBound(x, y, w, h, r=0) {
        // Limits the positioning of the particles to a certain rect
        this.particles.forEach(p=>{
            
            if (!p.isLocked) {
                if (p.pos.x < x+r) {p.pos.x = x+r}
                else if (p.pos.x > w-r) {p.pos.x = w-r}
                if (p.pos.y < y+r) {p.pos.y = y+r}
                else if (p.pos.y > h-r) {p.pos.y = h-r}
            }

        })
    }


    rectBounce(x, y, w, h, r=0) {
        // Limits the positions of the particles to a certain rect
        // but they bounce to the opposite direction
        this.particles.forEach(p=>{
            
            if (!p.isLocked) {
                if (p.pos.x < x+r) {
                    p.pos.x = x+r
                    p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
                }
                else if (p.pos.x > w-r) {
                    p.pos.x = w-r
                    p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
                }
                
                if (p.pos.y < y+r) {
                    p.pos.y = y+r
                    p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
                }
                else if (p.pos.y > h-r) {
                    p.pos.y = h-r
                    p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
                }                
            }

        })
    }


    rectBoundPaddle(x, y, w, h, r=0) {
        this.particles.forEach(p=>{
            
            if (!p.isLocked && p.tag == "PT" || p.tag == "PB") {
                if (p.pos.x < x+r) {
                    p.pos.x = x+r
                    Alert.playerCollideWalls = true
                }
                else if (p.pos.x > w-r) {
                    p.pos.x = w-r
                    Alert.playerCollideWalls = true
                }
                
                if (p.pos.y < y+r) {
                    p.pos.y = y+r
                    Alert.playerCollideWalls = true
                }
                else if (p.pos.y > h-r) {
                    p.pos.y = h-r
                    Alert.playerCollideWalls = true
                }
            }

        })
    }


    rectBounceBall(x, y, w, h, r=0, left=true, right=true, top=true, bottom=true) {
        // Cancel sides if needed
        this.particles.forEach(p=>{
            
            if (!p.isLocked && p.tag == "B") {
                if (left && p.pos.x < x+r && p.pos.y-r < h && p.pos.y+r > y) {
                    p.pos.x = x+r
                    p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
                    Alert.ballCollideWalls = true
                    Alert.ballCollideLeft = true
                }
                else if (right && p.pos.x > w-r && p.pos.y-r < h && p.pos.y+r > y) {
                    p.pos.x = w-r
                    p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
                    Alert.ballCollideWalls = true
                    Alert.ballCollideRight = true
                }
                
                if (top && p.pos.y < y+r && p.pos.x-r < w && p.pos.x+r > x) {
                    p.pos.y = y+r
                    p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
                    Alert.ballCollideWalls = true
                    Alert.ballCollideTop = true
                }
                else if (bottom && p.pos.y > h-r && p.pos.x-r < w && p.pos.x+r > x) {
                    p.pos.y = h-r
                    p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
                    Alert.ballCollideWalls = true
                    Alert.ballCollideBottom = true
                }                
            }

        })
    }
    

    
    // UPDATE METHODS    
    updateParticles() {
        // Verlet Movement
        this.particles.forEach(particle=>{
            if (!particle.locked) {
                let velVec = particle.pos.sub(particle.oldPos)
                velVec = velVec.add(particle.acc).mul(particle.friction)
                particle.oldPos = particle.pos
                particle.pos = particle.pos.add(velVec)
                particle.acc = new Vector()
            }
        })
    }
    
    updateSegments() {
        this.segments.forEach(segment=>{
            segment.constraint()
        })
    }
    
    updateEffects() {
        this.effects.forEach(effect=>{
            effect.update(this.particles)
        })
    }
    
    // UPDATE EVERYTHING
    update() {
        this.particles.length!=0? this.updateParticles():false;
        this.segments.length!=0? this.updateSegments():false;
        this.effects.length!=0? this.updateEffects():false;
    }
}












