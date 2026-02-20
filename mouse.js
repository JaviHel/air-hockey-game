// CONTROL MOUSE OPERATIONS


// MOUSE METHODS
let mx = 0
let my = 0
let mcx = 0
let mcy = 0
let clicked = false

function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


function mouseClick(e) {
    mcx = e.offsetX 
    mcy = e.offsetY
    clicked = true
}


function mouseEnabled(bool=true) {
    if (bool) {
        canvas.addEventListener("mousemove", mousePos)
        canvas.addEventListener("mousedown", mouseClick)
    } else {
        canvas.removeEventListener("mousemove", mousePos)
        canvas.removeEventListener("mousedown", mouseClick)
    }
}









