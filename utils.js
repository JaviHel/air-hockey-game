function createColumn(array, x=0, y=0, spacing=0) {
    // Sets the position of any objext with (x,y,w,h) inside the array as a column
    for (let i = 0; i < array.length; i++) {
        array[i].x = x
        array[i].y = i*(array[i].h+spacing)+y
    }
}


function textToBool(txt) {
    // Returns boolean from an "ENABLED/DISABLED" text
    let bool = {enabled:true, disabled:false,}
    return bool[txt.toLowerCase()]
}