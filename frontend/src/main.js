import './style-grid.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {Greet} from '../wailsjs/go/main/App';

// Build the 3x6 grid of cells
// Build the 3x6 grid of cells

const rows = 3, cols = 6;
const grid = document.getElementById('grid');

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
    const d = document.createElement('div');
    d.className = 'cell';
    d.setAttribute('role', 'gridcell');
    d.dataset.r = r;
    d.dataset.c = c;
    grid.appendChild(d);
    }
}

let dragging = false;
let lastCell = null;

function paintCell(el) {
    if (el && el.classList && el.classList.contains('cell')) {
    // Toggle between cyan and white
    if (el.style.backgroundColor === 'cyan') {
        el.style.backgroundColor = 'white';
    } else {
        el.style.backgroundColor = 'cyan';
    }
    }
}

// Mouse interactions: click + drag to paint
grid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left click
    dragging = true;
    lastCell = e.target;
    paintCell(e.target);
    e.preventDefault();
});

document.addEventListener('mouseup', () => { 
    dragging = false; 
    lastCell = null;
});

grid.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    if (e.target !== lastCell) {
    paintCell(e.target);
    lastCell = e.target;
    }
});

// If the user re-enters the grid with the mouse button held, keep painting
grid.addEventListener('mouseenter', (e) => {
    if (e.buttons === 1) dragging = true;
});
grid.addEventListener('mouseleave', (e) => {
    if (e.buttons === 0) dragging = false;
});

// Optional: basic touch support (tap-drag to paint)
grid.addEventListener('touchstart', (e) => {
    dragging = true;
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    lastCell = el;
    paintCell(el);
    e.preventDefault();
}, { passive: false });

grid.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    if (el !== lastCell) {
    paintCell(el);
    lastCell = el;
    }
    e.preventDefault();
}, { passive: false });

grid.addEventListener('touchend', () => { 
    dragging = false; 
    lastCell = null;
});