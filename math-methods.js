function radians(degrees) {
    return degrees*(Math.PI/180)
}

function sineInt(max, angle, freq=1, offset=0) {
    // returns a sine interpolation of numbers between 0 and max
    // the angle is used to interpolate dynamically
    // the freq is a scalar float to change the speed
    // offset moves the range of values maintaining the interpolation distance
    let sine = Math.floor(Math.sin(radians(angle*freq))*(max/2))+(max/2)
    return sine + offset
}


function sineFloat(max, angle, freq=1, offset=0) {
    // returns a sine interpolation of numbers between 0 and max
    // the angle is used to interpolate dynamically
    // the freq is a scalar float to change the speed
    // offset moves the range of values maintaining the interpolation distance
    let sine = (Math.sin(radians(angle*freq))*(max))+(max/2)
    return sine + offset
}


function toRad(degrees) {
    // Deg to RAd
    return degrees*(Math.PI/180)
}

function toDeg(radians) {
    // Rad to Deg
    return (radians*180)/Math.PI
}

