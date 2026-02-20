let neonDuel = {
    bg1:"hsl(223deg, 40% ,7%)",
    bg2:"hsl(223deg, 80% ,20%)",
    p1:"hsl(150deg, 100%, 50%)",
    p2:"hsl(300deg, 100%, 50%)",
    ball:"hsl(176deg, 100%, 50%)",
    goal:"hsl(340deg, 100%, 50%)",
    text:"hsl(0deg, 0% 1,00%)",
}

let cyberGold = {
        bg1:"hsl(24deg, 100%, 5%)",
        bg2:"hsl(43deg, 50% ,25%)",
        p1:"hsl(42deg, 100%, 50%)",
        p2:"hsl(350deg, 100%, 50%)",
        ball:"hsl(24deg, 100%, 50%)",
        goal:"hsl(43deg, 100%, 81%)",
        text:"hsl(43deg, 100%, 81%)",
}


let neoVectorGreen = {
    bg1:"hsl(120deg, 100%, 20%)",
    bg2:"hsl(120deg, 50%, 25%)",
    p1:"hsl(144deg, 100%, 50%)",
    p2:"hsl(144deg, 100%, 50%)",
    ball:"hsl(160deg, 100%, 50%)",
    goal:"hsl(156deg, 100%, 50%)",
    text:"hsl(156deg, 100%, 50%)",
}

let magentaStorm = {
        bg1:"hsl(300deg, 100%, 25%)",
        bg2:"hsl(300deg, 50%, 25%)",
        p1:"hsl(315deg, 100%, 60%)",
        p2:"hsl(323deg, 80%, 50%)",
        ball:"hsl(300deg, 100%, 70%)",
        goal:"hsl(300deg, 100%, 80%)",
        text:"hsl(0deg, 0%, 100%)",
}

let blueChrome = {
        bg1:"#002b55",
        bg2:"#000000",
        p1:"#0077ff",
        p2:"#0066dd",
        ball:"#00bbff",
        goal:"#66ccff",
        text:"#ffffff",
}

let neoGreen = {
        bg1:"#3e8a1e",
        bg2:"#3e700d",
        p1:"#6ee62f",
        p2:"#6ee62f",
        ball:"#7cff33",
        goal:"#4fa645",
        text:"#ffffff",
}

let cryoBlue = {
        bg1:"#06121c",
        bg2:"#1e7ab3",
        p1:"#7cd8ff",
        p2:"#7cd8ff",
        ball:"#a8f1ff",
        goal:"#27a7d8",
        text:"#ffffff",
}

let THEMES = [neoVectorGreen, neonDuel, cyberGold, magentaStorm, blueChrome,
              neoGreen, cryoBlue]

let THEMES_NAMES = ["vectorGreen", "neonDuel", "cyberGold", "magentaStorm", "blueChrome",
              "neoGreen", "cryoBlue"]



// Class To Style The Game Objects

class GameTheme {
    constructor(game) {
        this.game = game
    }

    pickRandomTheme() {
        let n = randInt(0, THEMES.length-1)
        let theme = THEMES[n]
        let bg = randChoice(["bg1", "bg2"])
        this.game.table.setColor(theme[bg], theme["goal"])
        this.game.playerTop.setColor(theme["p2"], theme["p2"])
        this.game.playerBot.setColor(theme["p1"], theme["p1"])
        this.game.ball.setColor(theme["ball"], "")
        this.game.topGoal.setColor(theme[bg], theme["goal"])
        this.game.bottomGoal.setColor(theme[bg], theme["goal"])
        this.game.score.txtP1.txtColor = theme["p1"]
        this.game.score.txtP2.txtColor = theme["p2"]

        return {name: THEMES_NAMES[n], index: n,}
    }

    pickTheme(n) {
        let theme = THEMES[n%THEMES.length]
        let bg = randChoice(["bg1", "bg2"])
        this.game.table.setColor(theme[bg], theme["goal"])
        this.game.playerTop.setColor(theme["p2"], theme["p2"])
        this.game.playerBot.setColor(theme["p1"], theme["p1"])
        this.game.ball.setColor(theme["ball"], "")
        this.game.topGoal.setColor(theme[bg], theme["goal"])
        this.game.bottomGoal.setColor(theme[bg], theme["goal"])
        this.game.score.txtP1.txtColor = theme["p1"]
        this.game.score.txtP2.txtColor = theme["p2"]
    }
}


