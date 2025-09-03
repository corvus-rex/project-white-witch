import './style-grid.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {Greet} from '../wailsjs/go/main/App';

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
let dragTimeout = null;

function paintCell(el) {
    if (el && el.classList && el.classList.contains('cell')) {
    // Toggle between cyan and white
    if (el.style.backgroundColor === 'red') {
        el.style.backgroundColor = 'white';
    } else {
        el.style.backgroundColor = 'red';
    }
    }
}

grid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left click
    lastCell = e.target;
    paintCell(e.target);
    // Start a timeout: only after 1000 ms does drag become active
    dragTimeout = setTimeout(() => {
    dragging = true;
    }, 5000);
    e.preventDefault();
});

document.addEventListener('mouseup', () => {
    dragging = false;
    lastCell = null;
    if (dragTimeout) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
    }
});

grid.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    if (e.target !== lastCell) {
    paintCell(e.target);
    lastCell = e.target;
    }
});

grid.addEventListener('mouseenter', (e) => {
    if (e.buttons === 1 && dragging) dragging = true;
});
grid.addEventListener('mouseleave', (e) => {
    if (e.buttons === 0) dragging = false;
});

// Touch support
grid.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    lastCell = el;
    paintCell(el);
    dragTimeout = setTimeout(() => {
    dragging = true;
    }, 5000);
    e.preventDefault();
}, { passive: false });

grid.addEventListener('touchmove', (e) => {
    if (!dragging) return;
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
    if (dragTimeout) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
    }
});