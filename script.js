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

// Helper function to handle selecting a piece and highlighting its moves
const selectPiece = (r, c) => {
    // Check if the square is empty or belongs to the opponent
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

// 2. Attach click listeners to all nodes using correct row/col attributes
document.querySelectorAll('.node').forEach((node) => {
    node.addEventListener('click', (e) => {
        const r = Number(e.currentTarget.dataset.row);
        const c = Number(e.currentTarget.dataset.col);

        if (start === null) {
            // No piece selected yet; try selecting this one
            selectPiece(r, c);
        } else {
            // Piece already selected; check if click is a legal move destination
            if (isLegal(r, c)) {
                Boardd.move(start, [r, c]);
                turn = turn === 'W' ? 'B' : 'W';
                start = null;
                clearHilight();
            } else {
                // Clicked an illegal destination; treat it as trying to select a new piece instead
                const selectedSuccessfully = selectPiece(r, c);
                if (!selectedSuccessfully) {
                    start = null;
                    clearHilight();
                }
            }
        }
        console.log("Current start:", start, "Turn:", turn);
    });
});

Boardd.draw();