import { AmazeMeApp } from './AmazeMeApp';

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('am-canvas-wrapper');
    if (!wrapper) return;

    const app = new AmazeMeApp(wrapper);
    window.addEventListener('beforeunload', () => app.dispose(), { once: true });
});
