class States {
    constructor(game) {
        this.game = game
        this.init()
    }
}




class MainScreen extends States {
    init() {
        this.physics = new VerletPhysics()
        
        let paddleRadius = TABLE_SIZE*0.1
        this.paddles = {top:new PaddleCPU(CCX,paddleRadius*1.5,paddleRadius), 
                        bottom:new PaddleCPU(CCX, canvas.height-paddleRadius*1.5, paddleRadius),
                        left:new PaddleCPU(paddleRadius*1.5, CCY, paddleRadius), 
                        right:new PaddleCPU(canvas.width-paddleRadius*1.5, CCY, paddleRadius),
        }      
        
        let ballRadius = TABLE_SIZE*0.06
        this.ball = new BallCPU(CCX, CCY, ballRadius)
        this.setStyle()

        this.lineSpeed = 0.5
        this.linesHorizontal = []
        this.linesVertical = []
        this.createLines(20)
        
        // Main Label
        this.label = new Text(CCX, CCY, "PRESS ANY BUTTON", "white", 25, "monospace", "bolder")
        

        this.options = [
            new Text(0, 0, "1 PLAYER GAME", this.ball.fillColor),
            new Text(0, 0, "2 PLAYERS GAME", this.ball.fillColor),
            new Text(0, 0, "OPTIONS", this.ball.fillColor),
        ]

        createColumn(this.options, CCX, CCY-this.options[0].txtSize*1.5, 10)
        

        /*
        PRESS ANY BUTTON = 0
        START-GAME/OPTIONS = 1
        OPTIONS = 2
        */
        this.menuDepthIndex = 0

        /*
        START-GAME = 0
        OPTIONS = 1
        */
        this.menuIndexY = 0

        this.hoverTextColor = "white"
        this.hoverTextSize = (this.options[0].txtSize)+5
        
    }

    emptyArrays() {
        for (let key in this.paddles) {
            let paddle = this.paddles[key]
            this.physics.removeEffect(paddle.fx)
            this.physics.removeParticle(paddle)
        }
        this.linesHorizontal = []
        this.linesVertical = []

    }
    
    createLines(n=1) {
        let col = parseInt(SIZE/n)
        
        for (let i = 0; i < n; i++) {
            var x1 = i*col
            var y1 = 0
            var x2 = i*col
            var y2 = SIZE
            
            var line = new Line(x1, y1, x2, y2)
            line.lineWidth = 1
            line.strokeColor = this.ball.fillColor
            this.linesHorizontal.push(line)

            var x1 = 0
            var y1 = i*col
            var x2 = 300
            var y2 = i*col
            
            var line = new Line(x1, y1, x2, y2)
            line.lineWidth = 1
            line.strokeColor = this.ball.fillColor
            this.linesVertical.push(line)
        }
    }

    setStyle() {
        // let rndmColor = randChoice(THEMES)["ball"]
        let rndmColor = this.game.table.strokeColor
        
        for (let key in this.paddles) {
            let paddle = this.paddles[key] 
            paddle.fillColor = rndmColor
            paddle.strokeColor = rndmColor
            this.physics.addParticle(paddle)

            
            paddle.fx = new AttractionEffect(paddle, paddle.radius, randChoice([-5,-6])) 
            this.physics.addEffect(paddle.fx)
        }

        this.ball.acc = new Vector(randChoice([-2,-4,-8, 2,4,8]), randChoice([-2,-4,8, 2,4,8]))
        this.ball.fillColor = rndmColor
        this.physics.addParticle(this.ball)
    }

    paddleMove() {
        this.paddles.top.pos.x = this.ball.pos.x-2
        this.paddles.bottom.pos.x = this.ball.pos.x+2
        this.paddles.left.pos.y = this.ball.pos.y-2
        this.paddles.right.pos.y = this.ball.pos.y+2
    }

    lineMoveHor(ln) {
        ln.x1 = this.lineSpeed + (ln.x1%SIZE)
        ln.x2 = this.lineSpeed + (ln.x2%SIZE)
    }

    lineMoveVer(ln) {
        ln.y1 = this.lineSpeed + (ln.y1%SIZE)
        ln.y2 = this.lineSpeed + (ln.y2%SIZE)
    }

    goTo() {
        // PRESS ANY BUTTON SCREEN
        if (this.menuDepthIndex == 0 && ANY_BUTTON) {
            setKeysFalse()
            this.label.isVisible = false
            this.menuDepthIndex = 1
        }

        // MAIN OPTIONS MENU
        if (this.menuDepthIndex == 1) {
            
            if (UP && this.menuIndexY > 0) {
                this.menuIndexY -= 1
            }
            
            if (DOWN && this.menuIndexY < this.options.length-1) {
                this.menuIndexY += 1
            }

            // GO TO 1P GAME
            if (this.menuIndexY == 0 && START_BUTTON) {
                this.emptyArrays()
                Game.joystickEnabled = true
                Game.controller2P = false
                Game.freeRoamEnabled = false
                this.game.setState("StartGame")
            }
            
            // GO TO START GAME - 2P GAME
            if (this.menuIndexY == 1 && START_BUTTON) {
                this.emptyArrays()
                Game.joystickEnabled = true
                Game.controller2P = true
                this.game.setState("StartGame")
            }            

            // GO TO OPTIONS
            if (this.menuIndexY == 2 && START_BUTTON) {
                this.emptyArrays()
                this.game.getState("Options").menuIndexY = 0
                this.game.setState("Options")
            }

            
        }       

        setKeysFalse()
        
    }
    
    update() {
        this.goTo()
        this.linesHorizontal.forEach(line=>{ line.draw(ctx); this.lineMoveHor(line) })
        this.linesVertical.forEach(line=>{ line.draw(ctx); this.lineMoveVer(line) })
        this.label.txtColor = this.ball.fillColor
        this.label.draw(ctx)
        this.ball.draw(ctx)
       
        for (let key in this.paddles) {
            let paddle = this.paddles[key]
            paddle.draw(ctx)
        }

        if (this.menuDepthIndex == 1) {
            this.options.forEach((opt, i)=>{
                
                if (this.menuIndexY == i) {
                    opt.txtColor = this.hoverTextColor
                    opt.txtFontWeight = "bolder"
                } else {
                    opt.txtColor = this.ball.fillColor
                    opt.txtFontWeight = ""
                }
                
                opt.draw(ctx)
            })
        }
        
        this.physics.rectBounce(0, 0, canvas.width, canvas.height, this.ball.radius)
        this.physics.update()
        this.paddleMove()

    }
}




class Options extends States {
    init() {
        this.container = new Rect(0, 0, 250, 250, 20)
        this.container.x = CCX - this.container.w/2
        this.container.y = CCY - this.container.h/2
        // this.container.fillColor = this.game.table.fillColor

        this.textSize = 40
        this.optionsTextSize = this.textSize*0.35
        this.colSpacing = 10
        
        this.label = new Text(CCY, this.container.y, "--OPTIONS--")
        this.label.setStyle(this.game.table.strokeColor, this.textSize, "monospace", "bold", "top", "center")

        this.hoverTextColor = "white"
        this.hoverTextSize = this.optionsTextSize+4

        // SCROLL MENU INDEX
        this.menuIndexY = 0
        
        // Right Column Options Toggle
        this.levelIndex = 1
        this.levelToggle = ["EASY", "NORMAL", "HARD"]

        this.matchPointsIndex = 3
        this.matchPointsToggle = ["1", "3", "5", "10", "15", "20"]
        
        this.tableGrassIndex = 0
        this.tableGrassToggle = ["DISABLED", "ENABLED"]

        this.freeRoamIndex = 0
        this.freeRoamToggle = ["DISABLED", "ENABLED"]

        
        this.sfxIndex = 0
        this.sfxToggle = ["DISABLED", "ENABLED"]

        this.themeIndex = this.game.theme.index
        this.themesToggle = THEMES_NAMES

        
        this.leftColOptions = [
            new Text(0, 0, "LEVEL-CPU", "red"),
            new Text(0, 0, "MATCH-POINTS", "red"),
            new Text(0, 0, "TABLE-GRASS", "red"),
            new Text(0, 0, "FREEROAM", "red"),
            
            new Text(0, 0, "SFX", "red"),
            new Text(0, 0, "THEME", "red"),

            new Text(0, 0, "EXIT", "red"),
        ]

        var pos = {x:15, y:5,}
        createColumn(this.leftColOptions, this.container.x+pos.x, this.container.y+this.textSize+pos.y, this.colSpacing)

        
        this.rightColOptions = [
            new Text(0, 0, this.levelToggle[this.levelIndex], "red"), // LEVEL
            new Text(0, 0, this.matchPointsToggle[this.matchPointsIndex], "red"), // MATCH POINTS
            new Text(0, 0, this.tableGrassToggle[this.tableGrassIndex], "red"), // TABLE GRASS
            new Text(0, 0, this.freeRoamToggle[this.freeRoamIndex], "red"), // FREEROAM
           
            new Text(0, 0, this.sfxToggle[this.sfxIndex], "red"), // SFX
            new Text(0, 0, this.themesToggle[this.themeIndex], "red"), // THEME
        ]

        var pos = {x:-50, y:5,}
        createColumn(this.rightColOptions, this.container.x+this.container.w+pos.x, this.container.y+this.textSize+pos.y, this.colSpacing)
        
    }

    goTo() {
        if (this.menuIndexY > 0 && UP) {
            UP = false
            this.menuIndexY -= 1
        }
        
        if (this.menuIndexY < this.leftColOptions.length-1 && DOWN) {
            DOWN = false
            this.menuIndexY += 1
        }


        // SCROLL THROUGH OPTIONS
        // LEVEL TOGGLE
        if (this.menuIndexY == 0) {
            if (this.levelIndex > 0 && LEFT) {
                setKeysFalse()
                this.levelIndex -= 1
            }
            if (this.levelIndex < this.levelToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.levelIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.levelToggle[this.levelIndex]
        }
        
        // MATCH POINTS TOGGLE
        if (this.menuIndexY == 1) {
            if (this.matchPointsIndex > 0 && LEFT) {
                setKeysFalse()
                this.matchPointsIndex -= 1
            }
            if (this.matchPointsIndex < this.matchPointsToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.matchPointsIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.matchPointsToggle[this.matchPointsIndex]
        }
        
        // TABLE GRASS TOGGLE
        if (this.menuIndexY == 2) {
            if (this.tableGrassIndex > 0 && LEFT) {
                setKeysFalse()
                this.tableGrassIndex -= 1
            }
            if (this.tableGrassIndex < this.tableGrassToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.tableGrassIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.tableGrassToggle[this.tableGrassIndex]
        }

        // FREEROAM TOGGLE
        if (this.menuIndexY == 3) {
            if (this.freeRoamIndex > 0 && LEFT) {
                setKeysFalse()
                this.freeRoamIndex -= 1
            }
            if (this.freeRoamIndex < this.freeRoamToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.freeRoamIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.freeRoamToggle[this.freeRoamIndex]
        }

        // SFX TOGGLE
        if (this.menuIndexY == 4) {
            if (this.sfxIndex > 0 && LEFT) {
                setKeysFalse()
                this.sfxIndex -= 1
            }
            if (this.sfxIndex < this.sfxToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.sfxIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.sfxToggle[this.sfxIndex]
            
        }

        // THEMES TOGGLE
        if (this.menuIndexY == 5) {
            if (this.themeIndex > 0 && LEFT) {
                setKeysFalse()
                this.themeIndex -= 1
            }
            if (this.themeIndex < this.themesToggle.length-1 && RIGHT) {
                setKeysFalse()
                this.themeIndex += 1
            }
            
            this.rightColOptions[this.menuIndexY].txt = this.themesToggle[this.themeIndex]
        }


        // STORE REAL CHANGES
        Game.difficulty = this.levelToggle[this.levelIndex]
        this.game.cpu.setDifficulty(Game.difficulty)
        Game.scoreToWin = parseInt(this.matchPointsToggle[this.matchPointsIndex])
        Game.tableWithGrass = textToBool(this.tableGrassToggle[this.tableGrassIndex])
        Game.freeRoamEnabled = textToBool(this.freeRoamToggle[this.freeRoamIndex])
        SoundFX.enabled = textToBool(this.sfxToggle[this.sfxIndex])
        this.setTheme(this.themeIndex)
        
        // Return to MainScreen
        if (this.menuIndexY == this.leftColOptions.length-1 && START_BUTTON) {
            setKeysFalse()
            this.game.getState("MainScreen").init()
            this.game.setState("MainScreen")
        }

    }

    setTheme(n) {
        this.themeIndex = n
        this.rightColOptions[this.rightColOptions.length-1].txt = this.themesToggle[this.themeIndex]
        this.game.gameTheme.pickTheme(n)
    }

    update() {
        this.goTo()
        this.container.draw(ctx)
        this.label.txtColor = this.game.table.strokeColor
        this.label.draw(ctx)

        this.leftColOptions.forEach((option, i)=>{
            option.setStyle(this.game.table.strokeColor, this.optionsTextSize, "monospace", "italic", "top", "left")

            // HOVER
            if (this.menuIndexY == i) {
                option.txtColor = this.hoverTextColor
                option.txtSize = this.hoverTextSize
            } else {
                option.setStyle(this.game.table.strokeColor, this.optionsTextSize, "monospace", "italic", "top", "left")
            }

            // Center the EXIT text
            if (this.leftColOptions.length-1 == i) {
                option.textAlign = "center"
                option.x = CCX
            }
            option.draw(ctx)
        })

        this.rightColOptions.forEach((option, i)=>{
            option.setStyle(this.game.table.strokeColor, this.optionsTextSize, "monospace", "italic", "top", "center")

            // HOVER
            if (this.menuIndexY == i) {
                option.txtColor = this.hoverTextColor
                option.txtSize = this.hoverTextSize
            } else {
                option.setStyle(this.game.table.strokeColor, this.optionsTextSize, "monospace", "italic", "top", "center")
            }
            
            option.draw(ctx)
        })
    }
}



// START-GAME = TWO-PLAYERS or VS-MODE
class StartGame extends States {
    init() {
        this.label = new Text(CCX, CCY, "", this.game.table.strokeColor, 30, "monospace", "bolder")
        this.startGameplay = false
        this.timer = 0
        this.duration = 120

        // For Countdown Animation
        this.animationText = ["3", "2", "1"]
        this.fps = parseInt(this.duration/(this.animationText.length))
        this.index = 0

        // For Displaying GO!
        this.goText = "GO!"
        this.newTimerEnabled = false
        this.newDuration = this.fps

        // For Blackout Screen
        this.rectBlackout = new Rect(0, 0, canvas.width, canvas.height)
        this.rectBlackout.fillColor = "rgba(0,0,0, 0.35)"

    }

    goTo() {
        if (START_BUTTON && this.startGameplay) {
            START_BUTTON = false
            this.game.setState("PauseGame")
        }
    }

    checkWinner() {
        if (Alert.playerBottomWins) {
            Game.WINNER = "P1"
            this.game.setState("GameOver")
        } else if (Alert.playerTopWins) {
            Game.WINNER = "P2"
            this.game.setState("GameOver")
        }
    }

    animationTimer() {
        // Countdown Timer
        if (!this.startGameplay) {
            this.timer += 1
        }

        if (!this.startGameplay && this.timer >= this.duration) {
            this.timer = 0
            this.startGameplay = true
            this.newTimerEnabled = true
        }

        // Display Go Timer
        if (this.newTimerEnabled && this.startGameplay) {
            this.timer += 1
        }

        if (this.newTimerEnabled && this.timer >= this.newDuration) {
            this.timer = 0
            this.newTimerEnabled = false
        }
    }

    displayCountdown() {
        if (this.timer >= this.fps) {
            this.index += 1
            this.fps += this.fps
        }

        if (!this.startGameplay) {
            this.label.txt = this.animationText[this.index]
            this.label.txtSize = 80
            this.label.txtColor = this.game.table.strokeColor
            this.label.draw(ctx)
        }
    }

    displayText() {
        // Display GO! text
        if (this.newTimerEnabled) {
            this.label.txt = "GO!"
            this.label.txtSize = 60
            this.label.txtColor = this.game.ball.fillColor
            this.label.draw(ctx)
        }
    }
    
    update() {
        this.goTo()
        this.animationTimer()
        this.game.bgAnimation.enabled = true
        this.game.bgAnimation.update()
        this.game.draw(ctx)
        this.game.score.draw(ctx)
        
        if (this.startGameplay) {
            !Game.freeRoamEnabled? this.game.paddleMiddleTableBound():false;
            !Game.controller2P? this.game.cpu.update():false;
            this.game.joystickUpdate()

            this.game.ballTeleport()
            this.game.ballTableBounds()
            this.game.paddleTableBounds()
            this.game.checkGoal()
            this.game.score.update()
            this.checkWinner()
            
            this.game.vfx.update()
            this.game.sfx.update()
            
            
            setAlertsFalse() // Always Here, otherwise it doesnt work
            physics.update() // Starts the animation movement

            this.displayText()
            
        } else {
            this.rectBlackout.draw(ctx)
            this.displayCountdown()
        }
        
    }
}




class PauseGame extends States {
    init() {
        this.text = "P A U S E"
        this.label = new Text(CCX, CCY+2, this.text, this.game.ball.fillColor, 30, "monospace", "italic "+"bolder")
        this.rectBlackout = new Rect(0, 0, canvas.width, canvas.height)
        this.rectBlackout.fillColor = "rgba(0,0,0, 0.35)"
    }

    goTo() {
        if (START_BUTTON) {
            START_BUTTON = false
            this.game.setState("StartGame")
        }
    }

    update() {
        this.goTo()
        this.game.bgAnimation.enabled = false
        this.game.bgAnimation.update()
        this.game.draw(ctx)
        this.game.score.draw(ctx)
        this.game.vfx.update()
        this.game.sfx.update()
        this.game.score.update()
        this.rectBlackout.draw(ctx)
        this.label.txtColor = this.game.ball.fillColor
        this.label.draw(ctx)
        setAlertsFalse()
    }
}





class GameOver extends States {
    init() {
        this.text = " "
        this.labelWinner = new Text(CCX, CCY+2, this.text, this.game.ball.fillColor, 40, "monospace", "bolder")
        this.labelLoser = new Text(CCX, CCY+2, this.text, this.game.ball.fillColor, 40, "monospace", "bolder")

        this.rectBlackout = new Rect(0, 0, canvas.width, canvas.height)
        this.rectBlackout.fillColor = "rgba(0,0,0, 0.38)"
        this.rectBlackout.strokeColor = "rgba(0,0,0, 0.38)"
    }

    goTo() {
        // Return To MainScreen
        if (START_BUTTON) {
            START_BUTTON = false
            this.game.getState("StartGame").init()
            this.game.reset()
            this.game.getState("MainScreen").init()
            this.game.setState("MainScreen")
            
        }

        // Restart a New Match
        if (SPACE_BUTTON) {
            SPACE_BUTTON = false
            this.game.getState("StartGame").init()
            this.game.reset()
            this.game.setState("StartGame")
        }
    }

    checkWinner() {
        if (Game.WINNER == "P1") {
            this.labelWinner.x = this.game.table.cx
            this.labelWinner.y = this.game.table.cy*1.3
            this.labelWinner.txtColor = this.game.playerBot.strokeColor
            this.labelWinner.txtSize = 38
            this.labelWinner.txt = "WINNER"

            this.labelLoser.x = this.game.table.cx
            this.labelLoser.y = this.game.table.cy*0.75
            this.labelLoser.txtColor = this.game.playerTop.strokeColor
            this.labelLoser.txtSize = 25
            this.labelLoser.txt = "L O S E R"

            let offsetY = -25
            let offsetW = 25
            this.rectBlackout.setInit(this.game.table.x, this.game.table.y+offsetY,this.game.table.w, this.game.table.h*0.5+offsetW,this.game.table.borderRadius, this.game.table.lineWidth)
        } 

        if (Game.WINNER == "P2") {
            this.labelWinner.x = this.game.table.cx
            this.labelWinner.y = this.game.table.cy*0.75
            this.labelWinner.txtColor = this.game.playerTop.strokeColor
            this.labelWinner.txtSize = 38
            this.labelWinner.txt = "WINNER"

            this.labelLoser.x = this.game.table.cx
            this.labelLoser.y = this.game.table.cy*1.3
            this.labelLoser.txtColor = this.game.playerBot.strokeColor
            this.labelLoser.txtSize = 25
            this.labelLoser.txt = "L O S E R"

            // Blackout Loser
            let offsetY = 0
            let offsetW = 25
            this.rectBlackout.setInit(this.game.table.x, this.game.table.cy+offsetY,this.game.table.w, this.game.table.h*0.5+offsetW,this.game.table.borderRadius, this.game.table.lineWidth)
        }
    }
    
    update() {
        this.goTo()
        this.checkWinner()
        this.game.bgAnimation.enabled = true
        this.game.bgAnimation.update()
        this.game.draw(ctx)
        this.game.score.draw(ctx)
        
        this.game.vfx.update()
        this.game.sfx.update()
        
        this.labelLoser.draw(ctx)
        this.rectBlackout.draw(ctx)
        this.labelWinner.draw(ctx)
        setAlertsFalse()
    }
}

