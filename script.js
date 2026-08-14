import boardO from "./modules/Board.js"

const board = document.querySelector('.board')
const squareWidth = 70
const squareAmount = 8

console.log(`${squareWidth * squareAmount}px`, board)

board.style.width = `${squareWidth * squareAmount}px`
board.style.height = `${squareWidth * squareAmount}px`


for (let i = 0; i < squareAmount  ; i++){
    for (let j = 0; j < squareAmount; j++ ){
        const node = document.createElement('div')
            node.style.width = `${squareWidth}px`
            node.style.height = `${squareWidth}px`
            node.classList.add('node')
            node.dataset.col = j
            node.dataset.row = i
        if((i + j) % 2 === 0 ){
            node.style.background = '#7B61FF'
        }else{
            node.style.background = '#E8EDF9'
        }

        board.appendChild(node)
    }
}

const Boardd = new boardO()

Boardd.draw()





