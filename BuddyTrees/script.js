class Pair {
    constructor(a, b) {
        this.lb = a;
        this.ub = b;
        this.allocated = false;
    }
}

let size;
let arr;
let totalMemorySize;

function Buddy(s) {
    size = s;
    let x = Math.ceil(Math.log2(s));
    arr = new Array(x + 1);

    for (let i = 0; i <= x; i++) {
        arr[i] = [];
    }

    arr[x].push(new Pair(0, size - 1));
}

function allocate(s) {
    let x = Math.floor(Math.ceil(Math.log2(s)));
    let i;
    let temp = null;

    if (arr[x].length > 0) {
        temp = arr[x].shift();
        temp.allocated = true;
        showMessage(`Memoria desde ${temp.lb} hasta ${temp.ub} asignada`);
        renderBuddyTree();
        return true;
    }

    for (i = x + 1; i < arr.length; i++) {
        if (arr[i].length == 0) continue;
        break;
    }

    if (i == arr.length) {
        showMessage("Lo sentimos, no se pudo asignar memoria");
        return false;
    }

    temp = arr[i].shift();
    i--;

    for (; i >= x; i--) {
        let newPair = new Pair(temp.lb, temp.lb + Math.floor((temp.ub - temp.lb) / 2));
        let newPair2 = new Pair(temp.lb + Math.floor((temp.ub - temp.lb + 1) / 2), temp.ub);

        arr[i].push(newPair);
        arr[i].push(newPair2);
        temp = arr[i].shift();
    }

    temp.allocated = true;
    showMessage(`Memoria desde ${temp.lb} hasta ${temp.ub} asignada`);
    renderBuddyTree();
    return true;
}

function initializeBuddyTree() {
    const memorySizeInput = document.getElementById('memorySize');
    totalMemorySize = parseInt(memorySizeInput.value);
    if (isNaN(totalMemorySize) || totalMemorySize <= 0) {
        showMessage("Por favor, ingrese un tamaño de memoria válido");
        return;
    }
    Buddy(totalMemorySize);
    showMessage(`Inicializado con ${totalMemorySize} bytes libres`);
    renderBuddyTree();
}

function requestBlock() {
    const blockSizeInput = document.getElementById('blockSize');
    const blockSize = parseInt(blockSizeInput.value);
    if (isNaN(blockSize) || blockSize <= 0) {
        showMessage("Por favor, ingrese un tamaño de bloque válido");
        return;
    }
    allocate(blockSize);
}

function showMessage(message) {
    const output = document.getElementById('output');
    const msg = document.createElement('div');
    msg.textContent = message;
    output.appendChild(msg);
}

function renderBuddyTree() {
    const buddyTreeContainer = document.getElementById('buddyTree');
    buddyTreeContainer.innerHTML = `<div id="totalMemory">Total Memory: ${totalMemorySize} bytes</div><div class="memory-block"></div>`;
    renderSegments(arr[arr.length - 1], buddyTreeContainer.lastChild, totalMemorySize);
}

function renderSegments(segments, parentElement, totalSize) {
    segments.forEach(segment => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('memory-segment');
        nodeElement.classList.add(segment.allocated ? 'allocated' : 'free');
        nodeElement.style.width = ((segment.ub - segment.lb + 1) / totalSize * 100) + '%';
        const spanElement = document.createElement('span');
        spanElement.textContent = `${segment.lb} - ${segment.ub}`;
        nodeElement.appendChild(spanElement);
        parentElement.appendChild(nodeElement);
    });
}
