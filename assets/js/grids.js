let canvas,
  templateW,
  templateH,
  gap,
  gapY,
  xBorder,
  yBorder,
  xNumber,
  yNumber,
  shiftY,
  showPixels,
  nodeWidthRatio; // new variable
let dpi = 300;

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
  console.log("showPixels :>> ", showPixels.checked);
  templateW2 = Number(templateW.value) || 0;
  templateH2 = Number(templateH.value) || 0;
  borderX = Number(xBorder.value) * dpi || 0;
  borderY = Number(yBorder.value) * dpi || 0;
  gap2 = Number(gap.value) * dpi || 0;
  gap2y = gapY.value ? Number(gapY.value) * dpi : gap2;
  xNumber2 = Number(xNumber.value);
  yNumber2 = Number(yNumber.value);
  shiftY2 = Number(shiftY.value) * dpi || 0;

  textAlign(CENTER, CENTER);
  //need to make sure it is divisible by 300 at some point.
  // 2 decimal points seems to work
  const nodeWInitial = round(
    (templateW2 * dpi - 2 * borderX - (xNumber2 - 1) * gap2) / xNumber2
  );
  const nodeHInitial = round(
    (templateH2 * dpi - 2 * borderY - (yNumber2 - 1) * gap2y) / yNumber2,
    2
  );
  let nodeH, nodeW;

  if (
    nodeWidthRatio.value &&
    nodeWidthRatio.value < 1 &&
    nodeWidthRatio.value !== "0"
  ) {
    nodeW = round(nodeWInitial / dpi, 2) * dpi;
    nodeH = nodeW * nodeWidthRatio.value;
  } else if (nodeWidthRatio.value && nodeWidthRatio.value >= 1) {
    nodeH = round(nodeHInitial / dpi, 2) * dpi;
    nodeW = nodeH / nodeWidthRatio.value;
  } else {
    nodeW = round(nodeWInitial / dpi, 2) * dpi;
    nodeH = round(nodeHInitial / dpi, 2) * dpi;
  }

  console.log("nodeW :>> ", nodeW);

  console.log("nodeH :>> ", nodeH);
  //const nodeW = ((templateW2 * dpi - 2 * borderX - (xNumber2 - 1) * gap2) / xNumber2) * Number(nodeWidthRatio.value);
  //const nodeH = ((templateH2 * dpi - 2 * borderY - (yNumber2 - 1) * gap2y) / yNumber2) * Number(nodeHeightRatio.value);
  const newBorderW = round(
    (width - nodeW * xNumber2 - (xNumber2 - 1) * gap2) / 2
  );
  const newBorderH = round(
    (height - nodeH * yNumber2 - (yNumber2 - 1) * gap2y) / 2
  );
  // console.log("newBorderW :>> ", newBorderW);
  // console.log("nodeW :>> ", nodeW);
  // console.log("nodeW/300 :>> ", nodeW / 300);
  // console.log("rounded nodeW/300 :>> ", round(nodeW / 300, 2));
  // console.log("rounded nodeW/300 :>> ", round(nodeW / 300, 2) * 300);
  background(220);
  const stats = document.getElementById("stats");
  stats.innerHTML = `node width: ${round(nodeW / dpi, 2)}in, height: ${round(
    nodeH / dpi,
    2
  )}in (${round(nodeW, 2)}px x ${round(
    nodeH,
    2
  )}px) <br/> actual border on left: ${round(
    newBorderW / dpi,
    2
  )} - right: ${round(
    (width - newBorderW - nodeW * xNumber2 - (xNumber2 - 1) * gap2) / dpi,
    2
  )} `;
  textSize(40);
  text(
    `nodes are - width: ${round(nodeW / dpi, 2)}, height: ${round(
      nodeH / dpi,
      2
    )} `,
    width / 2,
    20
  );

  textSize(80);
  // exit when rows reached (fix for shiftY)
  let rows = 0;
  for (let x = newBorderW; x < width - newBorderW; x = x + nodeW + gap2) {
    for (let y = newBorderH; y < height - newBorderH; y = y + nodeH + gap2y) {
      strokeWeight(5);
      stroke(0, 200, 200);
      rect(x, y + shiftY2, nodeW, nodeH);
      strokeWeight(1);
      stroke(0, 0, 0);
      if (nodeW / dpi < 1.5 || nodeH / dpi < 1.5) {
        textSize(40);
      }
      text(
        showPixels.checked
          ? `x: ${round(x)} y: ${round(y)}`
          : ` x: ${round(x / dpi, 2)}   y: ${round((y + shiftY2) / dpi, 2)} `,
        x,
        y + shiftY2,
        nodeW,
        nodeH
      );
    }
  }
}
function initializeInputs() {
  templateW = document.getElementById("templateW");
  templateH = document.getElementById("templateH");
  gap = document.getElementById("gap");
  gapY = document.getElementById("gapY");
  xBorder = document.getElementById("xBorder");
  yBorder = document.getElementById("yBorder");
  xNumber = document.getElementById("xNumber");
  yNumber = document.getElementById("yNumber");
  shiftY = document.getElementById("shiftY");
  nodeWidthRatio = document.getElementById("nodeWidthRatio");
  showPixels = document.getElementById("showPixels");
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

function saveImage(generator = "griderator") {
  // save('pattern.png');
  var link = document.createElement("a");
  var theCanvas = document.getElementById("defaultCanvas0");
  let imgData = theCanvas.toDataURL("image/jpeg", 1.0);

  // var strDataURI = imgData.substr(22, imgData.length);
  var blob = dataURLtoBlob(imgData);
  var objurl = URL.createObjectURL(blob);
  var date = new Date();
  let timestamp = `${date.getMonth() + 1}${date.getDate()}${date
    .getFullYear()
    .toString()
    .slice(2)}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  link.download = `${generator}-${timestamp}`;
  link.href = objurl;
  link.click();
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
