function TicTacToe(size = 3) {
    if (!new.target) throw Error("Constructor called without 'new' keyword");

    this.size = size;
    this.grid = [];
    this.win_condition = 'N/A';

    (() => {
        for (let i = 0; i < this.size; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.size; j++) this.grid[i].push(' ');
        }
    })();

    this.display = function() {
        let string = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) string += this.grid[i][j];
            string += '\n';
        }
        console.log(string);
    }

    this.winConditions = {
        row: (row, col, mark) => {
            let win = true;
            for (let j = 0; j < this.size; j++) {
                if (this.grid[row][j] !== mark) {
                    win = false;
                    break;
                }
            }
            return win;
        },

        column: (row, col, mark) => {
            let win = true;
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][col] !== mark) {
                    win = false;
                    break;
                }
            }
            return win;
        },
        
        downwardDiagonal: (row, col, mark) => {
            if (row !== col) return false;

            let win = true;
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][i] !== mark) {
                    win = false;
                    break;
                }
            }
            return win;
        },

        upwardDiagonal: (row, col, mark) => {
            if (row !== (this.size - 1) - col) return false;

            let win = true;
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][(this.size - 1) - i] !== mark) {
                    win = false;
                    break;
                }
            }
            return win;
        }
    }

    this.mark = function(row, col, mark) {
        if (this.grid[row][col] !== ' ') return false;

        this.grid[row][col] = mark;
        
        for (const winCondition in this.winConditions) {
            if (this.winConditions[winCondition](row, col, mark)) {
                this.win_condition = winCondition
                return true;
            }
        }
        return false;
    }

    this.handleWin = function(mark) {
        console.log(mark + ' won!');
    }
}

function Game(size = 3, players = ['X', 'O']) {
    if (!new.target) throw Error("Constructor called without 'new' keyword");

    this.no_players = players.length;
    this.players = players;
    this.current_turn = 0;

    this.tictactoe = new TicTacToe(size);
    
    (() => {

    })();

    this.play = function(row, col) {
        // Current player chooses row and column
        const win = this.tictactoe.mark(row, col, this.players[this.current_turn]);
        // Next player's turn
        this.current_turn = (this.current_turn + 1) % this.no_players;
        return win;
    }

    this.getCurrentPlayer = function() {
        return this.players[this.current_turn];
    }

    this.getLastPlayer = function() {
        let last_turn = this.current_turn - 1;
        if (last_turn === -1) last_turn = this.no_players - 1; 
        return this.players[last_turn];
    }

    this.getSize = function() {
        return this.tictactoe.size;
    }

    this.getWinCondition = function() {
        return this.tictactoe.win_condition;
    }
}

function Controller(size = 3, players = ['X', 'O']) {
    if (!new.target) throw Error("Constructor called without 'new' keyword");

    this.size = size;
    this.player_display = null;
    this.board = null;
    this.buttons = [];
    this.game = new Game(size, players);

    this.updatePlayerDisplay = function() {
        this.player_display.textContent = `Current player: ${this.game.getCurrentPlayer()}`;
    },

    this.play = function(button, row, col) {
        button.textContent = this.game.getCurrentPlayer();
        button.disabled = true;
        const win = this.game.play(row, col);
        if (win) {
            this.handleWin();
            return;
        }
        this.updatePlayerDisplay();
    },

    this.setWinMessage = function(winner, win_cond) {
        this.player_display.textContent = `${winner} won by ${win_cond}`;
    },

    this.handleWin = function() {
        this.setWinMessage(this.game.getLastPlayer(), this.game.getWinCondition());
        for (let i = 0; i < this.game.getSize(); i++) {
            for (let j = 0; j < this.game.getSize(); j++) {
                this.buttons[i][j].disabled = true;
            }
        }
    },
    
    (() => {
        this.player_display = document.getElementById('current-player');
        this.board = document.getElementById('board');
        this.win_message = document.getElementById('win-message');

        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        for (let i = 0; i < this.game.getSize(); i++) {
            this.buttons.push([]);
            for (let j = 0; j < this.game.getSize(); j++) {
                const button = document.createElement('button');
                button.onclick = () => { this.play(button, i, j) };
                this.buttons[i].push(button);
                this.board.append(button);
            }
        }

        this.updatePlayerDisplay();
    })();
}

const controller = new Controller(3, ['X', 'O']);
