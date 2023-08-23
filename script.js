const resizeButton = document.getElementById('resizeButton');
const sendButton = document.getElementById('sendButton');
const textInput = document.getElementById('textInput');
const setupButton = document.getElementById('setup-button');
const setupConfirmButton = document.getElementById('setupConfirm');
const overlay = document.getElementById('overlay');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const controls = document.getElementById('controls');
const procedure = document.getElementById('procedure')
const gridContainer = document.getElementById('gridContainer');
const commandQueue = document.getElementById('commandQueue');
const debugConsole = document.getElementById('debugConsole');
const clearConsoleButton = document.getElementById('clearConsole');
const createProcedureButton = document.getElementById('createProcedureButton');
const procedures = {};
let gridInitialized = false;
let isPainting = false;
let currentSquareIndex = 0;

const saveButton = document.getElementById('saveButton');
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect);
saveButton.addEventListener('click', saveToFile);

createProcedureButton.addEventListener('click', () => {
    createProcedure();
});

sendButton.addEventListener('click', () => {
    processCommands();
});

clearConsoleButton.addEventListener('click', () => {
    clearConsole();
});

setupButton.addEventListener('click', () => {
    overlay.style.display = 'flex';
    setupButton.style.display = 'none';
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
    } else {
        logToConsole('Por favor, poné dimensiones válidas.');
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

function processCommands() {
    const commands = textInput.value.split('\n');
    const repeatedCommands = [];
    currentSquare = null; // Reiniciar el cuadradito actual antes de procesarlo.

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
            
        }else if (command.startsWith('Procedimiento ')) {
            createProcedure(command);
        } else if (procedures.hasOwnProperty(command + ' {')) {
            executeCustomProcedure(command + ' {');
        } else {
            logToConsole(`Comando desconocido: ${command}`);
        }
    }
}

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

function isBlack() {
    logToConsole("Aún no implementado");
}

function isGreen() {
    logToConsole("Aún no implementado");
}

function isWhite() {
    logToConsole("Aún no implementado");
}

function isRed() {
    logToConsole("Aún no implementado");
}

function logToConsole(message) {
    debugConsole.innerHTML += `<p>${message}</p>`;
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

function clearConsole() {
    debugConsole.innerHTML = '';
}

function createProcedure() {
    const procedureCode = procedureEditor.value.trim();
    const lines = procedureCode.split('\n');
    const procedureName = lines[0].trim().replace('Procedimiento ', '');

    procedures[procedureName] = lines.slice(1, lines.length - 1);
    logToConsole(`Se creó el Procedimiento ${procedureName}`);
}

function executeCustomProcedure(procedureName) {
    const procedureCommands = procedures[procedureName];
    executeCommands(procedureCommands);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            processLoadedContent(fileContent);
        };
        reader.readAsText(file);
    }
}

function processLoadedContent(content) {
    const commandsAndProcedures = content.split('\n\n');

    const commands = commandsAndProcedures[0].trim();
    textInput.value = commands;

    procedureEditor.value = '';
    for (let i = 1; i < commandsAndProcedures.length; i++) {
        const procedureDefinition = commandsAndProcedures[i].trim();
        if (procedureDefinition.startsWith('Procedimiento')) {
            const lines = procedureDefinition.split('\n');
            const procedureName = lines[0].replace('Procedimiento', '').trim();
            const procedureCode = lines.slice(1).join('\n');

            procedures[procedureName] = procedureCode.split('\n');
            procedureEditor.value += `${procedureName}\n${procedureCode}\n`;
        }
    }
}

function saveToFile() {
    const content = generateSaveContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const fileName = 'MiCodigoQGrid.txt';

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateSaveContent() {
    let content = textInput.value + '\n\n';

    for (const procedureName in procedures) {
        if (procedures.hasOwnProperty(procedureName)) {
            const procedureCode = procedures[procedureName].join('\n');
            content += `Procedimiento ${procedureName}\n${procedureCode}\n}\n\n`;
        }
    }

    return content;
}