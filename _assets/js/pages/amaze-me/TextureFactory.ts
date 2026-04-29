import { CanvasTexture, LinearFilter } from 'three';

const PANEL_W = 960;
const PANEL_H = 560;
const FONT_TITLE = 'bold 38px "Courier New", Courier, monospace';
const FONT_LABEL = 'bold 22px "Courier New", Courier, monospace';
const FONT_BODY  = '20px "Courier New", Courier, monospace';
const COLOR_BRIGHT = '#ffffff';
const COLOR_DIM    = 'rgba(225, 228, 255, 0.92)';
const COLOR_BG     = 'rgba(6, 4, 20, 0.97)';

export interface SectionData {
    title: string;
    lines: string[];
    xPos: number;
}

export class TextureFactory {
    static createSectionTexture(title: string, lines: string[]): CanvasTexture {
        const canvas = document.createElement('canvas');
        canvas.width  = PANEL_W;
        canvas.height = PANEL_H;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, PANEL_W, PANEL_H);

        // Dark backing
        ctx.fillStyle = COLOR_BG;
        ctx.roundRect(0, 0, PANEL_W, PANEL_H, 6);
        ctx.fill();

        // Top-edge glow line
        const edgeGrad = ctx.createLinearGradient(0, 0, PANEL_W, 0);
        edgeGrad.addColorStop(0, 'rgba(129,140,248,0)');
        edgeGrad.addColorStop(0.4, 'rgba(129,140,248,0.9)');
        edgeGrad.addColorStop(0.6, 'rgba(129,140,248,0.9)');
        edgeGrad.addColorStop(1, 'rgba(129,140,248,0)');
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, PANEL_W, 2);

        // Corner brackets
        const bracketLen = 24;
        ctx.strokeStyle = COLOR_BRIGHT;
        ctx.lineWidth = 2;
        const corners: [number, number, number, number][] = [
            [0, 0, 1, 1], [PANEL_W, 0, -1, 1],
            [0, PANEL_H, 1, -1], [PANEL_W, PANEL_H, -1, -1],
        ];
        corners.forEach(([x, y, dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(x + dx * bracketLen, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + dy * bracketLen);
            ctx.stroke();
        });

        // Title
        ctx.fillStyle = COLOR_BRIGHT;
        ctx.font = FONT_TITLE;
        ctx.fillText(title, 44, 68);

        // Separator line
        ctx.fillStyle = 'rgba(129,140,248,0.28)';
        ctx.fillRect(44, 84, PANEL_W - 88, 1);

        // Content lines
        let y = 128;
        const lineHeight = 48;
        lines.forEach(line => {
            if (line.startsWith('#')) {
                ctx.font = FONT_LABEL;
                ctx.fillStyle = '#a5b4fc';
                ctx.fillText(line.slice(1), 44, y);
            } else if (line === '') {
                // skip — blank line spacing
            } else {
                ctx.font = FONT_BODY;
                ctx.fillStyle = COLOR_DIM;
                ctx.fillText(line, 44, y);
            }
            y += lineHeight;
        });

        const tex = new CanvasTexture(canvas);
        tex.minFilter = LinearFilter;
        tex.magFilter = LinearFilter;
        return tex;
    }
}
