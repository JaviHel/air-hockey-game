class Score {
    constructor(game) {
        this.game = game
        let offsetX = 5
        let offsetY = 15
        let txtP1Pos = [this.game.table.cx, this.game.table.y+this.game.table.h+offsetY+5]
        let txtP2Pos = [this.game.table.cx, this.game.table.y-offsetY]
        let txtP1Color = this.game.playerBot.defaultFill
        let txtP2Color = this.game.playerTop.defaultFill
        let txtSize = this.game.table.size*0.22
        this.scoreP1 = 0
        this.scoreP2 = 0
        this.txtP1 = new Text(...txtP1Pos, `${this.scoreP1}`, txtP1Color, txtSize, "monospace ", "italic "+"bolder")
        this.txtP1.textBaseline = "middle"
        this.txtP1.textAlign = "center"
        
        this.txtP2 = new Text(...txtP2Pos, `${this.scoreP2}`, txtP2Color, txtSize, "monospace ", "italic "+"bolder")
        this.txtP2.textBaseline = "middle"
        this.txtP2.textAlign = "center"

    }
    
    reset() {
        this.scoreP1 = 0
        this.scoreP2 = 0
        this.txtP1.txt = `${this.scoreP1}`
        this.txtP2.txt = `${this.scoreP2}`
    }
    
    scoreCounter() {
        if (Alert.playerBottomScored) {
            this.scoreP1 += 1
            this.txtP1.txt = `${this.scoreP1}`
        }
        
        if (Alert.playerTopScored) {
            this.scoreP2 += 1
            this.txtP2.txt = `${this.scoreP2}`
        }
    }

    checkScore() {
        if (this.scoreP1 >= Game.scoreToWin) {
            Alert.playerBottomWins = true
        }

        if (this.scoreP2 >= Game.scoreToWin) {
            Alert.playerTopWins = true
        }
    }
       
    draw(ctx) {
        this.txtP1.draw(ctx)
        this.txtP2.draw(ctx)
    }

    update() {
        this.checkScore()
        this.scoreCounter()
    }
}
