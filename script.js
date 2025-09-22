const GRID_SIZE = 20;
const CELL_SIZE = 20;
const BOARD_PIXEL_SIZE = GRID_SIZE * CELL_SIZE;
const MOVE_INTERVAL_MS = 150;
const STORAGE_KEY = 'snake-high-score';

const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

const GameState = Object.freeze({
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused',
    ENDED: 'ended',
});

/**
 * 负责游戏的初始化、更新循环和渲染。
 */
const SnakeGame = (() => {
    let canvas;
    let ctx;
    let state = GameState.IDLE;
    let loopId = null;
    let snake = [];
    let directionQueue = [];
    let currentDirection = DIRECTIONS.right;
    let food = null;
    let score = 0;
    let highScore = 0;

    const ui = {};

    function init() {
        cacheElements();
        setupCanvas();
        bindEvents();
        highScore = loadHighScore();
        ui.highScore.textContent = highScore;
        resetGame();
    }

    function cacheElements() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        ui.score = document.getElementById('score');
        ui.highScore = document.getElementById('high-score');
        ui.status = document.getElementById('status-message');
        ui.startPause = document.getElementById('start-pause');
        ui.overlay = document.getElementById('overlay');
        ui.overlayScore = document.getElementById('overlay-score');
        ui.overlayHighScore = document.getElementById('overlay-high-score');
        ui.restart = document.getElementById('restart-button');
        ui.directionButtons = Array.from(
            document.querySelectorAll('.direction-pad__button')
        );
    }

    function setupCanvas() {
        canvas.width = BOARD_PIXEL_SIZE;
        canvas.height = BOARD_PIXEL_SIZE;
        ctx.imageSmoothingEnabled = false;
    }

    function bindEvents() {
        document.addEventListener('keydown', handleKeyDown);
        ui.startPause.addEventListener('click', handleStartPauseClick);
        ui.restart.addEventListener('click', restartGame);
        ui.directionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const dir = button.dataset.direction;
                queueDirectionChange(DIRECTIONS[dir]);
                if (state === GameState.IDLE) {
                    startGame();
                }
            });
        });
    }

    function handleKeyDown(event) {
        const keyMap = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right',
            w: 'up',
            s: 'down',
            a: 'left',
            d: 'right',
        };

        const directionKey = keyMap[event.key];
        if (!directionKey) {
            if (event.key === ' ') {
                event.preventDefault();
                togglePause();
            }
            return;
        }

        event.preventDefault();
        queueDirectionChange(DIRECTIONS[directionKey]);
        if (state === GameState.IDLE) {
            startGame();
        }
    }

    function handleStartPauseClick() {
        if (state === GameState.RUNNING) {
            pauseGame();
        } else if (state === GameState.PAUSED) {
            resumeGame();
        } else if (state === GameState.IDLE) {
            startGame();
        } else if (state === GameState.ENDED) {
            restartGame();
        }
    }

    function queueDirectionChange(nextDirection) {
        if (!nextDirection) return;

        const lastDirection = directionQueue.length
            ? directionQueue[directionQueue.length - 1]
            : currentDirection;

        if (isOppositeDirection(lastDirection, nextDirection)) {
            return;
        }

        directionQueue.push(nextDirection);
    }

    function isOppositeDirection(dirA, dirB) {
        return dirA.x + dirB.x === 0 && dirA.y + dirB.y === 0;
    }

    function startGame() {
        if (state === GameState.RUNNING) return;
        if (state === GameState.ENDED) {
            resetGame();
        }
        state = GameState.RUNNING;
        ui.status.textContent = '游戏进行中，注意避开自己的身体和边界。';
        ui.startPause.textContent = '暂停';
        ui.overlay.hidden = true;
        ui.startPause.disabled = false;
        beginLoop();
    }

    function pauseGame() {
        if (state !== GameState.RUNNING) return;
        state = GameState.PAUSED;
        ui.status.textContent = '已暂停，点击“继续”或按空格键恢复。';
        ui.startPause.textContent = '继续';
        stopLoop();
    }

    function resumeGame() {
        if (state !== GameState.PAUSED) return;
        state = GameState.RUNNING;
        ui.status.textContent = '游戏继续，加油！';
        ui.startPause.textContent = '暂停';
        beginLoop();
    }

    function togglePause() {
        if (state === GameState.RUNNING) {
            pauseGame();
        } else if (state === GameState.PAUSED) {
            resumeGame();
        } else if (state === GameState.IDLE) {
            startGame();
        }
    }

    function restartGame() {
        stopLoop();
        resetGame();
        startGame();
    }

    function resetGame() {
        stopLoop();
        state = GameState.IDLE;
        const startX = Math.floor(GRID_SIZE / 2) - 1;
        const startY = Math.floor(GRID_SIZE / 2);
        snake = [
            { x: startX - 1, y: startY },
            { x: startX, y: startY },
            { x: startX + 1, y: startY },
        ];
        currentDirection = DIRECTIONS.right;
        directionQueue = [];
        food = spawnFood();
        score = 0;
        updateScore();
        ui.status.textContent = '点击“开始游戏”或按任意方向键启动。';
        ui.startPause.textContent = '开始游戏';
        ui.overlay.hidden = true;
        render();
    }

    function beginLoop() {
        stopLoop();
        loopId = window.setInterval(() => {
            step();
            render();
        }, MOVE_INTERVAL_MS);
    }

    function stopLoop() {
        if (loopId !== null) {
            window.clearInterval(loopId);
            loopId = null;
        }
    }

    function step() {
        if (directionQueue.length) {
            currentDirection = directionQueue.shift();
        }

        const newHead = {
            x: snake[snake.length - 1].x + currentDirection.x,
            y: snake[snake.length - 1].y + currentDirection.y,
        };

        if (isCollision(newHead)) {
            endGame();
            return;
        }

        snake.push(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            updateScore();
            food = spawnFood();
        } else {
            snake.shift();
        }
    }

    function isCollision(position) {
        if (
            position.x < 0 ||
            position.x >= GRID_SIZE ||
            position.y < 0 ||
            position.y >= GRID_SIZE
        ) {
            return true;
        }

        return snake.some((segment) => segment.x === position.x && segment.y === position.y);
    }

    function spawnFood() {
        let candidate;
        do {
            candidate = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));
        return candidate;
    }

    function endGame() {
        stopLoop();
        state = GameState.ENDED;
        ui.status.textContent = '游戏结束，点击“重新开始”再来一局。';
        ui.startPause.textContent = '重新开始';
        ui.overlay.hidden = false;
        ui.overlayScore.textContent = `本局得分：${score}`;
        updateHighScore(score);
        ui.overlayHighScore.textContent = `最高分：${highScore}`;
    }

    function updateScore() {
        ui.score.textContent = score;
        if (score > highScore) {
            highScore = score;
            ui.highScore.textContent = highScore;
            saveHighScore(highScore);
        }
    }

    function loadHighScore() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value ? Number.parseInt(value, 10) || 0 : 0;
        } catch (error) {
            console.warn('无法读取最高分：', error);
            return 0;
        }
    }

    function saveHighScore(value) {
        try {
            localStorage.setItem(STORAGE_KEY, String(value));
        } catch (error) {
            console.warn('无法写入最高分：', error);
        }
    }

    function updateHighScore(currentScore) {
        if (currentScore > highScore) {
            highScore = currentScore;
            ui.highScore.textContent = highScore;
            saveHighScore(highScore);
        }
    }

    function render() {
        ctx.clearRect(0, 0, BOARD_PIXEL_SIZE, BOARD_PIXEL_SIZE);
        drawGrid();
        drawSnake();
        drawFood();
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i += 1) {
            const offset = i * CELL_SIZE + 0.5;
            ctx.beginPath();
            ctx.moveTo(offset, 0);
            ctx.lineTo(offset, BOARD_PIXEL_SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, offset);
            ctx.lineTo(BOARD_PIXEL_SIZE, offset);
            ctx.stroke();
        }
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            const x = segment.x * CELL_SIZE;
            const y = segment.y * CELL_SIZE;
            const isHead = index === snake.length - 1;
            ctx.fillStyle = isHead ? '#38bdf8' : '#0ea5e9';
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

            if (isHead) {
                ctx.fillStyle = '#082f49';
                const eyeSize = 4;
                const padding = 4;
                if (currentDirection.x !== 0) {
                    ctx.fillRect(x + padding, y + padding, eyeSize, eyeSize);
                    ctx.fillRect(x + padding, y + CELL_SIZE - eyeSize - padding, eyeSize, eyeSize);
                } else {
                    ctx.fillRect(x + padding, y + padding, eyeSize, eyeSize);
                    ctx.fillRect(x + CELL_SIZE - eyeSize - padding, y + padding, eyeSize, eyeSize);
                }
            }
        });
    }

    function drawFood() {
        if (!food) return;
        const x = food.x * CELL_SIZE;
        const y = food.y * CELL_SIZE;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
    SnakeGame.init();
});
