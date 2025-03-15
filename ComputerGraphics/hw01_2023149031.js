// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Set canvas size: 현재 window 전체를 canvas로 사용
canvas.width = 500;
canvas.height = 500;

// Initialize WebGL settings: viewport and clear color



// Start rendering
gl.enable(gl.SCISSOR_TEST);
render();

// Render loop
function render() {
    
    
    gl.viewport(0, canvas.height/2, canvas.width/2, canvas.height/2); 
    gl.scissor(0, canvas.height/2, canvas.width/2, canvas.height/2); 
    gl.clearColor(1, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
    gl.scissor(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
    gl.clearColor(0, 1, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width/2, canvas.height/2);
    gl.scissor(0, 0, canvas.width/2, canvas.height/2);
    gl.clearColor(0, 0, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height/2);
    gl.scissor(canvas.width/2, 0, canvas.width/2, canvas.height/2);
    gl.clearColor(1, 1, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
     
    // Draw something here
}

// Resize viewport when window size changes
window.addEventListener('resize', () => {
    CanvSize = Math.min(window.innerWidth, window.innerHeight)
    canvas.width = CanvSize;
    canvas.height = CanvSize;
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
});

