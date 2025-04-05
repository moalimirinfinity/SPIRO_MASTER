import { Spirograph } from './spirograph.js';
import { defaultParams, presets } from './config.js'; // Import configuration

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spirographCanvas');
    if (!canvas) {
        console.error("Spirograph canvas not found!");
        return;
    }

    // --- Global State ---
    let spirographInstance = null;
    let animationFrameId = null;
    let uiElements = {}; // To store references to DOM elements

    // --- Initialization ---
    function initializeApp() {
        uiElements = cacheDOMElements();
        spirographInstance = new Spirograph(canvas, { ...defaultParams }); // Start with defaults
        setupEventListeners();
        syncUIToParams(spirographInstance.params); // Initial UI sync
        startAnimationLoop();
        setupVisibilityHandling();
    }

    // --- DOM Element Caching ---
    function cacheDOMElements() {
        return {
            canvas: canvas,
            controls: {
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
            },
            valueDisplays: {
                R: document.getElementById('RValue'),
                r: document.getElementById('rValue'),
                p: document.getElementById('pValue'),
                speed: document.getElementById('speedValue'),
                lineWidth: document.getElementById('lineWidthValue'),
            },
            title: document.querySelector('h1'),
            root: document.documentElement // For CSS variables
        };
    }

    // --- Event Listener Setup ---
    function setupEventListeners() {
        const { controls } = uiElements;
        // Parameter Sliders
        controls.R.addEventListener('input', () => handleParamChange('R', parseInt(controls.R.value)));
        controls.r.addEventListener('input', () => handleParamChange('r', parseInt(controls.r.value)));
        controls.p.addEventListener('input', () => handleParamChange('p', parseInt(controls.p.value)));
        controls.speed.addEventListener('input', () => handleParamChange('speed', parseFloat(controls.speed.value)));
        controls.lineWidth.addEventListener('input', () => handleParamChange('lineWidth', parseFloat(controls.lineWidth.value)));

        // Color Pickers
        controls.color.addEventListener('input', () => handleParamChange('color', controls.color.value, true)); // Resync UI fully
        controls.bgColor.addEventListener('input', () => handleParamChange('bgColor', controls.bgColor.value, true)); // Resync UI fully

        // Checkboxes
        controls.showCircles.addEventListener('change', () => handleParamChange('showCircles', controls.showCircles.checked));
        controls.fadingTrail.addEventListener('change', () => handleParamChange('fadingTrail', controls.fadingTrail.checked));

        // Presets Dropdown
        controls.presets.addEventListener('change', handlePresetChange);

        // Buttons
        controls.resetButton.addEventListener('click', handleReset);
        controls.exportButton.addEventListener('click', handleExport);
    }

    // --- Event Handlers ---
    function handleParamChange(paramName, value, fullSync = false) {
        spirographInstance.updateParam({ [paramName]: value });
        // Update specific value display if it exists
        if (uiElements.valueDisplays[paramName]) {
            uiElements.valueDisplays[paramName].textContent = typeof value === 'number' && (paramName === 'speed')
                ? value.toFixed(3)
                : value.toString();
        }
        // If a major theme color changes, resync the whole UI appearance
        if (fullSync) {
             syncUIToParams(spirographInstance.params); // Use the current params
        } else if (paramName === 'color') {
            // Only update accent colors if primary color changed without full sync
             updateThemeColors(spirographInstance.params.color, spirographInstance.params.bgColor);
        }
    }

    function handlePresetChange() {
        const selectedPreset = uiElements.controls.presets.value;
        if (presets[selectedPreset]) {
            const presetParams = presets[selectedPreset];
            // It's important to merge with existing potentially non-preset params like showCircles, fadingTrail
            const newParams = {
                ...spirographInstance.params, // Keep existing non-preset settings
                ...presetParams               // Override with preset values
             };
            spirographInstance.updateParam(newParams); // Update spirograph state (this will also reset if needed)
            syncUIToParams(spirographInstance.params); // Update all UI controls to reflect the new state
            // Reset is implicitly handled by updateParam if R, r, or p changed
            // If reset wasn't triggered by param change, uncomment next line:
            // spirographInstance.reset();
        }
    }

    function handleReset() {
        // Optionally reset to default parameters or just clear the drawing
        // Current implementation in Spirograph class just clears points and resets t
        spirographInstance.reset();
        // If you want to reset controls to defaultParams as well:
        // spirographInstance.updateParam({ ...defaultParams });
        // syncUIToParams(spirographInstance.params);
    }

    function handleExport() {
        // Use the Spirograph's own export method
        const dataURL = spirographInstance.getCanvasDataURL({ includeGuides: false }); // Export without guides

        if (dataURL) {
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `spirograph_${Date.now()}.png`;
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link); // Clean up
        } else {
            console.error("Failed to generate image for export.");
            alert("Sorry, could not export the image.");
        }
    }

    // --- UI Synchronization ---
    function syncUIToParams(params) {
        const { controls, valueDisplays } = uiElements;

        // Update controls
        controls.R.value = params.R;
        controls.r.value = params.r;
        controls.p.value = params.p;
        controls.speed.value = params.speed;
        controls.lineWidth.value = params.lineWidth;
        controls.color.value = params.color;
        controls.bgColor.value = params.bgColor;
        controls.showCircles.checked = params.showCircles;
        controls.fadingTrail.checked = params.fadingTrail;

        // Update value displays
        valueDisplays.R.textContent = params.R;
        valueDisplays.r.textContent = params.r;
        valueDisplays.p.textContent = params.p;
        valueDisplays.speed.textContent = parseFloat(params.speed).toFixed(3);
        valueDisplays.lineWidth.textContent = params.lineWidth;

        // Update theme (CSS variables and element styles)
        updateThemeColors(params.color, params.bgColor);
    }

    function updateThemeColors(primaryColor, backgroundColor) {
        const { root, controls, valueDisplays, title } = uiElements;
        // Update CSS Variables
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--background-color', backgroundColor);
        // Potentially update --controls-bg, --text-color etc. based on bg for contrast?

        // Update elements directly styled (if CSS variables aren't sufficient)
        valueDisplays.R.style.color = primaryColor;
        valueDisplays.r.style.color = primaryColor;
        valueDisplays.p.style.color = primaryColor;
        controls.R.style.accentColor = primaryColor;
        controls.r.style.accentColor = primaryColor;
        controls.p.style.accentColor = primaryColor;
        controls.speed.style.accentColor = primaryColor;
        controls.lineWidth.style.accentColor = primaryColor;
        // Assuming buttons use --button-bg which is derived from --primary-color
        title.style.color = primaryColor;
        canvas.style.backgroundColor = backgroundColor; // Ensure canvas bg matches explicitly
    }

    // --- Animation Loop ---
    function animationLoop() {
        spirographInstance.step(); // Calculate next point
        spirographInstance.render(); // Draw the current state
        animationFrameId = requestAnimationFrame(animationLoop); // Request next frame
    }

    function startAnimationLoop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Cancel previous loop if any
        }
        animationLoop();
    }

    function stopAnimationLoop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // --- Page Visibility Handling ---
    function setupVisibilityHandling() {
         document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimationLoop();
            } else {
                startAnimationLoop(); // Resume animation
            }
        });
    }

    // --- Start the application ---
    initializeApp();

}); // End DOMContentLoaded