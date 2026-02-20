class Timer {
    constructor(duration=10, speed=1) {
        this.enabled = false
        this.counter = 0
        this.speed = 1
        this.duration = duration
    }
    
    reset() {
        this.counter = 0
    }

    stop() {
        this.enabled = false
    }
    
    run() {
        if (this.enabled) {
            this.counter += this.speed        
        }

        if (this.counter >= this.duration) {
            this.reset()
            this.stop()
        }
    }

    update() {
        this.run()
    }
}