document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spirographCanvas');
    const spirograph = new Spirograph(canvas);

    // --- DOM Elements ---
    const controls = {
        R: document.getElementById('R'),
        r: document.getElementById('r'),
        p: document.getElementById('p'),
        speed: document.getElementById('speed'),
        lineWidth: document.getElementById('lineWidth'),
        color: document.getElementById('color'),
        bgColor: document.getElementById('bgColor'),
        showCircles: document.getElementById('showCircles'),
        fadingTrail: document.getElementById('fadingTrail'),
        presets: document.getElementById('presets'),
        resetButton: document.getElementById('resetButton'),
        exportButton: document.getElementById('exportButton')
    };

    const valueDisplays = {
        R: document.getElementById('RValue'),
        r: document.getElementById('rValue'),
        p: document.getElementById('pValue'),
        speed: document.getElementById('speedValue'),
        lineWidth: document.getElementById('lineWidthValue'),
    };

     // --- Preset Values ---
    const presets = {
        flower: { R: 200, r: 50, p: 100, speed: 0.05, color: '#FF69B4', lineWidth: 1.5 },
        star:   { R: 150, r: 30, p: 120, speed: 0.03, color: '#FFFF00', lineWidth: 1 },
        web:    { R: 250, r: 100, p: 50, speed: 0.1, color: '#FFFFFF', lineWidth: 0.5 },
        loops:  { R: 180, r: 120, p: 150, speed: 0.02, color: '#00FF00', lineWidth: 2.5 },
    };

    // --- Initial Sync ---
    function syncUIToParams(params) {
        controls.R.value = params.R;
        controls.r.value = params.r;
        controls.p.value = params.p;
        controls.speed.value = params.speed;
        controls.lineWidth.value = params.lineWidth;
        controls.color.value = params.color;
        controls.bgColor.value = params.bgColor;
        controls.showCircles.checked = params.showCircles;
        controls.fadingTrail.checked = params.fadingTrail;

        valueDisplays.R.textContent = params.R;
        valueDisplays.r.textContent = params.r;
        valueDisplays.p.textContent = params.p;
        valueDisplays.speed.textContent = parseFloat(params.speed).toFixed(3);
        valueDisplays.lineWidth.textContent = params.lineWidth;
         // Update root CSS variables for theme colors
        document.documentElement.style.setProperty('--primary-color', params.color);
        document.documentElement.style.setProperty('--background-color', params.bgColor); // update body bg potentially too? Or keep it separate
        canvas.style.backgroundColor = params.bgColor; // Ensure canvas bg matches

        // Sync label colors etc. if needed based on color/bg choices
        valueDisplays.R.style.color = params.color;
        valueDisplays.r.style.color = params.color;
        valueDisplays.p.style.color = params.color;
        controls.R.style.accentColor = params.color;
        controls.r.style.accentColor = params.color;
        controls.p.style.accentColor = params.color;
        controls.speed.style.accentColor = params.color;
        controls.lineWidth.style.accentColor = params.color;
         document.querySelector('h1').style.color = params.color;
         // Potentially more theme updates here
    }

    // Initialize UI
    syncUIToParams(spirograph.params);


    // --- Event Listeners ---
    controls.R.addEventListener('input', () => {
        const value = parseInt(controls.R.value);
        valueDisplays.R.textContent = value;
        spirograph.updateParam({ R: value });
    });
    controls.r.addEventListener('input', () => {
        const value = parseInt(controls.r.value);
        valueDisplays.r.textContent = value;
        spirograph.updateParam({ r: value });
    });
    controls.p.addEventListener('input', () => {
        const value = parseInt(controls.p.value);
        valueDisplays.p.textContent = value;
        spirograph.updateParam({ p: value });
    });
    controls.speed.addEventListener('input', () => {
        const value = parseFloat(controls.speed.value);
        valueDisplays.speed.textContent = value.toFixed(3);
        spirograph.updateParam({ speed: value });
    });
     controls.lineWidth.addEventListener('input', () => {
        const value = parseFloat(controls.lineWidth.value);
        valueDisplays.lineWidth.textContent = value;
        spirograph.updateParam({ lineWidth: value });
    });
    controls.color.addEventListener('input', () => {
         const value = controls.color.value;
        spirograph.updateParam({ color: value });
         syncUIToParams(spirograph.params); // Resync UI for color changes
    });
     controls.bgColor.addEventListener('input', () => {
         const value = controls.bgColor.value;
        spirograph.updateParam({ bgColor: value });
         syncUIToParams(spirograph.params); // Resync UI for color changes
    });
     controls.showCircles.addEventListener('change', () => {
        spirograph.updateParam({ showCircles: controls.showCircles.checked });
    });
    controls.fadingTrail.addEventListener('change', () => {
        spirograph.updateParam({ fadingTrail: controls.fadingTrail.checked });
    });


     controls.presets.addEventListener('change', () => {
        const selectedPreset = controls.presets.value;
        if (presets[selectedPreset]) {
            const presetParams = presets[selectedPreset];
            spirograph.updateParam(presetParams); // Update spirograph state
            syncUIToParams(spirograph.params);   // Update UI controls
            spirograph.reset();                 // Reset drawing for new preset
        }
    });


    controls.resetButton.addEventListener('click', () => {
        spirograph.reset();
    });

    controls.exportButton.addEventListener('click', () => {
        // Temporarily draw without guides if they are on for export
        const showCirclesState = spirograph.params.showCircles;
        if(showCirclesState) {
             spirograph.updateParam({ showCircles: false });
             spirograph.draw(); // Redraw once without circles
        }

        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `spirograph_${Date.now()}.png`;
        link.click();

        // Restore guides if they were on
         if(showCirclesState) {
             spirograph.updateParam({ showCircles: true });
             // No need to redraw immediately, animation loop will handle it
        }
    });


    // --- Animation Loop ---
    let animationFrameId = null;
    function animate() {
        spirograph.step(); // Calculate next point(s)
        spirograph.draw(); // Render the current state
        animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Optional: Stop animation if page is hidden (performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });
});