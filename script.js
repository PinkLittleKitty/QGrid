const resizeButton = document.getElementById('resizeButton');
const sendButton = document.getElementById('sendButton');
const textInput = document.getElementById('textInput');
const setupButton = document.getElementById('setupButton');
const setupConfirmButton = document.getElementById('setupConfirm');
const overlay = document.getElementById('overlay');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const controls = document.getElementById('controls');
const gridContainer = document.getElementById('gridContainer');
const commandQueue = document.getElementById('commandQueue');
let gridInitialized = false;
let isPainting = false;
let currentSquareIndex = 0;

setupButton.addEventListener('click', () => {
    overlay.style.display = 'flex';
});

setupConfirmButton.addEventListener('click', () => {
    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);

    if (!isNaN(rows) && !isNaN(cols) && rows > 0 && cols > 0) {
        if (!gridInitialized) {
            createGrid(rows, cols);
            gridInitialized = true;
        }
        overlay.style.display = 'none';
        setupButton.style.display = 'none';
        controls.style.display = 'block';
    } else {
        alert('Please enter valid grid dimensions.');
    }
});

function createGrid(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        if (i === currentSquareIndex) {
            gridItem.style.border = '1px solid black';
        }

        gridContainer.appendChild(gridItem);
    }
}

function paintSquare(e) {
    if (isPainting) {
        e.target.style.border = '1px solid black';
    }
}

function clearSquareBorders() {
    for (let i = 0; i < gridContainer.children.length; i++) {
        gridContainer.children[i].style.border = '1px solid #ccc';
    }
}


sendButton.addEventListener('click', () => {
    processCommands();
});

function processCommands() {
    const commands = textInput.value.split('\n');
    const repeatedCommands = [];

    for (const command of commands) {
        const trimmedCommand = command.trim();

        if (trimmedCommand.startsWith('Repetir(') && trimmedCommand.endsWith(') {')) {
            const repeatCount = parseInt(trimmedCommand.substring(8, trimmedCommand.indexOf(')')));
            const nestedCommands = [];
            let nestedCommand = '';

            for (let i = commands.indexOf(command) + 1; i < commands.length; i++) {
                nestedCommand = commands[i].trim();
                if (nestedCommand === '}') {
                    break;
                }
                nestedCommands.push(nestedCommand);
            }

            for (let i = 0; i < repeatCount; i++) {
                repeatedCommands.push(...nestedCommands);
            }
        } else {
            repeatedCommands.push(trimmedCommand);
        }
    }

    executeCommands(repeatedCommands);
    textInput.value = '';
    adjustControlsHeight();
}

function executeCommands(commands) {
    for (const command of commands) {
        if (command === 'MoverDerecha()') {
            moveRight();
        } else if (command === 'MoverIzquierda()') {
            moveLeft();
        } else if (command === 'MoverArriba()') {
            moveUp();
        } else if (command === 'MoverAbajo()') {
            moveDown();
        } else if (command === 'PintarNegro()') {
            paintBlack();
        } else if (command === 'PintarVerde()') {
            paintGreen();
        } else if (command === 'PintarBlanco()') {
            paintWhite();
        } else if (command === 'PintarRojo()') {
            paintRed();
        } else if (command === 'EsNegro?') {
            const isBlack = checkIfCurrentSquareIsBlack();
        }
    }
}

function adjustControlsHeight() {
    textInput.style.height = 'auto';
    textInput.style.height = textInput.scrollHeight + 'px';
}

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textInput.value += '\n';
        adjustControlsHeight();
    }
});


function moveRight() {
    if (currentSquareIndex < gridContainer.children.length - 1) {
        clearSquareBorders();
        currentSquareIndex++;
        gridContainer.children[currentSquareIndex].style.border = '1px solid black';
    }
}

function moveLeft() {
    if (currentSquareIndex > 0) {
        clearSquareBorders();
        currentSquareIndex--;
        gridContainer.children[currentSquareIndex].style.border = '1px solid black';
    }
}

function moveUp() {
    if (currentSquareIndex >= 20) {
        clearSquareBorders();
        currentSquareIndex -= 20;
        gridContainer.children[currentSquareIndex].style.border = '1px solid black';
    }
}

function moveDown() {
    if (currentSquareIndex < gridContainer.children.length - 20) {
        clearSquareBorders();
        currentSquareIndex += 20;
        gridContainer.children[currentSquareIndex].style.border = '1px solid black';
    }
}

function paintBlack() {
    gridContainer.children[currentSquareIndex].style.backgroundColor = 'black';
}

function paintGreen() {
    gridContainer.children[currentSquareIndex].style.backgroundColor = 'green';
}

function paintWhite() {
    gridContainer.children[currentSquareIndex].style.backgroundColor = 'white';
}

function paintRed() {
    gridContainer.children[currentSquareIndex].style.backgroundColor = 'red';
}

function checkIfCurrentSquareIsBlack() {
    if (gridContainer.children[currentSquareIndex].style.backgroundColor = 'black') {
        return true;
    }
    return false;
}

function isGreen() {

}

function isWhite() {
    
}

function isRed() {
    
}