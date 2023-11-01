let templateW, templateH, gap, border, xNumber, yNumber
let dpi = 150
function setup() {
   initializeInputs()
    initializeEventListeners()
    let w = templateW
    let h = templateH
    let divisor = w
    if(h > w) {
       divisor = h
    }
const maxW = (1000/divisor)*w
const maxH = (1000/divisor)*h
 canvas = createCanvas(w*dpi, h*dpi)
 let correctCanvas = document.getElementById("bg-canvas")
 canvas.parent(correctCanvas)
 canvas.style("max-width", maxW+'px')
 canvas.style("max-height", maxH+'px')
 canvas.style("border", "1px solid #cfcfcf")
  drawGrid()
 
}

function drawGrid() {
    textSize((templateW/15)*50)
    textAlign(CENTER, CENTER)
    console.log("drawGrid ran")
    //const b = Number(border.value)*dpi
    const nodeW = ((templateW*dpi) - (2*border) -((xNumber-1)*gap))/xNumber
    const nodeH =
    (templateH * dpi - 2 * border - (yNumber - 1) * gap) / yNumber
    background(220)
    for (let x = border; x < width - border; x = x + nodeW + gap) {
        for(let y=border; y < height - border; y=y+ nodeH + gap){
            
            rect(x, y, nodeW, nodeH)
            text(` x:${round(x/dpi,3)}   y:${round(y/dpi,3)} `, x, y, nodeW, nodeH)
        }
    }
    text(`nodes are - width: ${round(nodeW/dpi,3)}, height: ${round(nodeH/dpi,3)} `,width/2,30)
}
function initializeInputs() {
  templateW = Number(document.getElementById("templateW").value) || 0
  templateH = Number(document.getElementById("templateH").value) || 0
  gap = Number(document.getElementById("gap").value) * dpi || 0
  border = Number(document.getElementById("border").value) * dpi || 0
  xNumber = Number(document.getElementById("xNumber").value) || 0
  yNumber = Number(document.getElementById("yNumber").value) || 0
   
}
function initializeEventListeners() {
  //get all sliders at once
  const inputs = document.querySelectorAll('input')
  // Attach event listeners to each slider
  inputs.forEach(function (slider) {
   // console.log('slider :>> ', slider);
    slider.addEventListener("change", function () {
     setup()
    })
  })
  // checkboxes and color inputs have the oninput set to run the draw function
}