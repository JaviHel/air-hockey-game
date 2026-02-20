// CLASS TO GET RANDOM NUMBERS

function randColor() {
    let digits = '0123456789ABCDEF';
    let colorHex = '#';
    
    for (let i = 0; i < 6; i++) {
        let randIndex = Math.floor(Math.random() * digits.length);
        colorHex += digits[randIndex];
    }
    return colorHex
}


function randRange(n) {
    return Math.floor(Math.random()*n)
}


function randInt(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min
}


function randChoice(array) {
    let randIndex = Math.floor(Math.random()*array.length)
    return array[randIndex]
}


function randPer(percentage) {
    let num = randInt(0, 1000)

    if (num < percentage) {
        return true
    }

    return false
}