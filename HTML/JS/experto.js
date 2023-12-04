// Función para cargar el nivel seleccionado
function cargarNivel(experto) {
    // Llama al archivo específico del nivel según el nombre proporcionado
    const nivelScript = document.createElement('script');
    nivelScript.src = `./${experto}.js`;
    document.body.appendChild(nivelScript);
}

const canvas = document.querySelector ('canvas')
canvas.width = 1080;
canvas.height = 549;
const ctx = /*ctx =  "context"*/canvas.getContext ('2d');

//Testeo
//ctx.fillRect(0, 0, canvas.width, canvas.height);

const soundPaddle = document.createElement ('audio')
const soundGoal = document.createElement ('audio')
const soundGame = document.createElement ('audio')
soundPaddle.src = '/Sounds/soundscrate-8-bit-failed-hit-1.mp3'
soundGoal.src = '/Sounds/soundscrate-videogamebundle-kick.mp3'
soundGame.src = '/Sounds/kirby-super-star-konami-vrc6.wav'



const score = {
    left: 0,
    right: 0,
    left1: "left win",
    right1: "right win",
}

//Bot del juego 

const getPaddle = ({x = 5, color = '#2980B9'}) => ({

    x: x,
    y: 4, //posicion de la paleta izq. = 225
    w: 15,
    h: 100,
    color: color,
    speed: 20,

    draw (){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    },
    moveUp(){ //Movimiento de las paletas (arriba)
        if(this.y < 10){return}
        this.y -= this.speed
    },
    moveDown(){ // (abajo)
        if(this.y > canvas.height - this.h - 10){return}
        this.y += this.speed
    },
    contains(b){
            return (this.x < b.x + b.w)&&
            (this.x + this.w > b.x)&&
            (this.y < b.y + b.h)&&
            (this.y + this.h > b.y)
        }
    })

const getBall = () => ({
    x: 540, //Posicion en X de la pelota
    y: 275, //Posicion en Y de la pelota
    w: 20,
    h: 20,
    color: 'black',
    directionX: 'right',
    directionY: 'up',
    friction: .8,
    speedX: 1,
    speedY: 1,
    isMoving:false,

    handleMovement (){
        if (!this.isMoving){return}
        //manejar movimiento de izq. a Derecha
        if(this.x < 0){ // 0 = 35, pixeles de colision en paleta izq.
            this.directionX = 'right'
        }else if (this.x > canvas.width - this.w ){//this.w = 35
            this.directionX = 'left'
        }
        if(this.directionX === 'right'){
            this.speedX ++
        }else {
            this.speedX --
        }
        this.speedX *= this.friction
        this.x += this.speedX
       
        //Manejar movimiento arriba y abajo
        if (this.y < 20 ){
            this.directionY = 'down'
        }else if (this.y > canvas.height - this.h){
            this.directionY = 'up'
        }
        if (this.directionY === 'down'){
            this.speedY ++
        }else {
            this.speedY --
        }
        this.speedY *= this.friction
        this.y += this.speedY
    },
    draw(){

        //Dibujamos la pelota
        this.handleMovement()
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
        ctx.fill();
        //ctx.fillRect(this.x, this.y, this.w, this.h)
    },
    
    
})

const paddleLeft = getPaddle({}) 
const paddleRight = getPaddle({
    x: canvas.width - 20,
    color: 'red'
})
const ball = getBall()

const update = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCourt () //dibuja la cancha
    drawScore () // dibuja el marcador 
    paddleLeft.draw() //dibuja la paleta izq. del juego
    //moveBot(); //Funcion que hace que se mueva el bot en base a la posicion de la bola 
    /*if (ball.directionX === 'left') {
        moveBot(); // Mover el bot solo cuando la pelota se acerca al bot
    }*/
    paddleRight.draw()
    ball.draw() //dibuja la pelota del juego
    checkCollitions () //Comprueba las colisiones en los paddles

    requestAnimationFrame(update)
}

//Aux functions (unicamente dibuja la cancha)
const drawCourt = () =>{
    ctx.strokeStyle = 'black' // lineas de la cancha
    ctx.lineWidth = 10; // grosor de la linea de la cancha
    ctx.strokeRect(0, 0, canvas.width, canvas.height) //posicion de la linea
    ctx.lineWidth = 5; //grosor de la linea central
    ctx.beginPath()
    ctx.moveTo (canvas.width/2, 0)
    ctx.lineTo (canvas.width/2, canvas.height)
    ctx.stroke ()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(canvas.width/2,canvas.height/2, 50, 0, Math.PI * 2, false)
    ctx.stroke ()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(canvas.width,canvas.height/2, 50, 0, Math.PI * 2, false)
    ctx.stroke ()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(0,canvas.height/2, 50, 0, Math.PI * 2, false)
    ctx.stroke ()
    ctx.closePath()
}

const checkCollitions = () => {
    if (paddleLeft.contains(ball)){
        ball.directionX = 'right'
        soundPaddle.play()
    }else if (paddleRight.contains(ball)) {
        ball.directionX = 'left'
        soundPaddle.play()
    }

    if (ball.x < 0){
        ball.x = 540
        ball.y = 275
        ball.isMoving = false
        score.right ++
        soundGoal.play()
        soundGame.pause()
    }else if (ball.x > canvas.width-ball.w){
        ball.x = 540
        ball.y = 275
        ball.isMoving = false
        score.left ++ 
        soundGoal.play()
        soundGame.pause()
    }  
}

const drawScore = () => {
    ctx.fillStyle = 'gray'
    ctx.font = '48px "Press Start 2P"'
    ctx.fillText(score.left,250, 70)
    ctx.fillText(score.right, 800, 70)
    ctx.fillStyle = 'cyan'
    if(score.right === 5){
        ctx.fillText(score.right1,600, 170)
    }else if (score.left === 5){
        ctx.fillText(score.left1,50, 170)
    }
}

//Listeners
addEventListener("keydown", e => {
    switch (e.keyCode){
    case 32:
        ball.isMoving = true
        soundGame.play()
        break;
    }

    // console.log(e.keyCode) muentra la tecla que se presiona
    switch(e.keyCode){
        case 38: //Flecha arriba
            paddleRight.moveUp()
            break;
        case 40: //Fleca de abajo
            paddleRight.moveDown()
            break;
        case 87: //Tecla "w"
            paddleLeft.moveUp()
            break;
         case 83: //Tecla "s"
            paddleLeft.moveDown()
            break;

    }
})

requestAnimationFrame(update)
