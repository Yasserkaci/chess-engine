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
            const dir = color ==='W'? -1 : 1 
            console.log(color, type, [r, c])
            const double = (color === 'W' && r === 6) || (color === 'B' && r === 1)
            if (double && this.board[r + dir * 2][c] === ''){
                moves.push([r+dir*2, c])
            }
            if(inBound(r + dir, c) && this.board[r + dir][c] === ''){
                console.log('nigaa')
                moves.push([r+dir, c])
            }
        }
        if(type ==='R'){
            const dir = [[1,0],[-1,0],[0,1],[0,-1]]
            moves.push(...slide(r, c,dir, color))
        }
        if(type ==='B'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1]]
            moves.push(...slide(r, c,dir, color))
        }
        if(type ==='Q'){
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
            moves.push(...slide(r, c,dir, color))
        }

        if(type ==='KN'){
            const dir = [[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]
            for(const [dr, dc] of dir){
            let r = first[0] + dr
            let c = first[1] + dc
            if(inBound(r,c)){
                const target = this.board[r][c]
                console.log(target[0])
                if(target === ''){
                    moves.push([r, c])
                }else{
                    if(target[0] !== color){
                        moves.push([r, c])
                    }
                }
            } 
        }
        }

        if(type === 'K'){            
            const dir = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
            for(const [dr, dc] of dir){
                let r = first[0] + dr
                let c = first[1] + dc
                if(inBound(r , c) && this.board[r][c] === ''){
                    console.log('nigaa')
                    moves.push([r, c])
                }
        }
        }


        console.log(moves)
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