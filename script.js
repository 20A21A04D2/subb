class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'twoPlayer'; // 'twoPlayer' or 'computer'
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
        this.loadScores();
    }
    
    bindEvents() {
        // Game board clicks
        document.getElementById('gameBoard').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.handleCellClick(e.target);
            }
        });
        
        // Mode selection
        document.getElementById('twoPlayerBtn').addEventListener('click', () => {
            this.setGameMode('twoPlayer');
        });
        
        document.getElementById('computerBtn').addEventListener('click', () => {
            this.setGameMode('computer');
        });
        
        // Control buttons
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Modal close
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal on background click
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') {
                this.closeModal();
            }
        });
    }
    
    handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'computer' && this.currentPlayer === 'O') {
            setTimeout(() => {
                this.makeComputerMove();
            }, 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        if (this.checkWinner()) {
            this.endGame(player);
        } else if (this.checkDraw()) {
            this.endGame('draw');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    makeComputerMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.getBestMove();
        this.makeMove(bestMove, 'O');
    }
    
    getBestMove() {
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Try to block player from winning
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available space
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                availableMoves.push(i);
            }
        }
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells(winningCondition) {
        winningCondition.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winning');
        });
    }
    
    endGame(result) {
        this.gameActive = false;
        
        if (result === 'draw') {
            this.scores.draw++;
            this.showModal('It\'s a Draw!', 'Nobody wins this round!');
        } else {
            this.scores[result]++;
            const winnerText = this.gameMode === 'computer' && result === 'O' ? 'Computer Wins!' : `Player ${result} Wins!`;
            this.showModal('Game Over!', winnerText);
        }
        
        this.updateScores();
        this.saveScores();
    }
    
    showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('gameModal').classList.add('show');
    }
    
    closeModal() {
        document.getElementById('gameModal').classList.remove('show');
        this.newGame();
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
        
        // Update button states
        document.getElementById('twoPlayerBtn').classList.toggle('active', mode === 'twoPlayer');
        document.getElementById('computerBtn').classList.toggle('active', mode === 'computer');
        
        // Update labels
        const playerOLabel = document.getElementById('playerOLabel');
        playerOLabel.textContent = mode === 'computer' ? 'Computer' : 'Player O';
        
        this.newGame();
    }
    
    resetGame() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScores();
        this.saveScores();
        this.newGame();
    }
    
    newGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear board display
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const currentPlayerText = document.getElementById('currentPlayerText');
        if (this.gameActive) {
            if (this.gameMode === 'computer' && this.currentPlayer === 'O') {
                currentPlayerText.textContent = 'Computer\'s Turn';
            } else {
                currentPlayerText.textContent = `Player ${this.currentPlayer}'s Turn`;
            }
        }
    }
    
    updateScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
        document.getElementById('scoreDraw').textContent = this.scores.draw;
    }
    
    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }
    
    loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
            this.updateScores();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});