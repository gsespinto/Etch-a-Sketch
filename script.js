let gridSize = 16;
let isPainting = false;
let isErasing = false;
let paint = "black";
let bg = "white";

let container = document.querySelector(".container");
container.addEventListener("mousedown", () => isPainting = true);
document.addEventListener("mouseup", () => isPainting = false);

let resizeBt = document.querySelector("#resize-bt");
resizeBt.addEventListener("click", resize);

let toolBt = document.querySelector("#tool");
toolBt.addEventListener("click", toggleTool);


spawnGrid();

function toggleTool(){
    isErasing = !isErasing;
}

function leaveSelfTrail()
{
    leaveTrail(this);
}

function leaveTrail(target){
    if (!isPainting){
        return;
    }

    target.style.backgroundColor = isErasing ? bg : paint;
}

function spawnGrid()
{
    container.replaceChildren();
    for (let x = 0; x < gridSize; x++){
        for (let y = 0; y < gridSize; y++){ 
            let box = document.createElement("div");
            box.style.width = 100.0 / gridSize + "%";
            box.style.height = 100.0 / gridSize + "%";
            box.style.backgroundColor = "white";
    
            box.addEventListener("mouseenter", leaveSelfTrail);
            box.addEventListener("mousedown", () => {
                isPainting = true;
                leaveTrail(box);
            });
            
            container.appendChild(box);
        }
    }
}

function resize()
{
    gridSize = +prompt("Set new grid size: ");
    while (gridSize === NaN || gridSize >= 100 || gridSize <= 0){
        gridSize = +prompt("Invalid grid size. Set new grid size: ");
    }

    spawnGrid();
}