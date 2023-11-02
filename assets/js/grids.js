let canvas, templateW, templateH, gap, border, xNumber, yNumber;
let dpi = 150;

function setup() {
  initializeInputs();
  initializeEventListeners();
  canvas = createCanvas(15 * dpi, 12 * dpi);
  let correctCanvas = document.getElementById("bg-canvas");
  canvas.parent(correctCanvas);
  canvas.style("max-width", "1000px");
  canvas.style("max-height", "800px");
  canvas.style("border", "1px solid #cfcfcf");
  drawGrid();
}

function drawGrid() {
  templateW2 = Number(templateW.value) || 0;
  templateH2 = Number(templateH.value) || 0;
  border2 = Number(border.value) * dpi || 0;
  gap2 = Number(gap.value) * dpi || 0;
  xNumber2 = Number(xNumber.value);
  yNumber2 = Number(yNumber.value);

  textSize((templateW2 / 15) * 50);
  textAlign(CENTER, CENTER);
  const nodeW =
    (templateW2 * dpi - 2 * border2 - (xNumber2 - 1) * gap2) / xNumber2;
  const nodeH =
    (templateH2 * dpi - 2 * border2 - (yNumber2 - 1) * gap2) / yNumber2;
  background(220);
  for (let x = border2; x < width - border2; x = x + nodeW + gap2) {
    for (let y = border2; y < height - border2; y = y + nodeH + gap2) {
      rect(x, y, nodeW, nodeH);
      text(
        ` x:${round(x / dpi, 3)}   y:${round(y / dpi, 3)} `,
        x,
        y,
        nodeW,
        nodeH
      );
    }
  }
  text(
    `nodes are - width: ${round(nodeW / dpi, 3)}, height: ${round(
      nodeH / dpi,
      3
    )} `,
    width / 2,
    (templateW2 / 15) * 30
  );
}
function initializeInputs() {
  templateW = document.getElementById("templateW");
  templateH = document.getElementById("templateH");
  gap = document.getElementById("gap");
  border = document.getElementById("border");
  xNumber = document.getElementById("xNumber");
  yNumber = document.getElementById("yNumber");
}
function initializeEventListeners() {
  //get all sliders at once
  const inputs = document.querySelectorAll("input");
  // Attach event listeners to each slider
  inputs.forEach(function (item) {
    item.addEventListener("input", function () {
      if (item.id === "templateW" || item.id === "templateH") {
        resizeMe();
      } else {
        drawGrid();
      }
    });
  });
  // checkboxes and color inputs have the oninput set to run the draw function
}

function resizeMe() {
  let w = Number(templateW.value);
  let h = Number(templateH.value);
  let divisor = w;
  if (h > w) {
    divisor = h;
  }
  const maxW = (1000 / divisor) * w;
  const maxH = (1000 / divisor) * h;

  resizeCanvas(w * dpi, h * dpi);
  canvas.style("max-width", maxW + "px");
  canvas.style("max-height", maxH + "px");
  drawGrid();
}
