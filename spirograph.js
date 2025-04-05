
export class Spirograph {
    constructor(canvas, initialParams) {
        if (!canvas) {
            throw new Error("Canvas element is required for Spirograph.");
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        // Parameters are now set via initialParams passed from main.js
        this.params = { ...initialParams }; // Ensure initialParams includes all necessary defaults

        this.points = [];
        this.t = 0; // Angle parameter

        // Apply initial background color
        this.canvas.style.backgroundColor = this.params.bgColor;

        // Improve rendering quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    // Update one or more parameters
    updateParam(newParams) {
        const requiresReset = newParams.R !== undefined || newParams.r !== undefined || newParams.p !== undefined;

        this.params = { ...this.params, ...newParams };

        if (newParams.bgColor !== undefined) {
             this.canvas.style.backgroundColor = this.params.bgColor;
        }

        // If essential drawing parameters change, reset the drawing
        if (requiresReset) {
             this.reset();
        }
    }

    // Reset the drawing state
    reset() {
        this.points = [];
        this.t = 0;
        this.clearCanvas(); // Clear immediately on reset
    }

    // Clear the canvas using the current background color
    clearCanvas() {
        this.ctx.fillStyle = this.params.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Calculate the spirograph point for a given angle t
    calculatePoint(angle) {
        const { R, r, p } = this.params;
        // Prevent division by zero if r is 0
        const effectiveR = r === 0 ? 1e-6 : r;

        // Spirograph equations
        const x = (R - r) * Math.cos(angle) + p * Math.cos((R - r) / effectiveR * angle);
        const y = (R - r) * Math.sin(angle) - p * Math.sin((R - r) / effectiveR * angle);

        return {
            x: this.centerX + x,
            y: this.centerY + y
        };
    }

    // Add point and manage the trail length
    addPoint(point) {
        this.points.push(point);
        // Remove the oldest point if the trail exceeds the maximum length
        if (this.points.length > this.params.maxPoints) {
            this.points.shift();
        }
    }

     // Draw construction circles (guides)
    drawConstructionCircles() {
        const { R, r } = this.params;
        const ctx = this.ctx; // Use local alias for context

        ctx.save(); // Save current context state
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Dim white for guides
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1; // Full opacity for guides
        ctx.shadowBlur = 0; // No shadow for guides

        // 1. Large fixed circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, R, 0, Math.PI * 2);
        ctx.stroke();

        if (r > 0) {
             // Calculate the center of the small rolling circle
            const smallCircleCenterX = this.centerX + (R - r) * Math.cos(this.t);
            const smallCircleCenterY = this.centerY + (R - r) * Math.sin(this.t);

            // 2. Small rolling circle
            ctx.beginPath();
            ctx.arc(smallCircleCenterX, smallCircleCenterY, r, 0, Math.PI * 2);
            ctx.stroke();

            // 3. Line from center to small circle's center
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(smallCircleCenterX, smallCircleCenterY);
            ctx.stroke();

             // 4. Line from small circle's center to the drawing point (pen)
             const currentPoint = this.points[this.points.length - 1];
             if(currentPoint) { // Ensure a point exists
                ctx.beginPath();
                ctx.moveTo(smallCircleCenterX, smallCircleCenterY);
                ctx.lineTo(currentPoint.x, currentPoint.y);
                ctx.stroke();
             }
        }
        ctx.restore(); // Restore context state
    }

    // Main drawing logic for rendering the spirograph path
    drawPath() {
        const ctx = this.ctx;
        ctx.save(); // Save context state for path drawing

        ctx.strokeStyle = this.params.color;
        ctx.lineWidth = this.params.lineWidth;
        ctx.shadowBlur = 10; // Add glow effect
        ctx.shadowColor = this.params.color;

        // Draw line segments between consecutive points
        for (let i = 0; i < this.points.length - 1; i++) {
            let opacity = 1.0;
             // Apply fading effect if enabled
             if (this.params.fadingTrail && this.points.length > 1) {
                 // Calculate opacity: older points are more transparent
                 opacity = (i + 1) / (this.points.length - 1);
                 opacity = Math.max(0.05, opacity * opacity); // Quadratic fade for more emphasis
             }

            ctx.globalAlpha = opacity; // Set transparency for the segment

            ctx.beginPath();
            ctx.moveTo(this.points[i].x, this.points[i].y);
            ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            ctx.stroke();
        }

        ctx.restore(); // Restore context state (resets alpha, shadow, etc.)
    }

    // Perform one step of the animation calculation
    step() {
        const newPoint = this.calculatePoint(this.t);
        this.addPoint(newPoint);
        this.t += this.params.speed; // Increment angle for next step
    }

    // Render the current state onto the canvas
    render() {
        this.clearCanvas(); // Clear before drawing

        // Draw guides if enabled
        if (this.params.showCircles) {
            this.drawConstructionCircles();
        }

        // Draw the spirograph path
        this.drawPath();
    }

     // Method specifically for generating export data URL
     // Handles temporary state changes (like hiding guides)
    getCanvasDataURL(options = {}) {
        const { includeGuides = false } = options;
        const originalShowCircles = this.params.showCircles;
        let dataURL = '';

        try {
            // Temporarily set guide visibility based on export option
            if (this.params.showCircles !== includeGuides) {
                this.updateParam({ showCircles: includeGuides });
                this.render(); // Re-render with the desired guide visibility
            }

            dataURL = this.canvas.toDataURL('image/png');

        } catch (error) {
            console.error("Error generating canvas data URL:", error);
            // Return empty or default image URL?
        } finally {
            // IMPORTANT: Always restore the original state
            if (this.params.showCircles !== originalShowCircles) {
                this.updateParam({ showCircles: originalShowCircles });
                 // No immediate need to re-render here, animation loop will catch it
            }
        }
        return dataURL;
    }
}