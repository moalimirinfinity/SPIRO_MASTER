# Spirograph Animation Master

![Spirograph Demo GIF](https://moalimirinfinity.github.io/SPIRO_MASTER/) A hypnotic Spirograph pattern generator built with pure JavaScript and HTML5 Canvas. This project creates intricate, beautiful patterns inspired by the classic toy, featuring real-time animation, interactive controls, visual customization, and export functionality.

---

## 🌐 Live Demo

Experience it live: [Spirograph Animation Demo](https://moalimirinfinity.github.io/Spirograph-Animation/)

*(Note: This link points to the original demo. Update it if you host the refactored version elsewhere.)*

---

## ✨ Features

* **Real-Time Animation:** Smoothly animates the drawing of Spirograph patterns using `requestAnimationFrame`.
* **Interactive Controls:** Fine-tune the pattern generation with sliders:
    * **R:** Radius of the large fixed circle.
    * **r:** Radius of the small rolling circle.
    * **p:** Distance of the drawing point from the center of the small circle.
    * **Speed:** Controls the animation speed.
    * **Width:** Adjusts the thickness of the drawing line.
* **Visual Customization:**
    * **Line Color:** Choose any color for the Spirograph line.
    * **Background Color:** Set a custom background color for the canvas.
    * **Fading Trail:** Toggle a dynamic effect where older lines gradually fade.
    * **Show Guides:** Optionally display the underlying construction circles and lines used to draw the pattern.
* **Presets:** Quickly load predefined parameter sets to create specific patterns like "Flower", "Star", "Web", and "Loops".
* **Glow Effect:** Lines feature a subtle glow effect for enhanced visuals.
* **Export:** Save your creation as a PNG image file with a single click.
* **Responsive Design:** Adapts to different screen sizes with a clean, dark-themed layout.
* **Modular Code:** Refactored using ES6 Modules for better organization and maintainability.

---

## 🛠️ Technologies Used

* HTML5
* CSS3 (including CSS Variables for theming)
* JavaScript (ES6 Modules, Canvas API, `requestAnimationFrame`)

---

## 🚀 Setup & Usage

**To run the project locally:**

1.  **Clone or Download:** Get the project files:
    ```bash
    git clone [https://github.com/your-username/Spirograph-Animation.git](https://www.google.com/search?q=https://github.com/your-username/Spirograph-Animation.git)
    # Or download the ZIP and extract it
    ```
2.  **Navigate:** Open the project directory:
    ```bash
    cd Spirograph-Animation
    ```
3.  **Open:** Simply open the `index.html` file in your web browser.

**How to use:**

1.  The Spirograph animation will start automatically.
2.  Use the sliders and controls on the page to modify the pattern's parameters (R, r, p, speed, line width).
3.  Change the line and background colors using the color pickers.
4.  Toggle the "Trail" and "Guides" checkboxes to change visual effects.
5.  Select a "Preset" from the dropdown to load predefined settings.
6.  Click "Reset" to clear the current drawing (it keeps the current parameters).
7.  Click "Export" to download the current canvas drawing as a PNG file.

---

## 📁 Code Structure

The project uses ES6 Modules and is organized as follows:

* `index.html`: The main HTML file defining the page structure, canvas, and controls.
* `style.css`: Contains all the styles for layout, theming, and responsiveness.
* `config.js`: Exports default parameters and preset configurations.
* `spirograph.js`: Defines the `Spirograph` class, responsible for calculations, drawing logic, and managing the animation state.
* `main.js`: Initializes the application, handles user interactions (event listeners), updates the UI, manages the animation loop, and connects the UI controls to the `Spirograph` instance.

---
