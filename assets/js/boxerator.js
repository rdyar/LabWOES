// Boxerator - One Piece Folder Box Designer
// Uses vanilla JavaScript to create a visual representation of a one piece folder box

class Boxerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 12;
    this.height = 15;
    this.depth = 1;
    this.topBottomFlap = 3; // Width of top and bottom flaps
    this.materialThickness = 0.1; // Material thickness for proper folding

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.drawBox();
  }

  setupCanvas() {
    // Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1000; // Increased from 800
    this.canvas.height = 800; // Increased from 600
    this.canvas.style.border = "1px solid #ccc";
    this.canvas.style.backgroundColor = "#ffffff"; // Changed to white

    // Get the canvas container and append the canvas
    const container = document.getElementById("bg-canvas");
    if (container) {
      container.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext("2d");
  }

  setupEventListeners() {
    // Add event listeners to the input fields
    const widthInput = document.getElementById("boxWidth");
    const heightInput = document.getElementById("boxHeight");
    const depthInput = document.getElementById("boxDepth");
    const topBottomFlapInput = document.getElementById("topBottomFlapWidth");
    const thicknessInput = document.getElementById("materialThickness");

    if (widthInput) {
      widthInput.addEventListener("input", (e) => {
        this.width = parseFloat(e.target.value) || 0;
        this.drawBox();
      });
    }

    if (heightInput) {
      heightInput.addEventListener("input", (e) => {
        this.height = parseFloat(e.target.value) || 0;
        this.drawBox();
      });
    }

    if (depthInput) {
      depthInput.addEventListener("input", (e) => {
        this.depth = parseFloat(e.target.value) || 0;
        this.drawBox();
      });
    }

    // Top/bottom flap width
    if (topBottomFlapInput) {
      topBottomFlapInput.addEventListener("input", (e) => {
        this.topBottomFlap = parseFloat(e.target.value) || 0;
        this.drawBox();
      });
    }

    // Material thickness
    if (thicknessInput) {
      thicknessInput.addEventListener("input", (e) => {
        this.materialThickness = parseFloat(e.target.value) || 0;
        this.drawBox();
      });
    }
  }

  drawBox() {
    if (!this.ctx) return;

    // Clear the canvas and fill with white background
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set up drawing context
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = "#e0e0e0";

    // Calculate scale factor to fit the box on canvas
    // Total width now includes side flaps: width + (depth + materialThickness)*2 + (width*0.5 + 0.1)*2 = width*2 + (depth + materialThickness)*2 + 0.2
    // Total height now includes top/bottom flaps: height + depth*2 + topBottomFlap*2
    const totalWidth =
      this.width * 2 + (this.depth + this.materialThickness) * 2 + 0.2;
    const totalHeight = this.height + this.depth * 2 + this.topBottomFlap * 2;

    const scale = Math.min(
      (this.canvas.width - 200) / totalWidth, // Increased margin for stats
      (this.canvas.height - 200) / totalHeight // Increased margin for stats
    );

    // Center the drawing on the canvas
    // Need to account for left side flap extending into negative coordinates
    const leftSideFlapWidth = this.width * 0.5;
    const effectiveOffsetX =
      (this.canvas.width - totalWidth * scale) / 2 + leftSideFlapWidth * scale;
    const offsetX = effectiveOffsetX;
    // Need to account for top flap extending into negative coordinates
    const topFlapHeight = this.topBottomFlap;
    const effectiveOffsetY =
      (this.canvas.height - totalHeight * scale) / 2 + topFlapHeight * scale;
    const offsetY = effectiveOffsetY;

    // Draw the main box outline
    this.drawBoxOutline(offsetX, offsetY, scale);

    // Draw stats on canvas
    this.drawStatsOnCanvas();

    // Update stats display (keep for backward compatibility)
    this.updateStats();
  }

  drawBoxOutline(offsetX, offsetY, scale) {
    const w = this.width * scale;
    const h = this.height * scale;
    const d = this.depth * scale;
    const mt = this.materialThickness * scale;

    // Draw the cross shape of the one piece folder
    this.ctx.beginPath();

    // Top flap
    this.ctx.rect(offsetX + d, offsetY, w, d);

    // Bottom flap
    this.ctx.rect(offsetX + d, offsetY + d + h, w, d);

    // Left flap (increased depth to account for material thickness)
    this.ctx.rect(offsetX, offsetY + d, d + mt, h);

    // Right flap (increased depth to account for material thickness)
    this.ctx.rect(offsetX + d + w, offsetY + d, d + mt, h);

    // Center (main box area)
    this.ctx.rect(offsetX + d, offsetY + d, w, h);

    // Left side flap (50% of width + 0.1", extends outward)
    const leftSideFlapWidth = w * 0.5 + 0.1 * scale;
    this.ctx.rect(
      offsetX - leftSideFlapWidth - mt,
      offsetY + d,
      leftSideFlapWidth,
      h
    );

    // Fill the gap between left side flap and left depth flap
    this.ctx.rect(offsetX - mt, offsetY + d, mt, h);

    // Right side flap (50% of width + 0.1", extends outward)
    const rightSideFlapWidth = w * 0.5 + 0.1 * scale;
    this.ctx.rect(offsetX + d + w + d + mt, offsetY + d, rightSideFlapWidth, h);

    // Top flap (extends outward from top depth flap)
    const tbf = this.topBottomFlap * scale;
    this.ctx.rect(offsetX + d, offsetY - tbf, w, tbf);

    // Bottom flap (extends outward from bottom depth flap)
    this.ctx.rect(offsetX + d, offsetY + d + h + d, w, tbf);

    this.ctx.stroke();
    this.ctx.fill();

    // Draw crease lines (dashed)
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = "#666";
    this.ctx.lineWidth = 1;

    // Vertical creases
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX + d, offsetY);
    this.ctx.lineTo(offsetX + d, offsetY + d + h + d);
    this.ctx.moveTo(offsetX + d + w, offsetY);
    this.ctx.lineTo(offsetX + d + w, offsetY + d + h + d);

    // Side flap creases (where side flaps meet depth flaps)
    // Left side crease (where left side flap meets left depth flap)
    this.ctx.moveTo(offsetX - mt, offsetY + d);
    this.ctx.lineTo(offsetX - mt, offsetY + d + h);
    // Right side crease (where right side flap meets right depth flap)
    this.ctx.moveTo(offsetX + d + w + d + mt, offsetY + d);
    this.ctx.lineTo(offsetX + d + w + d + mt, offsetY + d + h);
    this.ctx.stroke();

    // Horizontal creases (extend across full template width)
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX - w * 0.5 - 0.1 * scale - mt, offsetY + d);
    this.ctx.lineTo(
      offsetX + d + w + d + mt + w * 0.5 + 0.1 * scale,
      offsetY + d
    );
    this.ctx.moveTo(offsetX - w * 0.5 - 0.1 * scale - mt, offsetY + d + h);
    this.ctx.lineTo(
      offsetX + d + w + d + mt + w * 0.5 + 0.1 * scale,
      offsetY + d + h
    );
    this.ctx.stroke();

    // Top and bottom flap creases (where flaps meet depth flaps) - only across flap width
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX + d, offsetY);
    this.ctx.lineTo(offsetX + d + w, offsetY);
    this.ctx.moveTo(offsetX + d, offsetY + d + h);
    this.ctx.lineTo(offsetX + d + w, offsetY + d + h);
    this.ctx.stroke();

    // Additional crease lines for where depth flaps meet top/bottom flaps
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX + d, offsetY);
    this.ctx.lineTo(offsetX + d + w, offsetY);
    this.ctx.moveTo(offsetX + d, offsetY + d + h + d);
    this.ctx.lineTo(offsetX + d + w, offsetY + d + h + d);
    this.ctx.stroke();

    // Reset line style
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 2;

    // Add labels
    this.addLabels(offsetX, offsetY, scale);
  }

  addLabels(offsetX, offsetY, scale) {
    this.ctx.fillStyle = "#333";
    this.ctx.font = "10px Arial"; // Reduced from 12px
    this.ctx.textAlign = "center";

    const w = this.width * scale;
    const h = this.height * scale;
    const d = this.depth * scale;
    const mt = this.materialThickness * scale;
    const tbf = this.topBottomFlap * scale;

    // Center label
    this.ctx.fillText(
      `${this.width.toFixed(1)}" × ${this.height.toFixed(1)}"`,
      offsetX + d + w / 2,
      offsetY + d + h / 2
    );

    // Depth labels
    this.ctx.fillText(
      `${this.depth.toFixed(1)}"`,
      offsetX + d / 2,
      offsetY + d / 2
    );
    this.ctx.fillText(
      `${this.depth.toFixed(1)}"`,
      offsetX + d + w + d / 2,
      offsetY + d / 2
    );
    this.ctx.fillText(
      `${this.depth.toFixed(1)}"`,
      offsetX + d + w / 2,
      offsetY + d / 2
    );
    this.ctx.fillText(
      `${this.depth.toFixed(1)}"`,
      offsetX + d + w / 2,
      offsetY + d + h + d / 2
    );

    // Left and right flap depth labels (now include material thickness) - rotated 90 degrees
    this.ctx.save();
    this.ctx.translate(offsetX + (d + mt) / 2, offsetY + d + h / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `${(this.depth + this.materialThickness).toFixed(1)}"`,
      0,
      0
    );
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(offsetX + d + w + d + (d + mt) / 2, offsetY + d + h / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `${(this.depth + this.materialThickness).toFixed(1)}"`,
      0,
      0
    );
    this.ctx.restore();

    // Top and bottom flap labels
    const tbfScaled = this.topBottomFlap * scale;
    this.ctx.fillText(
      `${this.topBottomFlap.toFixed(1)}"`,
      offsetX + d + w / 2,
      offsetY - tbfScaled / 2
    );
    this.ctx.fillText(
      `${this.topBottomFlap.toFixed(1)}"`,
      offsetX + d + w / 2,
      offsetY + d + h + d + tbfScaled / 2
    );

    // Left and right side flap labels (50% of width + 0.1")
    const sideFlapWidth = this.width * 0.5 + 0.1;
    this.ctx.fillText(
      `${sideFlapWidth.toFixed(1)}"`,
      offsetX - (w * 0.5 + 0.1 * scale) / 2 - mt,
      offsetY + d + h / 2
    );
    this.ctx.fillText(
      `${sideFlapWidth.toFixed(1)}"`,
      offsetX + d + w + (w * 0.5 + 0.1 * scale) / 2,
      offsetY + d + h / 2
    );
  }

  drawStatsOnCanvas() {
    // Set up text context for stats
    this.ctx.fillStyle = "#333";
    this.ctx.font = "14px Arial";
    this.ctx.textAlign = "left";
    this.ctx.lineWidth = 1;

    // Calculate total dimensions
    const totalWidth =
      this.width * 2 + (this.depth + this.materialThickness) * 2 + 0.2;
    const totalHeight = this.height + this.depth * 2 + this.topBottomFlap * 2;
    const area = totalWidth * totalHeight;

    // Position stats in top-right corner with some padding
    const statsX = this.canvas.width - 20;
    const statsY = 30;
    const lineHeight = 18;

    // Create semi-transparent background for stats
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    this.ctx.fillRect(statsX - 200, statsY - 15, 200, 130);

    // Draw border around stats
    this.ctx.strokeStyle = "#ccc";
    this.ctx.strokeRect(statsX - 200, statsY - 15, 200, 130);

    // Reset text style
    this.ctx.fillStyle = "#333";
    this.ctx.font = "12px Arial";

    // Draw stats text
    this.ctx.fillText(
      `Box: ${this.width.toFixed(1)}" × ${this.height.toFixed(
        1
      )}" × ${this.depth.toFixed(1)}"`,
      statsX - 190,
      statsY
    );
    this.ctx.fillText(
      `Material Thickness: ${this.materialThickness.toFixed(1)}"`,
      statsX - 190,
      statsY + lineHeight
    );
    this.ctx.fillText(
      `Depth on Left/Right: ${(this.depth + this.materialThickness).toFixed(
        1
      )}"`,
      statsX - 190,
      statsY + lineHeight * 2
    );
    this.ctx.fillText(
      `Side Flaps: ${(this.width * 0.5 + 0.1).toFixed(1)}"`,
      statsX - 190,
      statsY + lineHeight * 3
    );
    this.ctx.fillText(
      `Top/Bottom Flap: ${this.topBottomFlap.toFixed(1)}"`,
      statsX - 190,
      statsY + lineHeight * 4
    );
    this.ctx.fillText(
      `Cut sheet to: ${totalWidth.toFixed(1)}" × ${totalHeight.toFixed(1)}"`,
      statsX - 190,
      statsY + lineHeight * 5
    );
    this.ctx.fillText(
      `Corner cut outs: ${(
        this.depth +
        this.materialThickness +
        (this.width * 0.5 + 0.1)
      ).toFixed(1)}" x ${(this.depth + this.topBottomFlap).toFixed(1)}"`,
      statsX - 190,
      statsY + lineHeight * 6
    );

    // Add instructional text at the bottom of the canvas
    this.ctx.fillStyle = "#666";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";

    // Draw the instructional text at the bottom center
    this.ctx.fillText(
      `Note: Left/right creases should be moved out slightly so the top and bottom flaps can come inside of it.`,
      this.canvas.width / 2,
      this.canvas.height - 20
    );
  }

  updateStats() {
    const statsElement = document.getElementById("stats");
    if (statsElement) {
      const totalWidth =
        this.width * 2 + (this.depth + this.materialThickness) * 2 + 0.2;
      const totalHeight = this.height + this.depth * 2 + this.topBottomFlap * 2;
      const area = totalWidth * totalHeight;

      statsElement.innerHTML = `
                 <strong>Box Dimensions:</strong> ${this.width.toFixed(
                   1
                 )}" × ${this.height.toFixed(1)}" × ${this.depth.toFixed(
        1
      )}"<br>
                 <strong>Material Thickness:</strong> ${this.materialThickness.toFixed(
                   1
                 )}"<br>
                 <strong>Total Template Size:</strong> ${totalWidth.toFixed(
                   1
                 )}" × ${totalHeight.toFixed(1)}"<br>
                 <strong>Side Flap Width:</strong> ${(
                   this.width * 0.5 +
                   0.1
                 ).toFixed(1)}" (includes +0.1" extension)<br>
                 <strong>Top/Bottom Flap Width:</strong> ${this.topBottomFlap.toFixed(
                   1
                 )}"<br>
                 <strong>Left/Right Flap Depth:</strong> ${(
                   this.depth + this.materialThickness
                 ).toFixed(1)}" (includes material thickness)
             `;
    }
  }
}

// Initialize the boxerator when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Boxerator();
});
