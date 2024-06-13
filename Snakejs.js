class Game {
    constructor(boardSize, speed) {
        this.boardSize = boardSize;
        this.speed = speed;
        this.currentScore = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.snake = [
            {
                x: Math.floor(boardSize / 2),
                y: Math.floor(boardSize / 2),
            }
        ];
        this.apple = {};
        this.direction = "right";
        this.gameOver = false;
        this.intervalId = null;
    }

    startGame() {
        const gameBoard = document.querySelector(".game-board");
        gameBoard.focus();
        this.createBoard();
        this.generateApple();
        this.intervalId = setInterval(() => this.moveSnake(), 1000 / this.speed);
        document.addEventListener('keydown', (e) => this.changeDirection(e));
        this.setupRestartButton()
        this.checkBestScore()
    }

    createBoard() {
        const gameBoard = document.querySelector(".game-board");
        gameBoard.innerHTML = '';
        for (let y = 0; y < this.boardSize; y++) {
            for (let x = 0; x < this.boardSize; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                gameBoard.appendChild(cell);
            }
        }
        this.drawSnake();
    }

    drawSnake() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.classList.remove('snake'));
        this.snake.forEach((segment) => {
            const index = segment.x + segment.y * this.boardSize;
            cells[index].classList.add("snake");
        });
    }

    generateApple() {
        let x;
        let y;
        const cells = document.querySelectorAll(".cell");
        if (this.apple.x != null && this.apple.y != null) {
            const index = this.apple.x + this.apple.y * this.boardSize;
            cells[index].classList.remove('apple');
        }
        do {
            x = Math.floor(Math.random() * this.boardSize);
            y = Math.floor(Math.random() * this.boardSize);
        } while (this.snake.some((segment) => segment.x === x && segment.y === y));
        this.apple = {
            x, y
        };
        const index = x + y * this.boardSize;
        cells[index].classList.add('apple');
    }
    

    moveSnake() {
        let head = {...this.snake[0]};
        switch (this.direction) {
            case "w":
                head.y--;
                break;
            case "a":
                head.x--;
                break;
            case "s":
                head.y++;
                break;
            case "d":
                head.x++;
                break;
        }
        if (head.x < 0) {
            head.x = this.boardSize - 1;
        }
        if (head.y < 0) {
            head.y = this.boardSize - 1;
        }
        if (head.x >= this.boardSize) {
            head.x = 0;
        }
        if (head.y >= this.boardSize) {
            head.y = 0;
        }

        this.snake.unshift(head);
        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.currentScore++;
            this.updateScore()
            this.generateApple();
        } else {
            this.snake.pop();
        }

        if (this.checkCollision()) {
            this.gameOver = true;
            clearInterval(this.intervalId);
            console.log('gameOver')
            this.showGameOverMessage()
            this.checkBestScore()
            this.setupRestartButton()
        } else {
            this.drawSnake();
        }
    }

    changeDirection(event) {
        if (!event) return false;
        const keyPressed = event.key.toLowerCase();
        const directions = ["w", "a", "s", "d"];
        if (directions.includes(keyPressed)) {
            const oppositeDirection = {
                ArrowUp: 'w',
                ArrowDown: 's',
                ArrowLeft: 'a',
                ArrowRight: 'd'
            };
            if (this.direction !== oppositeDirection[keyPressed]) {
                this.direction = keyPressed;
                return true;
            }
        }
        return false; 
    }

    checkCollision() {
        const head = this.snake[0];
        return this.snake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y )
    }

    updateScore() {
        const scoreElement = document.querySelector(".current-score");
        scoreElement.textContent = `Очки: ${this.currentScore}`
    }

    showGameOverMessage() {
        alert(`Игра окончена. Ваш счет ${this.currentScore}`)
    }

    checkBestScore() {
        if (this.currentScore > this.bestScore){
            this.bestScore = this.currentScore;
            localStorage.setItem("bestScore", this.bestScore)
        }
        const bestScoreElement = document.querySelector(".best-score")
        bestScoreElement.textContent = `Рекорд: ${this.bestScore}`
    }
    
    setupRestartButton() {
        const restartButton = document.querySelector(".restart-button")
        restartButton.addEventListener("click",() => window.location.reload())
    }
}

let game = new Game(10, 2);
game.startGame();
