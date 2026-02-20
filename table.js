class Table {
    constructor(x, y, width, height, size=0) {
        this.x = x
        this.y = y
        this.w = width
        this.h = height
        this.cx = Math.floor(this.x+(this.w/2))
        this.cy = Math.floor(this.y+(this.h/2))
        this.size = size
        this.borderRadius = 0.055
        this.friction = 1
        
        this.radius = Math.floor(this.size*0.25) // Mid Field Radius
        this.goalAreaRadius = Math.floor(this.size*0.3)

        this.lineWidth = 2
        this.fillColor = "darkgreen"
        this.strokeColor = "#00ff99"
        this.defaultFill = this.fillColor
        this.defaultStroke = this.strokeColor

    }

    setColor(fill, stroke) {
        this.fillColor = fill
        this.strokeColor = stroke
        this.defaultFill = fill
        this.defaultStroke = stroke
    }
    
    mainField(ctx) {
        // Style
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeColor
        ctx.fillStyle = this.fillColor
        // Draw Main Rect
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.w, this.h, this.size*this.borderRadius)
        ctx.fill()
        ctx.stroke()
    }

    centerCircle(ctx) {
        let offsetRadius = 0.85
        // Style
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeColor
        // Field Center Circle
        ctx.beginPath()
        ctx.arc(this.cx, this.cy, this.radius, 0,  Math.PI*2)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.cx, this.cy, this.radius*offsetRadius, 0,  Math.PI*2)
        ctx.stroke()

        // Left Line From Circle
        ctx.beginPath()
        ctx.moveTo(this.cx-this.radius, this.cy)
        ctx.lineTo(this.x, this.cy)
        ctx.stroke()

        // Right Line From Circle
        ctx.beginPath()
        ctx.moveTo(this.cx+this.radius, this.cy)
        ctx.lineTo(this.x+this.w, this.cy)
        ctx.stroke()
    }

    goalSemiCircles(ctx) {
        let offsetRadius = 0.85
        // Style
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeColor
        // Top Goal
        ctx.beginPath()
        ctx.arc(this.cx, this.y, this.goalAreaRadius, 0, Math.PI)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.arc(this.cx, this.y, this.goalAreaRadius*offsetRadius, 0, Math.PI)
        ctx.stroke()

        // Bottom Goal
        ctx.beginPath()
        ctx.arc(this.cx, this.y+this.h, this.goalAreaRadius, Math.PI, 0)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.cx, this.y+this.h, this.goalAreaRadius*offsetRadius, Math.PI, 0)
        ctx.stroke()
    }
    
    draw(ctx) {
        this.mainField(ctx)
        this.centerCircle(ctx)
        this.goalSemiCircles(ctx)
    }
    
}


// total field = 20x42; converted to 200x420; 200*2.1
// goal at 65 from both sides(left-right)
// ball Size = 3x3; tableW*0.055
// playerPaddle = tableW*0.085

// Draw the table on the BG canvas to draw it once
// Everything else animated draw it on the FG canvas


class Goal {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.borderRadius = this.w*0.1
        this.lineWidth = 2

        this.fillColor = "darkgreen"
        this.strokeColor = "#00ff66"
        this.defaultFill = this.fillColor
        this.defaultStroke = this.strokeColor
    }

    setColor(fill, stroke) {
        this.fillColor = fill
        this.strokeColor = stroke
        this.defaultFill = fill
        this.defaultStroke = stroke
    }
    
    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor
        
        ctx.beginPath()
        ctx.roundRect(this.x,this.y,this.w, this.h, this.borderRadius)

        ctx.fill()
        ctx.stroke()
    }
}






class Grass {
    constructor(game) {
        this.game = game
        this.table = game.table
        this.verLines = []
        this.x = this.table.x
        this.y = this.table.y
        this.createLines()
    }

    createLines(n=10) {
        let col = parseInt(this.table.w/n)
        
        for (let i = 0; i < n; i++) {
            var x1 = i*col+this.x+(col*0.8)
            var y1 = 0+this.y
            var x2 = i*col+this.x+(col*0.8)
            var y2 = this.table.h+this.y
            
            var line = new Line(x1, y1, x2, y2)
            line.lineWidth = 1
            line.strokeColor = this.table.strokeColor
            this.verLines.push(line)
        }
    }

    update() {
        this.game.table.fillColor = "rgba(0,0,0, 0.1)"
        
        this.verLines.forEach(line=>{
            line.strokeColor = this.table.strokeColor
            line.draw(ctx)
        })
    }
}