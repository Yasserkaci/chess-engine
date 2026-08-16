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

    const inBound = (r, c) => r > -1 && r < 8 && c > -1 && c < 8 


    const slide = (row, col, directions, color) =>{
        let moves = []
        for(const [dr, dc] of directions){
            let r = row + dr
            let c = col + dc
            while(inBound(r,c)){
                const target = this.board[r][c]
                console.log(target[0])
                if(target === ''){
                    moves.push([r, c])
                }else{
                    if(target[0] !== color){
                        moves.push([r, c])
                        break
                    }else{break}
                }
                r += dr
                c += dc

            } 
        }
        return moves
    }
this.getLegalMoves = function(first){
        const [r, c] = first
        const node = this.board[r][c]
        if (node === '') {return}
        const color = node[0]
        const type = node.slice(1)
        let moves = []

        if(type === 'P'){
            const dir = color === 'W' ? -1 : 1 
            const startRow = color === 'W' ? 6 : 1
            const double = r === startRow

            // Single step forward
            if(inBound(r + dir, c) && this.board[r + dir][c] === ''){
                moves.push([r + dir, c])
                // Double step forward (only if single step is also empty)
                if (double && this.board[r + dir * 2][c] === ''){
                    moves.push([r + dir * 2, c])
                }
            }

            // Diagonal captures & En Passant
            const captureCols = [c - 1, c + 1]
            for(const dc of captureCols){
                const targetR = r + dir
                const targetC = dc
                if(inBound(targetR, targetC)){
                    const target = this.board[targetR][targetC]
                    // Standard diagonal capture
                    if(target !== '' && target[0] !== color){
                        moves.push([targetR, targetC])
                    }
                    // En Passant capture
                    if(this.enPassantTarget && this.enPassantTarget[0] === targetR && this.enPassantTarget[1] === targetC){
                        moves.push([targetR, targetC])
                    }
                }
            }
        }

        if(type === 'R'){
            const dir = [[1,0],[-1,0],[0,1],[0,-1]]
            moves.push(...slide(r, c, dir, color))
        }

        if(type === 'B'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1]]
            moves.push(...slide(r, c, dir, color))
        }

        if(type === 'Q'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
            moves.push(...slide(r, c, dir, color))
        }

        if(type === 'KN'){
            const dir = [[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]
            for(const [dr, dc] of dir){
                let nr = first[0] + dr
                let nc = first[1] + dc
                if(inBound(nr, nc)){
                    const target = this.board[nr][nc]
                    if(target === '' || target[0] !== color){
                        moves.push([nr, nc])
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
                        moves.push([nr, nc])
                    }
                }
            }

            // Castling logic (assumes this.castlingRights tracks object/flags e.g., {W: {k: true, q: true}, B: {k: true, q: true}})
            if(this.castlingRights && this.canCastle){
                const row = color === 'W' ? 7 : 0
                // Ensure king is in its starting position
                if(r === row && c === 4){
                    // Kingside castling
                    if(this.castlingRights[color]?.k && 
                       this.board[row][5] === '' && 
                       this.board[row][6] === '' &&
                       typeof this.isSquareUnderAttack === 'function' &&
                       !this.isSquareUnderAttack([row, 4], color) &&
                       !this.isSquareUnderAttack([row, 5], color) &&
                       !this.isSquareUnderAttack([row, 6], color)){
                        moves.push([row, 6])
                    }
                    // Queenside castling
                    if(this.castlingRights[color]?.q && 
                       this.board[row][3] === '' && 
                       this.board[row][2] === '' && 
                       this.board[row][1] === '' &&
                       typeof this.isSquareUnderAttack === 'function' &&
                       !this.isSquareUnderAttack([row, 4], color) &&
                       !this.isSquareUnderAttack([row, 3], color) &&
                       !this.isSquareUnderAttack([row, 2], color)){
                        moves.push([row, 2])
                    }
                }
            }
        }

        return moves
    }


    this.move = function(start,end){
        console.log(start)
        const type = this.board[start[0]][ start[1]]
        console.log('type:', type)
        const node = document.querySelector(`[data-row='${start[0]}'][data-col='${start[1]}']`)
        console.log(node)
        this.board[start[0]][ start[1]] = ''
        console.log(this.board[start[0]][ start[1]])
        
        
        this.board[end[0]][ end[1]] = type
        this.draw()

    }


    this.draw = function(){
        for(let j = 0; j < this.board.length; j++){
            for (let i = 0; i< this.board.length ; i++){
                const node = document.querySelector(`[data-row='${j}'][data-col='${i}']`)
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