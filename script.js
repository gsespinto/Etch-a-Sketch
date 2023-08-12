let gridSize = 16;
let isPainting = false;
let isErasing = false;
let paint = "#000000";
let bg = "#ffffff";

// Get sketch
let sketch = document.querySelector(".sketch-grid");
// Assign painting events
sketch.addEventListener("mousedown", () => isPainting = true);
document.addEventListener("mouseup", () => isPainting = false);

// Get and assign resize bt
let resizeBt = document.querySelector("#resize-bt");
resizeBt.addEventListener("click", resize);

// Get and assign tool bt
let toolBt = document.querySelector("#tool");
toolBt.addEventListener("click", toggleTool);

// Get and assign paint picker color
let paintPicker = document.querySelector('#paint-picker');
paintPicker.addEventListener("input", () => { 
    paint = paintPicker.value;
});

// Get and assign background picker color
let backgroundPicker = document.querySelector('#background-picker');
backgroundPicker.addEventListener("input", () => {    
    setBackgroundColor(backgroundPicker.value)
});

function setBackgroundColor(value){
    // Store last bg and assign new one
    let oldBg = bg;
    bg = value;
    
    // Loop through sketch children
    let children = sketch.children;
    for(let i = 0; i < children.length; i++){
        let child = children[i];

        // If child has old bg color, give it new one
        if (child.style.backgroundColor  === oldBg || child.style.backgroundColor === hexToRGB(oldBg)){
            child.style.backgroundColor = bg;
        }
    }
}


// Converts given hex value into formatted rgb string
function hexToRGB(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

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

// Spawns children into sketch grid and assigns events
function spawnGrid(){
    sketch.replaceChildren();
    for (let x = 0; x < gridSize; x++){
        for (let y = 0; y < gridSize; y++){ 
            // Create new box
            let box = document.createElement("div");
            box.style.width = 100.0 / gridSize + "%";
            box.style.height = 100.0 / gridSize + "%";
            box.style.backgroundColor = bg;
            
            // Assign trail events
            box.addEventListener("mouseenter", leaveSelfTrail);
            box.addEventListener("mousedown", () => {
                isPainting = true;
                leaveTrail(box);
            });
            
            // Append new box as child of sketch grid
            sketch.appendChild(box);
        }
    }
}

// Resizes square sketch grid with prompt value
function resize(){
    gridSize = +prompt("Set new grid size: ");
    while (gridSize === NaN || gridSize >= 100 || gridSize <= 0){
        gridSize = +prompt("Invalid grid size. Set new grid size: ");
    }

    spawnGrid();
}