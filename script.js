let gridSize = 16;
let isPainting = false;
let isErasing = false;
let paint = "#000000";
let bg = "#ffffff";

// Audio
let clickAudio = new Audio("audio/click.wav");
let pencilAudio = new Audio("audio/pencil.wav");
let eraserAudio = new Audio("audio/eraser.wav");

let audioMuted = false;

// Get sketch
let sketch = document.querySelector(".sketch-grid");
// Assign painting events
sketch.addEventListener("mousedown", () => {
    isPainting = true;
    if (!audioMuted){
        if (isErasing){
            pencilAudio.pause();
            eraserAudio.play();
        } else {
            eraserAudio.pause();
            pencilAudio.play();
        }
    }
});
document.addEventListener("mouseup", () => {
    isPainting = false;
    pencilAudio.pause();
    eraserAudio.pause();
});

// Get and assign resize bt
let resizeBt = document.querySelector("#resize-bt");
resizeBt.addEventListener("click", () => {
    if (!audioMuted){
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
    
    resize();
});

// Get and assign tool bt
let toolBt = document.querySelector("#tool");
toolBt.addEventListener("click", () => {
    if (!audioMuted){
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
    
    toggleTool()
});
let toolImg = document.querySelector("#tool-img");

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

// Get and assign save bt
let saveBt = document.querySelector("#save-bt");
saveBt.addEventListener("click", () => {
    if (!audioMuted){
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
    
    savePainting();
});

// Get and assign audio bt
let audioImg = document.querySelector("#audio-img");
let muteBt = document.querySelector("#mute-bt");
muteBt.addEventListener("click", () => {
    audioMuted ? unmutePage() : mutePage();
    audioImg.src = audioMuted ? "img/mute_icon.png" : "img/audio_icon.png";

    if (!audioMuted){
        clickAudio.currentTime = 0;
        clickAudio.play();
    }
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

setTool(false);
spawnGrid();

function toggleTool(){
    setTool(!isErasing);
}

function setTool(erase){
    isErasing = erase;
    toolImg.src = isErasing ? "img/rubber.png" : "img/pencil.png";
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

function savePainting() {
    // Convert sketch content to a canvas using html2canvas
    html2canvas(sketch).then(function(canvas) {
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create a Blob from the data URL
        const blob = dataURLtoBlob(dataURL);
        
        // Create a download link
        const fileName = 'painting.png';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    });
}

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bStr = atob(arr[1]);
    let n = bStr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// Mute a singular HTML5 element
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

// Mute a singular HTML5 element
function unmuteMe(elem) {
    elem.muted = false;
}

// Try to mute all video and audio elements on the page
function mutePage() {
    audioMuted = true;
    document.querySelectorAll("video, audio").forEach((elem) => muteMe(elem));
}

// Try to mute all video and audio elements on the page
function unmutePage() {
    audioMuted = false;
    document.querySelectorAll("video, audio").forEach((elem) => unmuteMe(elem));
}