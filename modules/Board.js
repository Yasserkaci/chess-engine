export default function board(){
    this.board = [
        ['BR','BKN','BB','BQ','BK','BB','BKN','BR'],
        ['BP','BP','BP','BP','BP','BP','BP','BP'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['WP','WP','WP','WP','WP','WP','WP','WP'],
        ['WR','WKN','WB','WQ','WK','WB','WKN','WR'],
    ];

    this.castlingRights = {
        W: { k: true, q: true },
        B: { k: true, q: true }
    };
    this.enPassantTarget = null; // Stores [row, col] of the target square

    const inBound = (r, c) => r > -1 && r < 8 && c > -1 && c < 8 

    const slide = (row, col, directions, color) => {
        let moves = []
        for(const [dr, dc] of directions){
            let r = row + dr
            let c = col + dc
            while(inBound(r, c)){
                const target = this.board[r][c]
                if(target === ''){
                    moves.push([r, c])
                } else {
                    if(target[0] !== color){
                        moves.push([r, c])
                        break
                    } else {
                        break
                    }
                }
                r += dr
                c += dc
            } 
        }
        return moves
    }

    this.isSquareUnderAttack = function(square, defenderColor){
        const [targetR, targetC] = square
        const attackerColor = defenderColor === 'W' ? 'B' : 'W'

        for(let r = 0; r < 8; r++){
            for(let c = 0; c < 8; c++){
                const piece = this.board[r][c]
                if(piece !== '' && piece[0] === attackerColor){
                    const type = piece.slice(1)
                    let attacks = []

                    if(type === 'P'){
                        const dir = attackerColor === 'W' ? -1 : 1
                        if(r + dir === targetR && (c - 1 === targetC || c + 1 === targetC)){
                            return true
                        }
                    } else if(type === 'R'){
                        attacks = slide(r, c, [[1,0],[-1,0],[0,1],[0,-1]], attackerColor)
                    } else if(type === 'B'){
                        attacks = slide(r, c, [[1,1],[-1,1],[1,-1],[-1,-1]], attackerColor)
                    } else if(type === 'Q'){
                        attacks = slide(r, c, [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], attackerColor)
                    } else if(type === 'KN'){
                        const dir = [[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]
                        for(const [dr, dc] of dir){
                            if(r + dr === targetR && c + dc === targetC) return true
                        }
                    } else if(type === 'K'){
                        const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
                        for(const [dr, dc] of dir){
                            if(r + dr === targetR && c + dc === targetC) return true
                        }
                    }

                    for(const move of attacks){
                        if(move[0] === targetR && move[1] === targetC) return true
                    }
                }
            }
        }
        return false
    }

    this.getLegalMoves = function(first){
        const [r, c] = first
        const node = this.board[r][c]
        if (node === '') {return []}
        const color = node[0]
        const type = node.slice(1)
        let pseudoMoves = []

        if(type === 'P'){
            const dir = color === 'W' ? -1 : 1 
            const startRow = color === 'W' ? 6 : 1
            const double = r === startRow

            if(inBound(r + dir, c) && this.board[r + dir][c] === ''){
                pseudoMoves.push([r + dir, c])
                if (double && this.board[r + dir * 2][c] === ''){
                    pseudoMoves.push([r + dir * 2, c])
                }
            }

            const captureCols = [c - 1, c + 1]
            for(const dc of captureCols){
                const targetR = r + dir
                const targetC = dc
                if(inBound(targetR, targetC)){
                    const target = this.board[targetR][targetC]
                    if(target !== '' && target[0] !== color){
                        pseudoMoves.push([targetR, targetC])
                    }
                    if(this.enPassantTarget && this.enPassantTarget[0] === targetR && this.enPassantTarget[1] === targetC){
                        pseudoMoves.push([targetR, targetC])
                    }
                }
            }
        }

        if(type === 'R'){
            const dir = [[1,0],[-1,0],[0,1],[0,-1]]
            pseudoMoves.push(...slide(r, c, dir, color))
        }

        if(type === 'B'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1]]
            pseudoMoves.push(...slide(r, c, dir, color))
        }

        if(type === 'Q'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
            pseudoMoves.push(...slide(r, c, dir, color))
        }

        if(type === 'KN'){
            const dir = [[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]
            for(const [dr, dc] of dir){
                let nr = first[0] + dr
                let nc = first[1] + dc
                if(inBound(nr, nc)){
                    const target = this.board[nr][nc]
                    if(target === '' || target[0] !== color){
                        pseudoMoves.push([nr, nc])
                    }
                } 
            }
        }

        if(type === 'K'){            
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
            for(const [dr, dc] of dir){
                let nr = first[0] + dr
                let nc = first[1] + dc
                if(inBound(nr, nc)){
                    const target = this.board[nr][nc]
                    if(target === '' || target[0] !== color){
                        pseudoMoves.push([nr, nc])
                    }
                }
            }

            if(this.castlingRights){
                const row = color === 'W' ? 7 : 0
                if(r === row && c === 4){
                    if(!this.isSquareUnderAttack([row, 4], color)){
                        if(this.castlingRights[color]?.k && 
                           this.board[row][5] === '' && 
                           this.board[row][6] === '' &&
                           !this.isSquareUnderAttack([row, 5], color) &&
                           !this.isSquareUnderAttack([row, 6], color)){
                            pseudoMoves.push([row, 6])
                        }
                        if(this.castlingRights[color]?.q && 
                           this.board[row][3] === '' && 
                           this.board[row][2] === '' && 
                           this.board[row][1] === '' &&
                           !this.isSquareUnderAttack([row, 3], color) &&
                           !this.isSquareUnderAttack([row, 2], color)){
                            pseudoMoves.push([row, 2])
                        }
                    }
                }
            }
        }

        let legalMoves = []
        for(const move of pseudoMoves){
            if(this.simulatesMoveAndCheck(first, move, color)){
                legalMoves.push(move)
            }
        }

        return legalMoves
    }

    this.simulatesMoveAndCheck = function(from, to, color){
        const [fr, fc] = from
        const [tr, tc] = to
        
        const targetBackup = this.board[tr][tc]
        const pieceBackup = this.board[fr][fc]

        let epCapturedCoord = null
        let epCapturedBackup = null
        if(pieceBackup.slice(1) === 'P' && fc !== tc && targetBackup === ''){
            epCapturedCoord = [fr, tc]
            epCapturedBackup = this.board[fr][tc]
            this.board[fr][tc] = ''
        }

        this.board[tr][tc] = pieceBackup
        this.board[fr][fc] = ''

        let kingPos = null
        const kingSymbol = color + 'K'
        for(let r = 0; r < 8; r++){
            for(let c = 0; c < 8; c++){
                if(this.board[r][c] === kingSymbol){
                    kingPos = [r, c]
                    break
                }
            }
            if(kingPos) break
        }

        let isSafe = true
        if(kingPos){
            isSafe = !this.isSquareUnderAttack(kingPos, color)
        }

        this.board[fr][fc] = pieceBackup
        this.board[tr][tc] = targetBackup
        if(epCapturedCoord){
            this.board[epCapturedCoord[0]][epCapturedCoord[1]] = epCapturedBackup
        }

        return isSafe
    }

    this.move = function(start, end){
        const [fr, fc] = start
        const [tr, tc] = end
        const type = this.board[fr][fc]
        const color = type[0]

        // Handle En Passant updates
        if(type.slice(1) === 'P' && fc !== tc && this.board[tr][tc] === ''){
            this.board[fr][tc] = '' // Remove captured pawn behind
        }

        // Handle En Passant target setting
        if(type.slice(1) === 'P' && Math.abs(tr - fr) === 2){
            this.enPassantTarget = [(fr + tr) / 2, fc]
        } else {
            this.enPassantTarget = null
        }

        // Handle Castling Rook movement
        if(type.slice(1) === 'K' && Math.abs(tc - fc) === 2){
            if(tc === 6){ // Kingside
                const rook = this.board[tr][7]
                this.board[tr][7] = ''
                this.board[tr][5] = rook
            } else if(tc === 2){ // Queenside
                const rook = this.board[tr][0]
                this.board[tr][0] = ''
                this.board[tr][3] = rook
            }
        }

        // Update castling rights if King or Rook moves
        if(type.slice(1) === 'K'){
            this.castlingRights[color].k = false
            this.castlingRights[color].q = false
        }
        if(type.slice(1) === 'R'){
            if(fr === 7 && fc === 0) this.castlingRights.W.q = false
            if(fr === 7 && fc === 7) this.castlingRights.W.k = false
            if(fr === 0 && fc === 0) this.castlingRights.B.q = false
            if(fr === 0 && fc === 7) this.castlingRights.B.k = false
        }

        this.board[fr][fc] = ''
        this.board[tr][tc] = type
        this.draw()
    }
    // Find coordinates of the given color's king
    this.findKing = function(color) {
        const kingSymbol = color + 'K';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] === kingSymbol) {
                    return [r, c];
                }
            }
        }
        return null;
    };

    // Check if a specific color's king is currently under attack
    this.isInCheck = function(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;
        return this.isSquareUnderAttack(kingPos, color);
    };

    // Check if the given color is checkmated
    this.isCheckmate = function(color) {
        // Must be in check first
        if (!this.isInCheck(color)) return false;

        // Check if ANY piece of this color has at least one legal move
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece !== '' && piece[0] === color) {
                    const legalMoves = this.getLegalMoves([r, c]);
                    if (legalMoves.length > 0) {
                        return false; // Found a valid move, not checkmate
                    }
                }
            }
        }
        return true; // In check and 0 legal moves available
    };
    this.draw = function(){
        for(let j = 0; j < this.board.length; j++){
            for (let i = 0; i < this.board.length; i++){
                const node = document.querySelector(`[data-row='${j}'][data-col='${i}']`)
                if(node){
                    node.innerHTML = ''
                    if(this.board[j][i] !== ''){
                        const img = document.createElement('img')
                        img.src = `./styles/images/${this.board[j][i]}.svg`
                        node.appendChild(img)
                    }
                }
            }
        }
    }
}

//done