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




    this.draw = function(){
        for(let j = 0; j< this.board.length; j++){
            for (let i = 0; i< this.board[j].length ; i++){
                const img = document.createElement('img')
                if(this.board[j][i] !== ''){
                img.src = `./styles/images/${this.board[j][i]}.svg`
                const node = document.querySelector(`[data-row='${j}'][data-col='${i}']`)
                node.appendChild(img)
                }
            }
        }
    }
}