import boardO from "./modules/Board.js";

const board = document.querySelector('.board');
const squareWidth = 70;
const squareAmount = 8;

let turn = 'W';

board.style.width = `${squareWidth * squareAmount}px`;
board.style.height = `${squareWidth * squareAmount}px`;

// 1. Create the board grid in the DOM
for (let r = 0; r < squareAmount; r++) {
    for (let c = 0; c < squareAmount; c++) {
        const node = document.createElement('div');
        node.style.width = `${squareWidth}px`;
        node.style.height = `${squareWidth}px`;
        node.classList.add('node');
        node.dataset.row = r;
        node.dataset.col = c;
        
        if ((r + c) % 2 === 0) {
            node.style.background = '#7B61FF';
        } else {
            node.style.background = '#E8EDF9';
        }

        board.appendChild(node);
    }
}

const Boardd = new boardO();

let start = null;
let legalMoves = [];
const isLegal = (row, col) => legalMoves.some(([r, c]) => r === row && c === col);

const clearHilight = () => {
    document.querySelectorAll('.legal-move').forEach((el) => {
        el.classList.remove('legal-move');
    });
};

// Clear check highlights from previous turns
const clearCheckHighlights = () => {
    document.querySelectorAll('.in-check').forEach((el) => {
        el.classList.remove('in-check');
    });
};

// Highlight the king in red if under check
const updateCheckStatus = () => {
    clearCheckHighlights();
    // Assumes Boardd has a method like findKing(turn) returning [row, col]
    if (typeof Boardd.findKing === 'function' && typeof Boardd.isInCheck === 'function') {
        if (Boardd.isInCheck(turn)) {
            const kingPos = Boardd.findKing(turn);
            if (kingPos) {
                const kingNode = document.querySelector(`[data-row='${kingPos[0]}'][data-col='${kingPos[1]}']`);
                if (kingNode) kingNode.classList.add('in-check');
            }
        }
    }
};

// Show Checkmate / Win Banner
const showGameOverBanner = (winner) => {
    let banner = document.querySelector('.game-over-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.classList.add('game-over-banner');
        document.body.appendChild(banner);
    }
    banner.textContent = `Checkmate! ${winner === 'W' ? 'White' : 'Black'} Wins!`;
    banner.style.display = 'block';
};

// Helper function to handle selecting a piece and highlighting its moves
const selectPiece = (r, c) => {
    if (Boardd.board[r][c] === '' || Boardd.board[r][c][0] !== turn) {
        start = null;
        clearHilight();
        return false;
    }

    start = [r, c];
    legalMoves = Boardd.getLegalMoves(start);
    clearHilight();
    
    legalMoves.forEach(([mr, mc]) => {
        const current = document.querySelector(`[data-row='${mr}'][data-col='${mc}']`);
        if (current) current.classList.add('legal-move');
    });
    
    return true;
};

// 2. Attach click listeners to all nodes
document.querySelectorAll('.node').forEach((node) => {
    node.addEventListener('click', (e) => {
        // Stop gameplay if checkmate condition is met
        if (typeof Boardd.isCheckmate === 'function' && Boardd.isCheckmate(turn)) return;

        const r = Number(e.currentTarget.dataset.row);
        const c = Number(e.currentTarget.dataset.col);

        if (start === null) {
            selectPiece(r, c);
        } else {
            if (isLegal(r, c)) {
                Boardd.move(start, [r, c]);
                
                // Switch turn
                turn = turn === 'W' ? 'B' : 'W';
                start = null;
                clearHilight();

                // Redraw board elements if your module supports it
                if (typeof Boardd.draw === 'function') Boardd.draw();

                // Check for check status or checkmate after the move
                updateCheckStatus();

                if (typeof Boardd.isCheckmate === 'function' && Boardd.isCheckmate(turn)) {
                    const winner = turn === 'W' ? 'B' : 'W';
                    showGameOverBanner(winner);
                }
            } else {
                const selectedSuccessfully = selectPiece(r, c);
                if (!selectedSuccessfully) {
                    start = null;
                    clearHilight();
                }
            }
        }
    });
});

Boardd.draw();
updateCheckStatus();