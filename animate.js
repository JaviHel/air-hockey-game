// MAIN FOLDER
/*

ALWAYS CREATE A DEFAULT VARIABLES TO EASILY RESET THE OPTIONS
EACH CLASS SHOULD HAVE A RESET METHOD
!!!!With the INIT helper method you can reset all the values easily!!!!
!!!!setInit is a copy of the contructor to rebuild the full object!!!!

----TO DO IDEAS----
Create the boundaries in a way that the ball enters the goals and disappears (READY)
If player maintains a button the paddle moves faster to hit the ball (READY)

Make disappear the ball when it enters to the goal with a black rect over it (READY)
Style the paddles and the ball (READY)
Paddles/player should not surpass the center of the table/field or the goal (READY)
FreeRoam Mode (READY)

Tables might be selected randomly(NOT)
table style is selected randomly(READY)
Create PlayerTwo Joystick (READY)
Create separated class for P1, P2, CPU inheriting from Paddle (READY)
Create a keyControl Method to use with both players(NOT)

Add animations to the bg of the table

Goal from inside the goalArea scores X2

Deny paddle access to the goal area
Class to style Table, Ball and Players (READY)?
Font Family "monospace"


A ball appears on the table and changes colors,
depending on the color if you scored a goal you will get bonus power

a ball appears on the screen and if you touch it with the player
gives you a beneffit or a better one if you touch it with the ball

If "something happens" your goal is solid/Wall and stronger shoot
left and right sides disable or ball reappears in the otherside

Player gets bigger
Ball changes size dinamically (pulse)

Ball exploes at random moments and the affected player cant move
for a certain time

*/




// Table Constants position and size
let OFFSET_SIZE = 0.66
let TABLE_SIZE = CCX*OFFSET_SIZE // Squared Size // desire 0.66
let TABLE_WIDTH = 2 // Default 1.6
let TABLE_HEIGHT = 2.4 // Default 2
const [tableX, tableY, tableW, tableH] = [(canvas.width-TABLE_SIZE*TABLE_WIDTH)*0.5, (canvas.height-TABLE_SIZE*TABLE_HEIGHT)*0.5, TABLE_SIZE*TABLE_WIDTH, TABLE_SIZE*TABLE_HEIGHT]




class Game {
    static difficulty = "NORMAL" // "EASY", "NORMAL", "HARD"
    static freeRoamEnabled = false
    static tableWithGrass = false
    
    static joystickEnabled = false
    static controllerP1 = true // true
    static controllerP2 = true // true
    
    static scoreToWin = 10
    static WINNER = null // "P1", "P2" string
    
    constructor() {
        this.bg = null // Crete a background animation
        this.table = new Table(tableX, tableY, tableW, tableH, TABLE_SIZE)
        this.tableSides = {left:true, right:true,} // default true
        
        this.ballSize = this.table.size*0.045
        this.ball = new Ball(this.table.cx, this.table.cy, this.ballSize)
        
        this.p1 = {x:this.table.cx, y:this.table.y+this.table.h*0.82, size:this.table.size*0.066,}
        this.p2 = {x:this.table.cx, y:this.table.y+this.table.h*0.18, size:this.table.size*0.066,}
        this.playerBot = new PlayerBottom(this.p1.x, this.p1.y, this.p1.size)
        this.playerTop = new PlayerTop(this.p2.x, this.p2.y, this.p2.size)

        this.cpu = new PlayerCPU(this)
        
        // Nodes to make the ball collide in table-corners and goals-corners
        this.nodes = []
        this.goalNodeSize = this.table.size*0.01
        this.cornerNodeSize = this.table.size*0.02
        this.addNodes()

        // Goals
        this.topGoal = new Goal(this.table.cx-this.table.goalAreaRadius, this.table.y-this.ballSize*1.8, this.table.goalAreaRadius*2, this.ballSize*2.6)
        this.bottomGoal = new Goal(this.table.cx-this.table.goalAreaRadius, this.table.y+this.table.h-this.ballSize*0.5, this.table.goalAreaRadius*2, this.ballSize*2.6)

        // VisualFX
        this.vfx = new VisualFX(this)

        // SoundFX
        this.sfx = new SoundFX(this)
        this.bgAnimation = new Wormhole(this)

        // Score
        this.score = new Score(this)
        
        // Game Theme Style
        this.gameTheme = new GameTheme(this)
        this.theme = this.gameTheme.pickRandomTheme()

        // Table Grass (Is here to get the updated colors)
        this.grass = new Grass(this)
        
        // State Manager
        this.states = {MainScreen:new MainScreen(this), Options:new Options(this), StartGame:new StartGame(this),
                       PauseGame:new PauseGame(this), GameOver:new GameOver(this),}

        this.state = this.states["MainScreen"]
        // this.state = this.states["Options"]
    }

    setState(newState) {
        this.state = this.states[newState]
    }
    
    getState(state) {
        return this.states[state]
    }

    reset() {
        // If pos and oldPos are the same they cancel each other
        this.playerTop.pos = new Vector(this.p2.x, this.p2.y)
        this.playerTop.oldPos = new Vector(this.p2.x, this.p2.y)
        this.playerBot.pos = new Vector(this.p1.x, this.p1.y)
        this.playerBot.oldPos = new Vector(this.p1.x, this.p1.y)

        this.score.reset()
        this.theme = this.gameTheme.pickRandomTheme()
        this.getState("Options").setTheme(this.theme.index)
        Game.WINNER = null
    }

    addNodes() {
        // Nodes are invisible to the players
        // Top Goal Nodes
        let goalTL = new Node(this.table.cx-this.table.goalAreaRadius, this.table.y, this.goalNodeSize)
        let goalTR = new Node(this.table.cx+this.table.goalAreaRadius, this.table.y, this.goalNodeSize)

        // Top Corners Nodes
        let cornerTL = new Node(this.table.x, this.table.y, this.cornerNodeSize)
        let cornerTR = new Node(this.table.x+this.table.w, this.table.y, this.cornerNodeSize)

        // Bottom Goal Nodes
        let goalBL = new Node(this.table.cx-this.table.goalAreaRadius, this.table.y+this.table.h, this.goalNodeSize)
        let goalBR = new Node(this.table.cx+this.table.goalAreaRadius, this.table.y+this.table.h, this.goalNodeSize)
        
        // Bottom Corners Nodes
        let cornerBL = new Node(this.table.x, this.table.y+this.table.h, this.cornerNodeSize)
        let cornerBR = new Node(this.table.x+this.table.w, this.table.y+this.table.h, this.cornerNodeSize)

        this.nodes.push(goalTL, goalTR, cornerTL, cornerTR, goalBL, goalBR, cornerBL, cornerBR)
    }

    ballTeleport() {
        if (!this.tableSides.left || !this.tableSides.right) {
            
            if (this.ball.pos.x > this.table.x + (this.table.w-this.ball.radius)) {
                let oldPos = this.ball.oldPos.sub(this.ball.pos) // Substracts the position from the velocity
                this.ball.pos.x = this.table.x + this.ball.radius // Changes the position
                this.ball.oldPos.x = this.ball.pos.x+(oldPos.x) // Adds the same velocity to the new position
            }

            if (this.ball.pos.x < this.table.x+this.ball.radius) {
                let oldPos = this.ball.oldPos.sub(this.ball.pos)
                this.ball.pos.x = this.table.x+(this.table.w-this.ball.radius)
                this.ball.oldPos.x = this.ball.pos.x+(oldPos.x)
            }
            
        }
    }
    
    ballTableBounds() {
        physics.rectBounceBall(this.table.x, this.table.y, this.table.cx-this.table.goalAreaRadius, this.table.y+this.table.h, this.ball.radius, this.tableSides.left, false)
        physics.rectBounceBall(this.table.cx+this.table.goalAreaRadius, this.table.y, this.table.x+this.table.w, this.table.y+this.table.h, this.ball.radius, false, this.tableSides.right)
    }

    paddleTableBounds() {
        physics.rectBoundPaddle(this.table.x, this.table.y, this.table.x+this.table.w, this.table.y+this.table.h, this.playerTop.radius)
    }

    paddleMiddleTableBound() {
        // Bottom Paddle Check
        if (this.playerTop.pos.y > this.table.cy-this.playerTop.radius) {
            this.playerTop.pos.y = this.table.cy-this.playerTop.radius
            Alert.playerTopCollideMiddleArea = true
        }
        // Top Paddle Check
        if (this.playerBot.pos.y < this.table.cy+this.playerBot.radius) {
            this.playerBot.pos.y = this.table.cy+this.playerBot.radius
            Alert.playerTopCollideMiddleArea = true
        }
    }

    checkGoal() {
        if (this.ball.pos.y+this.ball.radius < this.table.y) {
            // Ball Enters Top Goal
            // Reset ball position to the middle Area
            this.ball.oldPos = this.ball.pos
            this.ball.setPos(this.table.cx, this.table.cy)
            // Move ball to the player scored
            this.ball.acc = new Vector(randChoice([-0.25,-0.5,-0.75,-1, 0.25,0.5,0.75,1]), randChoice([0.1,0.5,1,2]))
            
            Alert.playerBottomScored = true
        }

        if (this.ball.pos.y-this.ball.radius > this.table.y+this.table.h) {
            // Ball Enters Bottom Goal
            // Reset ball position to the middle Area
            this.ball.oldPos = this.ball.pos
            this.ball.setPos(this.table.cx, this.table.cy)
            // Move ball to the player that scored
            this.ball.acc = new Vector(randChoice([-0.25,-0.5,-0.75,-1, 0.25,0.5,0.75,1]), randChoice([-0.1,-0.5,-1,-2]))
            
            Alert.playerTopScored = true
        }
    }

    joystickUpdate() {
        if (Game.joystickEnabled) {
            Game.controllerP2? this.playerTop.keyControlP1(): false;
            Game.controllerP1? this.playerBot.keyControlP2(): false;
        }
    }
    
    draw(ctx) {
        // This has an specific order
        Game.tableWithGrass? this.grass.update(): false;
        this.table.draw(ctx)
        physics.getParticles().forEach(p=>{p.draw(ctx)})
        this.topGoal.draw(ctx)
        this.bottomGoal.draw(ctx)
    }
    
    update() {
        this.state.update()
    }
}




const physics = new VerletPhysics()
const game = new Game()


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    game.update()
    requestAnimationFrame(animate)
}

animate()
keyboardEnabled()