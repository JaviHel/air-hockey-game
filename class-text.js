class Text {
    constructor(x=0, y=0, txt="hello", txtColor="white", txtSize=20, txtFont="Arial", txtFontWeight="normal") {
        this.x = x
        this.y = y
        this.w = ctx.measureText(txt).width
        this.h = txtSize
        this.txt = txt
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.textLength = ctx.measureText(txt).width
        this.textBaseline = "middle"
        this.textAlign = "center"

        this.isVisible = true
    }

    setStyle(txtColor, txtSize, txtFont, txtFontWeight, txtBaseline, txtAlign) {
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.textBaseline = txtBaseline
        this.textAlign = txtAlign
    }

    draw(ctx) {
        ctx.fillStyle = this.txtColor
        ctx.font = `${this.txtFontWeight} ${this.txtSize}px ${this.txtFont}`
        ctx.textBaseline = this.textBaseline // Top, Bottom, Middle, Alphabetic, Hanging. 
        ctx.textAlign = this.textAlign // left, center, right, start, end.
        
        this.isVisible? ctx.fillText(this.txt, this.x, this.y): false;
    }
}