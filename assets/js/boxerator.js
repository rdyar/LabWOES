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
        // this.materialThickness = 0.1; // Not used yet
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.drawBox();
    }
    
    setupCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '1px solid #ccc';
        this.canvas.style.backgroundColor = '#f9f9f9';
        
        // Get the canvas container and append the canvas
        const container = document.getElementById('bg-canvas');
        if (container) {
            container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupEventListeners() {
        // Add event listeners to the input fields
        const widthInput = document.getElementById('boxWidth');
        const heightInput = document.getElementById('boxHeight');
        const depthInput = document.getElementById('boxDepth');
        const topBottomFlapInput = document.getElementById('topBottomFlapWidth');
        const thicknessInput = document.getElementById('materialThickness');
        
        if (widthInput) {
            widthInput.addEventListener('input', (e) => {
                this.width = parseFloat(e.target.value) || 0;
                this.drawBox();
            });
        }
        
        if (heightInput) {
            heightInput.addEventListener('input', (e) => {
                this.height = parseFloat(e.target.value) || 0;
                this.drawBox();
            });
        }
        
        if (depthInput) {
            depthInput.addEventListener('input', (e) => {
                this.depth = parseFloat(e.target.value) || 0;
                this.drawBox();
            });
        }
        
        // Top/bottom flap width
        if (topBottomFlapInput) {
            topBottomFlapInput.addEventListener('input', (e) => {
                this.topBottomFlap = parseFloat(e.target.value) || 0;
                this.drawBox();
            });
        }
        
        // Material thickness not implemented yet
        
        // if (thicknessInput) {
        //     thicknessInput.addEventListener('input', (e) => {
        //         this.materialThickness = parseFloat(e.target.value) || 0;
        //         this.drawBox();
        //     });
        // }
    }
    
    drawBox() {
        if (!this.ctx) return;
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set up drawing context
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#e0e0e0';
        
        // Calculate scale factor to fit the box on canvas
        // Total width now includes side flaps: width + depth*2 + width*0.5*2 = width*2 + depth*2
        // Total height now includes top/bottom flaps: height + depth*2 + topBottomFlap*2
        const totalWidth = this.width * 2 + this.depth * 2;
        const totalHeight = this.height + this.depth * 2 + this.topBottomFlap * 2;
        
        const scale = Math.min(
            (this.canvas.width - 100) / totalWidth,
            (this.canvas.height - 100) / totalHeight
        );
        
        // Center the drawing on the canvas
        // Need to account for left side flap extending into negative coordinates
        const leftSideFlapWidth = this.width * 0.5;
        const effectiveOffsetX = (this.canvas.width - totalWidth * scale) / 2 + leftSideFlapWidth * scale;
        const offsetX = effectiveOffsetX;
        // Need to account for top flap extending into negative coordinates
        const topFlapHeight = this.topBottomFlap;
        const effectiveOffsetY = (this.canvas.height - totalHeight * scale) / 2 + topFlapHeight * scale;
        const offsetY = effectiveOffsetY;
        
        // Draw the main box outline
        this.drawBoxOutline(offsetX, offsetY, scale);
        
        // Update stats display
        this.updateStats();
    }
    
    drawBoxOutline(offsetX, offsetY, scale) {
        const w = this.width * scale;
        const h = this.height * scale;
        const d = this.depth * scale;
        
        // Draw the cross shape of the one piece folder
        this.ctx.beginPath();
        
        // Top flap
        this.ctx.rect(offsetX + d, offsetY, w, d);
        
        // Bottom flap
        this.ctx.rect(offsetX + d, offsetY + d + h, w, d);
        
        // Left flap
        this.ctx.rect(offsetX, offsetY + d, d, h);
        
        // Right flap
        this.ctx.rect(offsetX + d + w, offsetY + d, d, h);
        
        // Center (main box area)
        this.ctx.rect(offsetX + d, offsetY + d, w, h);
        
        // Left side flap (50% of width, extends outward)
        const leftSideFlapWidth = (w * 0.5);
        this.ctx.rect(offsetX - leftSideFlapWidth, offsetY + d, leftSideFlapWidth, h);
        
        // Right side flap (50% of width, extends outward)
        const rightSideFlapWidth = (w * 0.5);
        this.ctx.rect(offsetX + d + w + d, offsetY + d, rightSideFlapWidth, h);
        
        // Top flap (extends outward from top depth flap)
        const tbf = this.topBottomFlap * scale;
        this.ctx.rect(offsetX + d, offsetY - tbf, w, tbf);
        
        // Bottom flap (extends outward from bottom depth flap)
        this.ctx.rect(offsetX + d, offsetY + d + h, w, tbf);
        
        this.ctx.stroke();
        this.ctx.fill();
        
        // Draw crease lines (dashed)
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        
        // Vertical creases
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX + d, offsetY);
        this.ctx.lineTo(offsetX + d, offsetY + d + h + d);
        this.ctx.moveTo(offsetX + d + w, offsetY);
        this.ctx.lineTo(offsetX + d + w, offsetY + d + h + d);
        
        // Side flap creases (where side flaps meet depth flaps)
        // Left side crease (depth flap meets left side flap)
        this.ctx.moveTo(offsetX, offsetY + d);
        this.ctx.lineTo(offsetX, offsetY + d + h);
        // Right side crease (depth flap meets right side flap)
        this.ctx.moveTo(offsetX + d + w + d, offsetY + d);
        this.ctx.lineTo(offsetX + d + w + d, offsetY + d + h);
        this.ctx.stroke();
        
        // Horizontal creases (extend across full template width)
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX - (w * 0.5), offsetY + d);
        this.ctx.lineTo(offsetX + d + w + (w * 0.5), offsetY + d);
        this.ctx.moveTo(offsetX - (w * 0.5), offsetY + d + h);
        this.ctx.lineTo(offsetX + d + w + (w * 0.5), offsetY + d + h);
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
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // Add labels
        this.addLabels(offsetX, offsetY, scale);
    }
    
    addLabels(offsetX, offsetY, scale) {
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        const w = this.width * scale;
        const h = this.height * scale;
        const d = this.depth * scale;
        const tbf = this.topBottomFlap * scale;
        
        // Center label
        this.ctx.fillText(`${this.width}" × ${this.height}"`, offsetX + d + w/2, offsetY + d + h/2);
        
        // Depth labels
        this.ctx.fillText(`${this.depth}"`, offsetX + d/2, offsetY + d/2);
        this.ctx.fillText(`${this.depth}"`, offsetX + d + w + d/2, offsetY + d/2);
        this.ctx.fillText(`${this.depth}"`, offsetX + d + w/2, offsetY + d/2);
        this.ctx.fillText(`${this.depth}"`, offsetX + d + w/2, offsetY + d + h + d/2);
        
        // Left and right flap depth labels
        this.ctx.fillText(`${this.depth}"`, offsetX + d/2, offsetY + d + h/2);
        this.ctx.fillText(`${this.depth}"`, offsetX + d + w + d/2, offsetY + d + h/2);
        
        // Top and bottom flap labels
        const tbfScaled = this.topBottomFlap * scale;
        this.ctx.fillText(`${this.topBottomFlap}"`, offsetX + d + w/2, offsetY - tbfScaled/2);
        this.ctx.fillText(`${this.topBottomFlap}"`, offsetX + d + w/2, offsetY + d + h + tbfScaled/2);
        
        // Left and right side flap labels (50% of width)
        const sideFlapWidth = this.width * 0.5;
        this.ctx.fillText(`${sideFlapWidth}"`, offsetX - (w * 0.5)/2, offsetY + d + h/2);
        this.ctx.fillText(`${sideFlapWidth}"`, offsetX + d + w + (w * 0.5)/2, offsetY + d + h/2);
    }
    
    updateStats() {
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            const totalWidth = this.width * 2 + this.depth * 2;
            const totalHeight = this.height + this.depth * 2;
            const area = totalWidth * totalHeight;
            
            statsElement.innerHTML = `
                <strong>Box Dimensions:</strong> ${this.width}" × ${this.height}" × ${this.depth}"<br>
                <strong>Total Template Size:</strong> ${totalWidth}" × ${totalHeight}"<br>
                <strong>Total Area:</strong> ${area.toFixed(1)} square inches<br>
                <strong>Side Flap Width:</strong> ${(this.width * 0.5).toFixed(1)}"<br>
                <strong>Top/Bottom Flap Width:</strong> ${this.topBottomFlap}"
            `;
        }
    }
}

// Initialize the boxerator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Boxerator();
});
