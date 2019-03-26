const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);

//clears filled rows
function arenaSweep(){
    let rowCounter = 1;
    outer: for(let y = arena.length-1; y > 0; --y){
        for(let x =0; x<arena.length; ++x){
            if(arena[y][x]===0){
                continue outer;
            }
        }
        const row = arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score +=rowCounter*10;
        rowCounter *= 2;
        decreaseDropInterval(player);
    }
}


//checks for collisions between objects and walls
function collide(arena, player){
    //tuple assignment
    const[m,o] = [player.matrix, player.pos];
    for(let y =0; y < m.length; ++y){
        for(let x =0; x < m[y].length; ++x){
            if (m[y][x]!==0){
                if(!arena[y + o.y])
                    return true;
                else if(arena[y + o.y][x + o.x] !== 0)
                    return true;
            }
        }
    }
    return false;
}

//creates logical representation of the canvas
function createMatrix(w,h){
    const matrix = [];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

//generate shape
function createPiece(type){
    if(type == 'T'){
        return[
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
    }
    else if(type == 'O'){
        return[
            [2,2],
            [2,2]
        ]
    }
    else if(type == 'L'){
        return[
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ]
    }
    else if(type == 'J'){
        return[
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ]
    }
    else if(type == 'I'){
        return[
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ]
    }
    else if(type == 'S'){
        return[
            [0,6,6],
            [6,6,0],
            [0,0,0]
        ]
    }
    else if(type == 'Z'){
        return[
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ]
    }
}


//
function draw(){
    context.fillStyle = '#000';
    context.fillRect(0,0, canvas.width, canvas.height);


    drawMatrix(arena, {x: 0, y: 0})
    drawMatrix(player.matrix, player.pos);
}

//fills shape
function drawMatrix(matrix, offset){
matrix.forEach((row,y)=>{
    row.forEach((value, x) =>
    {
        if (value!==0){
            context.fillStyle = colors[value];
            context.fillRect(x + offset.x,
                            y + offset.y,
                            1,1);
        }
    });
});
}

//log the shapes position 
function merge(arena, player){
    player.matrix.forEach((row,y)=> {
        row.forEach((value, x)=>
        {
            if(value !==0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}


//drops the shape down by a step
function playerDrop(){
    player.pos.y++;
    if(collide(arena,player)) {
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
    dropInterval = 1000;
}

//resets shape type and redeploys it
function playerReset(){
    const pieces = 'ILJOTSZ';
    let piece = pieces[pieces.length * Math.random() | 0];
    player.matrix=createPiece(piece);
    player.pos.y = 0;
    player.pos.x = (arena[0].length/2 | 0) - (player.matrix[0].length/2 | 0);
    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score=0;
        updateScore();
    }
}

//rotates shape accounting for the collisions
function playerRotate(dir){
    const pos = player.pos.x;
    let offset =1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x +=offset;
        offset = -(offset+(offset > 0 ? 1 : -1));
        if(offset>player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

//rotates shape
function rotate(matrix, dir){
    for (var row = 0; row < matrix.length; row++) {
        for (var col = 0; col < row; col++) {
          const temp = matrix[row][col];
          matrix[row][col] = matrix[col][row];
          matrix[col][row] = temp;
        }
      }
    if(dir>0){
        matrix.forEach(row => row.reverse());
    }else{
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000

//increases difficulty
function decreaseDropInterval(player){
    dropInterval -= player.score*2;
}


//move shape
function playerMove(dir){
    player.pos.x += dir;
    if(collide(arena,player)){
        player.pos.x -= dir;
    }
}

//updates the board
let lastTime = 0;
function update(time = 0){
    const deltaTime = time-lastTime;
    lastTime = time;
    
    dropCounter +=deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

//updates scoreboard
function updateScore(){
    document.getElementById('score').innerText = player.score;
}

//color map
const colors = [
    null,
    'purple',
    'yellow',
    'orange',
    'blue',
    'aqua',
    'green',
    'red'
];

//cavas matrix
const arena = createMatrix(12,20);

//spawn shape/player
const player = {
    pos: {x:0, y:0},
    matrix: null,
    score: 0,
}
//User controls
document.addEventListener('keydown', event => {
    if(event.keyCode === 37){
        playerMove(-1);
    }
    else if(event.keyCode === 39){
        playerMove(1);
    }
    else if(event.keyCode === 40){
        playerDrop();
    }
    else if(event.keyCode === 81){
        playerRotate(-1);
    }
    else if(event.keyCode ===87){
        playerRotate(1);
    }
});

//run commands
playerReset();
updateScore();
update();