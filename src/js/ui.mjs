class SplitterBar {
    constructor(container, left, right, divider) {
        this.container = container;
        this.left = left;
        this.right = right;
        this.divider = divider;

        this.init();
    }

    init() {
        this.divider.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', () => this.onMouseUp());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.isDragging = false;
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.container.classList.add('isDragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    onMouseUp() {
        this.container.classList.remove('isDragging');
        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const containerRect = this.container.getBoundingClientRect();
        const minLeft = 100;
        const maxLeft = containerRect.width - 100;

        let newLeftWidth = e.clientX - containerRect.left;
        newLeftWidth = Math.max(minLeft, Math.min(newLeftWidth, maxLeft));
        newLeftWidth = newLeftWidth / containerRect.width * 100;

        this.container.style.setProperty('--middle', `${newLeftWidth}%`);
    }
}

export default function initUI() {
    window.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('main');
        const left = document.getElementById('html');
        const right = document.getElementById('code');
        const divider = document.getElementById('divider');

        new SplitterBar(container, left, right, divider);
    });
}