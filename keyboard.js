// KEYBOARD CONTROL
// W-A-S-D J-K-L
let [UP, DOWN, LEFT, RIGHT] = [false, false, false, false]
let [ACTION_J, ACTION_K, ACTION_L] = [false, false, false]

// ARROWS & NUMERIC KEYBOARD  1-2-3
let [ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT] = [false, false, false, false]
let [ACTION_1, ACTION_2, ACTION_3] = [false, false, false]

let START_BUTTON = false
let SPACE_BUTTON = false
let ANY_BUTTON = false

function keyDown(e) {
    // Player One
    if (e.key === "w" || e.key === "W") {
        UP = true
    } else if (e.key === "s" || e.key === "S") {
        DOWN = true
    } else if (e.key === "a" || e.key === "A") {
        LEFT = true
    } else if (e.key === "d" || e.key === "D") {
        RIGHT = true
    }

    if (e.key === "j" || e.key === "J" || e.key === " ") {
        ACTION_J = true
    } else if (e.key === "k" || e.key === "K") {
        ACTION_K = true
    } else if (e.key === "l" || e.key === "L") {
        ACTION_L = true
    }

    
    // Player Two
    if (e.key === "ArrowUp") {
        ARROW_UP = true
    } else if (e.key === "ArrowDown") {
        ARROW_DOWN = true
    } else if (e.key === "ArrowLeft") {
        ARROW_LEFT = true
    } else if (e.key === "ArrowRight") {
        ARROW_RIGHT = true
    }

    if (e.key === "1") {
        ACTION_1 = true
    } else if (e.key === "2") {
        ACTION_2 = true
    } else if (e.key === "3") {
        ACTION_3 = true
    }

    if (e.key === "Enter") {
        START_BUTTON = true
    }

    if (e.key === " ") {
        SPACE_BUTTON = true
    }

    ANY_BUTTON = true
}


function keyUp(e) {
    // Player One
    if (e.key === "w" || e.key === "W") {
        UP = false
    } else if (e.key === "s" || e.key === "S") {
        DOWN = false
    } else if (e.key === "a" || e.key === "A") {
        LEFT = false
    } else if (e.key === "d" || e.key === "D") {
        RIGHT = false
    }

    if (e.key === "j" || e.key === "J" || e.key === " ") {
        ACTION_J = false
    } else if (e.key === "k" || e.key === "K") {
        ACTION_K = false
    } else if (e.key === "l") {
        ACTION_L = false
    }

    // Player Two
    if (e.key === "ArrowUp") {
        ARROW_UP = false
    } else if (e.key === "ArrowDown") {
        ARROW_DOWN = false
    } else if (e.key === "ArrowLeft") {
        ARROW_LEFT = false
    } else if (e.key === "ArrowRight") {
        ARROW_RIGHT = false
    }

    if (e.key === "1") {
        ACTION_1 = false
    } else if (e.key === "2") {
        ACTION_2 = false
    } else if (e.key === "3") {
        ACTION_3 = false
    }

    if (e.key === "Enter") {
        START_BUTTON = false
    }

    if (e.key === " ") {
        SPACE_BUTTON = false
    }
    
    ANY_BUTTON = false
}


function keyboardEnabled(bool=true) {
    if (bool) {
        window.addEventListener("keydown", keyDown)
        window.addEventListener("keyup", keyUp)
    } else {
        window.removeEventListener("keydown", keyDown)
        window.removeEventListener("keyup", keyUp)
    }
}


function setKeysFalse() {
    UP = false
    DOWN = false
    LEFT = false
    RIGHT = false
    ACTION_J = false
    ACTION_K = false
    ACTION_L = false
        
    ARROW_UP = false
    ARROW_DOWN = false
    ARROW_LEFT = false
    ARROW_RIGHT = false
    ACTION_1 = false
    ACTION_2 = false
    ACTION_3 = false
    
    START_BUTTON = false
    SPACE_BUTTON = false
    ANY_BUTTON = false
}