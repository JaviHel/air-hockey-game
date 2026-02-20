// ALERT EVENTS
// It behaves as buttons with boolean values
// You have global access to each event

let Alert = {
    ballCollideNodes: false,
 
    ballCollideWalls: false,
    ballCollideTop: false,
    ballCollideBottom: false,
    ballCollideLeft: false,
    ballCollideRight: false,
    
    playerCollideWalls: false,
    playerCollideBall: false,
    playerTopCollideBall: false,
    playerBottomCollideBall: false,
    playerSuperHit: false,
    
    playerTopScored: false,
    playerBottomScored: false,

    playerTopCollideMiddleArea: false,
    playerBotCollideMiddleArea: false,

    playerTopWins: false,
    playerBottomWins: false,
}


function setAlertsFalse(bool=false) {
    for (let key in Alert) {
        if (Alert[key] === true) {
            Alert[key] = bool
        }
    }
}





/*
Im not very happy with this implementation 
but is better than before... Well for now!

It should be a class
*/