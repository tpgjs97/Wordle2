import { dictionary } from "./secrets.js";
import { possibleWord } from "./possible.js";

function getRandomWords(dictionary) {
    const selectedWords = new Set() ;

    while (selectedWords.size < 30) {
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        selectedWords.add(dictionary[randomIndex]);
    }

    return Array.from(selectedWords)
}


function createTopContainer() {
    const topContainer = document.getElementById('top-container');
    const leftEl = document.createElement('div');
    const rightEl = document.createElement('div');
    rightEl.classList.add('right-item')
    leftEl.classList.add('left-item')

    topContainer.append(leftEl,rightEl)
    leftEl.textContent = 'New Game'

    for (let i = 1; i <= 30; i++) {
        const numberBox = document.createElement('div');
        numberBox.classList.add('number-box', `number-box${i}`)
        numberBox.textContent = i;
        rightEl.append(numberBox)
    }
    leftEl.addEventListener('click', startNewGame);
}

function startNewGame() {
    state.secrets = getRandomWords(dictionary);
    state.currentContainer = 1;
    state.currentRow = 1;
    state.currentCol = 1;

    // Clear the existing grids
    document.getElementById('main-container').innerHTML = '';

    // Regenerate the grids
    createTopContainer();
    createMiddleContainer();
    createBottomContainer();
    registerKeyboardEvents();
    window.onload = adjustGrid;
}

function createMiddleContainer() {
    const middleContainer = document.getElementById('middle-container');

    for (let i = 1; i <= 30; i++) {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('container', `container${i}`);

        for (let j = 0; j <= 30; j++) {
            const box = document.createElement('div');
            if (j == 0) {
                box.classList.add('box','title')
            } else {
                box.classList.add('box', `box${(Math.floor((j-1)/5)+1)}${(j-1)%5 + 1}`);
            }
            box.textContent=j;
            if (j == 0) {
                box.textContent = i;
            }
            
            gridContainer.appendChild(box);
        }

        middleContainer.appendChild(gridContainer);
    }
}

function createBottomContainer() {

}

const state = {
    secrets : getRandomWords(dictionary),
    currentContainer: 1,
    currentRow: 1,
    currentCol: 1
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;

        if (key ==='Enter' && state.currentCol == 6) {
            const word = getCurrentWord();
            if(isWordValid(word)){
                revealWord(word);
                state.currentRow++;
                state.currentCol = 1;
            } else {
                alert('Not a valid word.s')
            }
        }

        if (key === 'Backspace'){
            removeLetter();
        }

        if (isLetter(key)){
            addLetter(key);
        }
    }
}

function getCurrentWord() {
    for (let i = 1; i <= 30; i++) {
        var current_word = ''
        const container =document.querySelector(`.container${i}`)
        for (let j = 1; j < 6; j++) {
            const box = container.querySelector(`.box${state.currentRow}${j}`);
            current_word += box.textContent;
        }
        return current_word;
    }
}

function isWordValid(word) {
    return possibleWord.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;
    var copySecrets = state.secrets.slice();
    var checkList = new Array(30);
    for (var i = 0; i < checkList.length; i++) {
        checkList[i] = [0, 0, 0, 0, 0];
    }

    for (let i = 1; i <= 30; i++) {
        const container = document.querySelector(`.container${i}`);

        for (let j = 0; j < 5; j++) {
            const box = container.querySelector(`.box${row}${j+1}`);
            const letter = box.textContent;
            if (letter === state.secrets[i-1][j]) {
                checkList[i-1][j] = 2
                const index = copySecrets[i-1].indexOf(letter);
                copySecrets[i-1] = copySecrets[i-1].slice(0, index) + '@' + copySecrets[i-1].slice(index+1);
            }
        }

        for (let j = 0; j < 5; j++) {
            const box = container.querySelector(`.box${row}${j+1}`);
            const letter = box.textContent;
            if (checkList[i-1][j] === 0 && copySecrets[i-1].includes(letter)) {
                checkList[i-1][j] = 1;
                const index = copySecrets[i-1].indexOf(letter);
                copySecrets[i-1] = copySecrets[i-1].slice(0,index) + '@' + copySecrets[i-1].slice(index+1);
            }            
        }

        for (let j = 0; j < 5; j++) {
            const box = container.querySelector(`.box${row}${j+1}`);
            const letter = box.textContent;
            setTimeout(() => {
                if (checkList[i-1][j] == 2) {
                    box.classList.add('right');
                    
                } else if (checkList[i-1][j] == 1) {
                    box.classList.add('wrong');

                } else {
                    box.classList.add('empty');
                }
            }, ((j + 1) * animation_duration) / 2);
            
            box.classList.add('animated');
            box.style.animationDelay = `${(j * animation_duration) / 2}ms`;
        }
    }

    for (let i = 1; i<=30; i++) {
        const container = document.querySelector(`.container${i}`);
        const numberGrid = document.querySelector(`.number-box${i}`);

        setTimeout(() => {
            if (state.secrets[i] === guess) {
                numberGrid.classList.add('right');
            }
        }, 1500);

    }
    // 여기에 위에 1~30에 초록 빨강 넣는코드
}

function removeLetter(letter) {
    for (let i = 1; i <= 30; i++) {
        if (state.currentCol === 1)
            return;
        
        const container = document.querySelector(`.container${i}`);
        const box = container.querySelector(`.box${state.currentRow}${state.currentCol-1}`);
        box.textContent = '';
    }
    state.currentCol --;
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    for (let i = 1; i <= 30; i++){
        if (state.currentCol === 6) return;
        const container = document.querySelector(`.container${i}`);
        const box = container.querySelector(`.box${state.currentRow}${state.currentCol}`);
        box.textContent = letter;
    }
    state.currentCol++;
}

function resizeFontSize(items, num) {
    items.forEach(item => {
        var width = item.offsetWidth;
        var height = item.offsetHeight;
        var fontSize = Math.min(width, height) / num; // 원하는 비율로 폰트 크기 조정
        item.style.fontSize = `${fontSize}px`;
    });
}

function adjustGrid() {
    const gridItems = document.querySelectorAll('.box');
    const leftItems = document.querySelectorAll('.left-item');
    resizeFontSize(gridItems, 2)
    // resizeFontSize(leftItems, 1.5)
}

function start() {
    createTopContainer();
    createMiddleContainer();
    registerKeyboardEvents()
    window.onload = adjustGrid();
}

start()

window.onresize = function(){
    adjustGrid();
}