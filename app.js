/**
 *                                                         A forewarning: 
 *  This is my first JavaScript project, hence the code is not as clean or correctly commented as some of my Python projects
 *  However, if you are reading this, this is an active project and I am working on refactoring this code and adding features. 
 *  A todo list  can be seen in README.MD on my GitHub: https://github.com/tarnjotbains/chaos
 */


// Set Constants
const canvas = document.querySelector('canvas')
const audio = document.querySelector('audio')
const startAudioBtn = document.querySelector('#startAudioBtn')
const c = canvas.getContext('2d')
const modalEl = document.querySelector('#modalEl') 
const audioCtx = new AudioContext() 

const pauseBtn = document.querySelector('#pauseBtn')
pauseBtn.style.display = 'none' 

const playBtn = document.querySelector('#playBtn') 
playBtn.style.display = 'none'


// create an audio source 
const audioSource = audioCtx.createMediaElementSource(audio) 

// create an analyzer 
const analyzer = audioCtx.createAnalyser(); 

// connect source to analyzer and back to context destination
audioSource.connect(analyzer) 
audioSource.connect(audioCtx.destination) 

// to get frequencies
const frequencyData = new Uint8Array(analyzer.frequencyBinCount) 

// Set width and height of canvas 
canvas.width = innerWidth
canvas.height = innerHeight


class Point{
    constructor(x,y,z){
        this.x = x
        this.y = y 
        this.z = z
        this.radius = 0.1
        this.color = 1
        this.dt = 0.01
        this.a = 10.0
        this.b = 28.0
        this.c = 8.0 / 3.0

        this.trail = [] 
    }

    draw(){
        // First Displacement
        this.update() 
        c.beginPath()
        var x = Math.sin(this.x) * 100  + innerWidth/8
        var y = Math.cos(this.y) * 100 + innerHeight/8
        this.trail.push({x: x, y: y})
        c.arc(x, y, this.radius, 0, Math.PI*2, false) 
        c.fillStyle= `hsl(${this.color}, 50%, 50%)`
        c.fill()

        // Second Displacement 
        c.beginPath()
        x = (this.x)**2  + innerWidth/8 - 100
        y = (this.y)*this.x + innerHeight/8 - 100
        this.trail.push({x: x, y: y})
        c.arc(x, y, this.radius, 0, Math.PI*2, false) 
        c.fillStyle= `hsl(${this.color}, 50%, 50%)`
        c.fill()

        // Third Displacement
        c.beginPath()
        var x = Math.cos(this.x) * 100  + innerWidth/8
        var y = Math.sin(this.y) * 100 + innerHeight/8
        this.trail.push({x: x, y: y})
        c.arc(x, y, this.radius, 0, Math.PI*2, false) 
        c.fillStyle= `hsl(${this.color}, 50%, 50%)`
        c.fill()

        //Fourth Displacement
        c.beginPath()
        var x = Math.atan(this.x) * 100  + innerWidth/8
        var y = Math.sin(this.y) * 100 + innerHeight/8
        this.trail.push({x: x, y: y})
        c.arc(x, y, this.radius, 0, Math.PI*2, false) 
        c.fillStyle= `hsl(${this.color}, 50%, 50%)`
        c.fill()

        //Fifth Displacement
        c.beginPath()
        var x = Math.exp(this.x) * 100  + innerWidth/8
        var y = Math.sin(this.y) * 100 + innerHeight/8
        this.trail.push({x: x, y: y})
        c.arc(x, y, this.radius, 0, Math.PI*2, false) 
        c.fillStyle= `hsl(${this.color}, 50%, 50%)`
        c.fill()

        // Remove old trails 
        if (this.trail.length > 200){
            this.trail.splice(0,5) 
        }

        // Draw trails and lines
        this.trail.forEach((point, index) => {
            c.beginPath()
            c.arc(point.x, point.y, this.radius, 0, Math.PI*2, false) 
            c.fillStyle= `hsl(${this.color}, 50%, 50%)`
            c.fill()

            if (index -5 > 0){
            c.beginPath()
            c.moveTo(this.trail[index - 5].x, this.trail[index-5].y)
            c.lineTo(point.x, point.y)
            c.strokeStyle = `hsl(${this.color}, 50%, 50%)`
            c.lineWidth = 0.25;
            c.stroke() 

            c.beginPath()
            c.moveTo(this.trail[index - 1].x, this.trail[index-1].y)
            c.lineTo(point.x, point.y)
            c.strokeStyle = `hsl(${this.color}, 80%, 80%)`
            c.lineWidth = 0.1;
            c.stroke()

            c.beginPath()
            c.moveTo(this.trail[index - 2].x, this.trail[index-2].y)
            c.lineTo(point.x, point.y)
            c.strokeStyle = `hsl(${this.color}, 60%, 50%)`
            c.lineWidth = 0.1;
            c.stroke()

            c.beginPath()
            c.moveTo(this.trail[index - 3].x, this.trail[index-3].y)
            c.lineTo(point.x, point.y)
            c.strokeStyle = `hsl(${this.color}, 30%, 30%)`
            c.lineWidth = 0.1;
            c.stroke()

            c.beginPath()
            c.moveTo(this.trail[index - 4].x, this.trail[index-4].y)
            c.lineTo(point.x, point.y)
            c.strokeStyle = `hsl(${this.color}, 10%, 10%)`
            c.lineWidth = 0.1;
            c.stroke()
            }
        })

    }
    update(){
        // Set color
        if (this.color >359){
            this.color = 0
        } else{
            this.color += 1
        }

        // Update the displacement values based on the Lorenz system 
        const dx = (this.a * (this.y - this.x)) * this.dt
        const dy = (this.x * (this.b - this.z) - this.y) * this.dt
        const dz = (this.x * this.y - this.c * this.z) * this.dt 

        // Displace values 
        this.x = this.x + dx 
        this.y = this.y + dy
        this.z = this.z + dz 
    }
}

// initialize a point 
let point = new Point(0.01,0, 0) 
let first = true 

function animate(){

    // Set Background 
    c.fillStyle = 'rgba(0,0,0, 0.5)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Scale the canvas
    if (first){
        c.scale(4,4)
        first = false 
    }

    
    requestAnimationFrame(animate) 
    
    
    // Generate a list of frequency values
    analyzer.getByteFrequencyData(frequencyData) 

    // Get Sum of all frequencies
    var dt = frequencyData.reduce(function(a,b){
        return a + b; 
    }, 0)

    // Get average frequency 
    dt = dt / 1024

    // Set Logistic constants 
    const L = 0.008
    const k = 0.8
    const x0 = 12

    const sigmoid = L / (1 + Math.exp(-k * (dt - x0)))
    console.log(sigmoid)  

    // Draw points 
    point.dt = sigmoid 
    point.draw()
    console.log(point.trail.length) 
}

// Start animation iff user clicks an event. 
startAudioBtn.addEventListener('click', ()=> { 
    animate()
    pauseBtn.style.display = 'flex'
    modalEl.style.display = 'none'
    audioCtx.resume() 
    audio.play()
})

pauseBtn.addEventListener('click', () => {
    if (!audio.paused){
        audio.pause() 
        playBtn.style.display = 'flex'
        pauseBtn.style.display = 'none'
    }
} )

playBtn.addEventListener('click', () => {
    if (audio.paused){
        audio.play()
        playBtn.style.display = 'none' 
        pauseBtn.style.display = 'flex' 
    }
})


