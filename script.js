const canvas = document.getElementById("canvas-fg")
const ctx = canvas.getContext("2d")

canvas.addEventListener("contextmenu", (e)=>{
    e.preventDefault()
})

const SCALE = 1.5
const SIZE = 300
canvas.style.backgroundColor = "black"

// Resolution
canvas.width = SIZE
canvas.height = SIZE

// Scaled Size
canvas.style.width = (canvas.width*SCALE) + "px"
canvas.style.height = (canvas.height*SCALE) + "px"

const canvasCenterX = Math.floor(canvas.width/2)
const canvasCenterY = Math.floor(canvas.height/2)
const CCX = canvasCenterX
const CCY = canvasCenterY

ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = "low"

function printScreen(text="hello", color="white", x=CCX, y=10) {
    text = `${text}`
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, x, y)
}


