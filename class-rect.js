class Rect {
    constructor(x, y, w, h, br=0, lw=1) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = parseInt(x+w*0.5)
        this.cy = parseInt(y+h*0.5)
        this.borderRadius = br
        this.lineWidth = lw

        this.fillColor = "black"
        this.strokeColor = ""
    }

    setInit(x, y, w, h, br) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.borderRadius = br
    }
    
    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor
        
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.w, this.h, this.borderRadius)
        
        this.fillColor !=""? ctx.fill(): false;
        this.strokeColor !=""? ctx.stroke(): false;
    }
}




class Selector extends Rect {
    constructor(x, y, w, h, br=0, lw=1) {
        super(x, y, w, h, br, lw)
        this.stepX = w
        this.stepY = h
        this.fillColor = "transparent"
        this.strokeColor = "rgba(0, 0, 255, 1)"

        this.opacityCycle = 0
        this.opacityCycleFreq = 32

        this.index = {x:0, y:0,}
    }

    pulseFX() {
        let opacity = sineFloat(1, this.opacityCycle, this.opacityCycleFreq)
        this.strokeColor = `rgba(0, 0, 255, ${opacity})`
        
        this.opacityCycle += 1
        this.opacityCycle >= 180? this.opacityCycle=0: false;
    }
    
    getPos() {
        return [this.x, this.y]
    }
    
    rectBound(x, y, w, h) {
        if (this.x < x) {
            this.x = x
        } else if (this.x > x+w-this.w) {
            this.x = x+w-this.w
        }

        if (this.y < y) {
            this.y = y
        } else if (this.y > y+h-this.h) {
            this.y = y+h-this.h
        }
    }
    
    keyControl() {
        if (UP) {
            UP = false
            this.y -= this.stepY

        } else if (DOWN) {
            DOWN = false
            this.y += this.stepY
        }

        if (LEFT) {
            LEFT = false
            this.x -= this.stepX
        } else if (RIGHT) {
            RIGHT = false
            this.x += this.stepX
        }
    }

    update() {
        this.draw(ctx)
        this.pulseFX()
        this.keyControl()
    }
}