class Spirograph {
    constructor(canvas, initialParams = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        // Default parameters
        const defaults = {
            R: 200,
            r: 50,
            p: 70,
            speed: 0.05,
            color: '#00FFFF',
            lineWidth: 2,
            maxPoints: 1000,
            fadingTrail: true,
            showCircles: false,
            bgColor: '#1a1a1a'
        };

        // Merge initial params with defaults
        this.params = { ...defaults, ...initialParams };

        this.points = [];
        this.t = 0; // Angle parameter

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    // Update one or more parameters
    updateParam(newParams) {
        this.params = { ...this.params, ...newParams };
        // If essential parameters change, reset the drawing
        if (newParams.R !== undefined || newParams.r !== undefined || newParams.p !== undefined) {
             this.reset();
        }
         if (newParams.bgColor !== undefined) {
             this.canvas.style.backgroundColor = this.params.bgColor;
        }
    }

    // Reset the drawing state
    reset() {
        this.points = [];
        this.t = 0;
        this.clearCanvas();
    }

    // Clear the canvas
    clearCanvas() {
         // Use the current background color for clearing
        this.ctx.fillStyle = this.params.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Calculate the next point
    calculateNextPoint() {
        const { R, r, p } = this.params;
        // Ensure r is not zero to avoid division by zero
        const effectiveR = r === 0 ? 1e-6 : r;

        const x = (R - r) * Math.cos(this.t) + p * Math.cos((R - r) / effectiveR * this.t);
        const y = (R - r) * Math.sin(this.t) - p * Math.sin((R - r) / effectiveR * this.t);

        return {
            x: this.centerX + x,
            y: this.centerY + y
        };
    }

    // Add point and manage trail
    addPoint(point) {
        this.points.push(point);
        if (this.points.length > this.params.maxPoints) {
            this.points.shift();
        }
    }

     // Draw construction circles (Helper)
    drawConstructionCircles() {
        const { R, r } = this.params;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Dim white
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1; // Full opacity for guides
        this.ctx.shadowBlur = 0; // No shadow for guides

        // Large circle (fixed)
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, R, 0, Math.PI * 2);
        this.ctx.stroke();

        if (r > 0) {
             // Calculate small circle center position
            const smallCircleCenterX = this.centerX + (R - r) * Math.cos(this.t);
            const smallCircleCenterY = this.centerY + (R - r) * Math.sin(this.t);

            // Small circle (moving)
            this.ctx.beginPath();
            this.ctx.arc(smallCircleCenterX, smallCircleCenterY, r, 0, Math.PI * 2);
            this.ctx.stroke();

             // Line from center to small circle center
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(smallCircleCenterX, smallCircleCenterY);
            this.ctx.stroke();

             // Line from small circle center to drawing point
             const currentPoint = this.points[this.points.length - 1];
             if(currentPoint) {
                this.ctx.beginPath();
                this.ctx.moveTo(smallCircleCenterX, smallCircleCenterY);
                this.ctx.lineTo(currentPoint.x, currentPoint.y);
                this.ctx.stroke();
             }
        }
    }


    // Main drawing logic for one frame
    draw() {
        this.clearCanvas(); // Clear with background color

         if (this.params.showCircles) {
            this.drawConstructionCircles();
        }


        this.ctx.strokeStyle = this.params.color;
        this.ctx.lineWidth = this.params.lineWidth;
        this.ctx.shadowBlur = 10; // Keep the glow
        this.ctx.shadowColor = this.params.color;

        for (let i = 0; i < this.points.length - 1; i++) {
            // Calculate opacity based on fadingTrail setting
            let opacity = 1.0;
             if (this.params.fadingTrail && this.points.length > 1) {
                 opacity = (i + 1) / (this.points.length - 1);
                 opacity = Math.max(0.05, opacity * opacity); // Make fade more pronounced
             }


            this.ctx.globalAlpha = opacity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.ctx.stroke();
        }

        // Reset global alpha and shadow for next frame elements (like construction circles if drawn first)
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
    }

    // Update state for the next frame
    step() {
        const newPoint = this.calculateNextPoint();
        this.addPoint(newPoint);
        this.t += this.params.speed;
    }
}