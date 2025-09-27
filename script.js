const WALLPAPER_WIDTH = 1290;
const WALLPAPER_HEIGHT = 2796;

const wallpaperStyles = [
    {
        id: 'aurora-night',
        name: '极光夜行',
        baseColor: '#0f172a',
        defaultAccent: '#4fb1ff',
        description: '深蓝背景 + 柔和极光层次',
        draw(ctx, options) {
            const { accent, density } = options;
            fillBackground(ctx, this.baseColor);

            const waveLayers = 3 + Math.round(density / 20);
            for (let i = 0; i < waveLayers; i += 1) {
                const opacity = 0.4 - i * 0.06;
                const color = withAlpha(adjustLuminance(accent, i * 0.08), opacity);
                ctx.fillStyle = createVerticalGradient(ctx, color, this.baseColor, 0.18 + i * 0.1);
                ctx.beginPath();
                const radiusX = WALLPAPER_WIDTH * (0.85 + i * 0.08);
                const radiusY = WALLPAPER_HEIGHT * (0.35 + i * 0.08);
                ctx.ellipse(
                    WALLPAPER_WIDTH / 2,
                    WALLPAPER_HEIGHT * (0.42 + i * 0.07),
                    radiusX,
                    radiusY,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            const beamCount = 6 + Math.round(density / 25);
            const baseY = WALLPAPER_HEIGHT * 0.6;
            const beamHeight = WALLPAPER_HEIGHT * 0.55;
            for (let i = 0; i < beamCount; i += 1) {
                const alpha = 0.12 + (i % 2) * 0.05;
                ctx.fillStyle = withAlpha(adjustLuminance(accent, i * 0.05), alpha);
                const offset = (i - beamCount / 2) * (WALLPAPER_WIDTH / (beamCount * 1.4));
                ctx.beginPath();
                ctx.moveTo(WALLPAPER_WIDTH / 2 + offset, baseY);
                ctx.lineTo(WALLPAPER_WIDTH / 2 + offset + WALLPAPER_WIDTH * 0.05, baseY - beamHeight);
                ctx.lineTo(WALLPAPER_WIDTH / 2 + offset + WALLPAPER_WIDTH * 0.13, baseY - beamHeight);
                ctx.closePath();
                ctx.fill();
            }

            drawNoiseOverlay(ctx, withAlpha('#060f1f', 0.12), density * 2);
        },
    },
    {
        id: 'coral-dawn',
        name: '晨曦珊瑚',
        baseColor: '#ff7d65',
        defaultAccent: '#ffd2b1',
        description: '珊瑚底色 + 柔和波浪',
        draw(ctx, options) {
            const { accent, density } = options;
            fillBackground(ctx, this.baseColor);

            const lightTone = adjustLuminance(accent, 0.32);
            const softerTone = adjustLuminance(accent, 0.5);

            ctx.fillStyle = withAlpha(lightTone, 0.65);
            ctx.beginPath();
            ctx.moveTo(0, WALLPAPER_HEIGHT * 0.25);
            ctx.bezierCurveTo(
                WALLPAPER_WIDTH * 0.25,
                WALLPAPER_HEIGHT * 0.15,
                WALLPAPER_WIDTH * 0.4,
                WALLPAPER_HEIGHT * 0.35,
                WALLPAPER_WIDTH,
                WALLPAPER_HEIGHT * 0.28
            );
            ctx.lineTo(WALLPAPER_WIDTH, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = withAlpha(softerTone, 0.55);
            ctx.beginPath();
            ctx.moveTo(0, WALLPAPER_HEIGHT * 0.52);
            ctx.bezierCurveTo(
                WALLPAPER_WIDTH * 0.2,
                WALLPAPER_HEIGHT * 0.45,
                WALLPAPER_WIDTH * 0.52,
                WALLPAPER_HEIGHT * 0.63,
                WALLPAPER_WIDTH,
                WALLPAPER_HEIGHT * 0.58
            );
            ctx.lineTo(WALLPAPER_WIDTH, WALLPAPER_HEIGHT * 0.32);
            ctx.lineTo(0, WALLPAPER_HEIGHT * 0.36);
            ctx.closePath();
            ctx.fill();

            const circleCount = 4 + Math.round(density / 30);
            const baseRadius = WALLPAPER_WIDTH * 0.18;
            for (let i = 0; i < circleCount; i += 1) {
                const radius = baseRadius + i * 40;
                const alpha = 0.12 + i * 0.04;
                ctx.strokeStyle = withAlpha(adjustLuminance(accent, -0.15 + i * 0.04), alpha);
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(WALLPAPER_WIDTH * 0.3, WALLPAPER_HEIGHT * 0.72, radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            drawNoiseOverlay(ctx, withAlpha('#5e2c27', 0.12), density * 1.5);
        },
    },
    {
        id: 'neon-flow',
        name: '摩登霓虹',
        baseColor: '#221835',
        defaultAccent: '#8f7dff',
        description: '紫夜背景 + 斜向光束',
        draw(ctx, options) {
            const { accent, density } = options;
            fillBackground(ctx, this.baseColor);

            const gradient = ctx.createLinearGradient(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
            gradient.addColorStop(0, withAlpha(adjustLuminance(accent, 0.4), 0.35));
            gradient.addColorStop(1, withAlpha('#000000', 0.05));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);

            const stripeCount = 6 + Math.round(density / 12);
            const stripeWidth = WALLPAPER_WIDTH * 0.32;
            for (let i = -2; i < stripeCount; i += 1) {
                const startX = -WALLPAPER_WIDTH * 0.7 + i * (stripeWidth * 0.45);
                const alpha = 0.18 + ((i % 3) * 0.06);
                ctx.fillStyle = withAlpha(adjustLuminance(accent, i * 0.03), alpha);
                ctx.beginPath();
                ctx.moveTo(startX, WALLPAPER_HEIGHT);
                ctx.lineTo(startX + stripeWidth, WALLPAPER_HEIGHT);
                ctx.lineTo(startX + stripeWidth * 1.35, 0);
                ctx.lineTo(startX + stripeWidth * 0.35, 0);
                ctx.closePath();
                ctx.fill();
            }

            const haloRadius = WALLPAPER_WIDTH * 0.38;
            const haloGradient = ctx.createRadialGradient(
                WALLPAPER_WIDTH * 0.78,
                WALLPAPER_HEIGHT * 0.24,
                haloRadius * 0.2,
                WALLPAPER_WIDTH * 0.78,
                WALLPAPER_HEIGHT * 0.24,
                haloRadius
            );
            haloGradient.addColorStop(0, withAlpha(adjustLuminance(accent, 0.2), 0.8));
            haloGradient.addColorStop(1, withAlpha('#221835', 0));
            ctx.fillStyle = haloGradient;
            ctx.beginPath();
            ctx.arc(WALLPAPER_WIDTH * 0.78, WALLPAPER_HEIGHT * 0.24, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            drawNoiseOverlay(ctx, withAlpha('#120c1f', 0.2), density * 2.3);
        },
    },
    {
        id: 'mint-haze',
        name: '薄雾薄荷',
        baseColor: '#dff3ed',
        defaultAccent: '#7ad8c5',
        description: '浅薄荷底 + 半透明光晕',
        draw(ctx, options) {
            const { accent, density } = options;
            fillBackground(ctx, this.baseColor);

            const bubbleCount = 4 + Math.round(density / 25);
            for (let i = 0; i < bubbleCount; i += 1) {
                const radius = WALLPAPER_WIDTH * (0.22 + i * 0.06);
                const centerX = WALLPAPER_WIDTH * (0.3 + i * 0.14);
                const centerY = WALLPAPER_HEIGHT * (0.35 + i * 0.08);
                const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.35, centerX, centerY, radius);
                gradient.addColorStop(0, withAlpha(adjustLuminance(accent, i * 0.08), 0.55));
                gradient.addColorStop(1, withAlpha('#dff3ed', 0));
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            const bandCount = 2 + Math.round(density / 40);
            for (let i = 0; i < bandCount; i += 1) {
                const alpha = 0.28 - i * 0.08;
                ctx.fillStyle = withAlpha(adjustLuminance(accent, i * 0.06 - 0.1), alpha);
                ctx.beginPath();
                const startY = WALLPAPER_HEIGHT * (0.6 + i * 0.08);
                ctx.moveTo(0, startY);
                ctx.bezierCurveTo(
                    WALLPAPER_WIDTH * 0.28,
                    startY - WALLPAPER_HEIGHT * 0.08,
                    WALLPAPER_WIDTH * 0.55,
                    startY + WALLPAPER_HEIGHT * 0.05,
                    WALLPAPER_WIDTH,
                    startY - WALLPAPER_HEIGHT * 0.02
                );
                ctx.lineTo(WALLPAPER_WIDTH, startY + WALLPAPER_HEIGHT * 0.2);
                ctx.lineTo(0, startY + WALLPAPER_HEIGHT * 0.12);
                ctx.closePath();
                ctx.fill();
            }

            drawNoiseOverlay(ctx, withAlpha('#a1c8c3', 0.12), density);
        },
    },
];

function fillBackground(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
}

function adjustLuminance(hexColor, amount) {
    const { r, g, b } = hexToRgb(hexColor);
    const factor = Math.max(-1, Math.min(1, amount));
    const target = factor < 0 ? 0 : 255;
    const ratio = Math.abs(factor);
    const mix = (channel) => Math.round(channel + (target - channel) * ratio);
    return rgbToHex({ r: mix(r), g: mix(g), b: mix(b) });
}

function withAlpha(hexColor, alpha) {
    const { r, g, b } = hexToRgb(hexColor);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function createVerticalGradient(ctx, colorA, colorB, ratio) {
    const gradient = ctx.createLinearGradient(0, 0, 0, WALLPAPER_HEIGHT);
    gradient.addColorStop(0, withAlpha(colorA, 0.85));
    gradient.addColorStop(1, withAlpha(colorB, Math.max(0.08, ratio)));
    return gradient;
}

function drawNoiseOverlay(ctx, color, density) {
    const count = Math.round(800 + density * 6);
    ctx.fillStyle = color;
    for (let i = 0; i < count; i += 1) {
        const x = Math.random() * WALLPAPER_WIDTH;
        const y = Math.random() * WALLPAPER_HEIGHT;
        const size = Math.random() * 2.2 + 0.4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const value = normalized.length === 3
        ? normalized.split('').map((c) => c + c).join('')
        : normalized;
    const intValue = parseInt(value, 16);
    return {
        r: (intValue >> 16) & 255,
        g: (intValue >> 8) & 255,
        b: intValue & 255,
    };
}

function componentToHex(component) {
    const hex = component.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex({ r, g, b }) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function getAccentColor(style, useCustom, customColor) {
    if (!useCustom) return style.defaultAccent;
    return customColor;
}

function renderWallpaper(style, canvas, options) {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
    style.draw(ctx, options);
    ctx.restore();
}

function renderAll(styles, canvases, settings) {
    const { useCustomAccent, customAccent, density } = settings;
    styles.forEach((style) => {
        const canvas = canvases.get(style.id);
        if (!canvas) return;
        const accent = getAccentColor(style, useCustomAccent, customAccent);
        renderWallpaper(style, canvas, { accent, density });
    });
}

function handleDownload(canvas, filename) {
    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

function updateTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
}

function init() {
    const densityInput = document.getElementById('detail-density');
    const densityValue = document.getElementById('detail-density-value');
    const accentInput = document.getElementById('accent-color');
    const customAccentToggle = document.getElementById('use-custom-accent');
    const themeButtons = document.querySelectorAll('.theme-switcher__button');
    const canvases = new Map();
    const downloadButtons = document.querySelectorAll('.card__download');

    wallpaperStyles.forEach((style) => {
        const card = document.querySelector(`.card[data-style="${style.id}"]`);
        if (!card) return;
        const canvas = card.querySelector('canvas');
        canvas.width = WALLPAPER_WIDTH;
        canvas.height = WALLPAPER_HEIGHT;
        canvases.set(style.id, canvas);
    });

    const settings = {
        density: parseInt(densityInput.value, 10),
        customAccent: accentInput.value,
        useCustomAccent: customAccentToggle.checked,
    };

    renderAll(wallpaperStyles, canvases, settings);

    densityInput.addEventListener('input', () => {
        settings.density = parseInt(densityInput.value, 10);
        densityValue.textContent = `${settings.density}%`;
        renderAll(wallpaperStyles, canvases, settings);
    });

    accentInput.addEventListener('input', () => {
        settings.customAccent = accentInput.value;
        if (!settings.useCustomAccent) {
            densityValue.textContent = `${settings.density}%`;
        }
        renderAll(wallpaperStyles, canvases, settings);
    });

    customAccentToggle.addEventListener('change', () => {
        settings.useCustomAccent = customAccentToggle.checked;
        renderAll(wallpaperStyles, canvases, settings);
    });

    themeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            themeButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });
            updateTheme(theme);
        });
    });

    downloadButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const styleId = button.getAttribute('data-download');
            const canvas = canvases.get(styleId);
            if (!canvas) return;
            handleDownload(canvas, `${styleId}-iphone16pro`);
        });
    });
}

document.addEventListener('DOMContentLoaded', init);
