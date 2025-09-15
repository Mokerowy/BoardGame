// Rozmiar planszy
const BOARD_SIZE = 9;

// Stan planszy
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
let currentPlayer = 'black';  // Zaczyna gracz "czarny"

// Inicjalizacja planszy
function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Wyczyść planszę

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Obsługuje kliknięcie w komórkę
function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] !== null) return; // Komórka już zajęta

    board[row][col] = currentPlayer;
    event.target.classList.add(currentPlayer);

    // Sprawdzenie, czy po ruchu są jakieś zbite grupy
    removeCapturedStones(row, col);

    if (checkGameOver()) return;

    // Zmiana gracza
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

    // Ruch AI
    if (currentPlayer === 'white') {
        aiMove();
    }
}

// Sprawdza, czy kamienie zostały otoczone i je zbija
function removeCapturedStones(row, col) {
    // Sprawdzamy wszystkie cztery kierunki (góra, dół, lewo, prawo)
    const directions = [
        [-1, 0], // góra
        [1, 0],  // dół
        [0, -1], // lewo
        [0, 1],  // prawo
    ];

    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    // Funkcja pomocnicza do sprawdzania oddechów grupy
    function hasLiberties(group) {
        for (const [r, c] of group) {
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
            ];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
                    return true;
                }
            }
        }
        return false;
    }

    // Funkcja do zbierania grupy kamieni
    function collectGroup(row, col, color) {
        const group = [];
        const visited = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
        const stack = [[row, col]];
        visited[row][col] = true;

        while (stack.length > 0) {
            const [r, c] = stack.pop();
            group.push([r, c]);

            // Sprawdź cztery kierunki
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && !visited[nr][nc] && board[nr][nc] === color) {
                    stack.push([nr, nc]);
                    visited[nr][nc] = true;
                }
            }
        }
        return group;
    }

    // Sprawdzenie wszystkich grup przeciwnika
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === opponent) {
                const group = collectGroup(row, col, opponent);
                if (!hasLiberties(group)) {
                    // Zbijamy grupę
                    group.forEach(([r, c]) => {
                        board[r][c] = null;
                        const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
                        cell.classList.remove('black', 'white'); // Usuwamy kamień z planszy
                    });
                }
            }
        }
    }
}

// Ruch AI - losowy ruch
function aiMove() {
    let availableMoves = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) {
                availableMoves.push({ row, col });
            }
        }
    }

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[move.row][move.col] = 'white';
    const cell = document.querySelector(`.cell[data-row='${move.row}'][data-col='${move.col}']`);
    cell.classList.add('white');

    // Sprawdzenie, czy po ruchu AI są jakieś zbite grupy
    removeCapturedStones(move.row, move.col);

    if (checkGameOver()) return;

    // Zmiana gracza na czarnego
    currentPlayer = 'black';
}

// Sprawdzanie, czy gra się skończyła
function checkGameOver() {
    // Tu możemy dodać prostą logikę do zakończenia gry (np. brak ruchów, zdobycie terytorium itd.)
    // Na razie po prostu sprawdzamy czy plansza jest pełna

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) {
                return false;
            }
        }
    }

    alert("Gra skończona!");
    return true;
}

// Resetowanie gry
document.getElementById('resetButton').addEventListener('click', function() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    currentPlayer = 'black';  // Zaczyna gracz "czarny"
    initBoard();
});

// Inicjalizacja planszy na starcie
initBoard();
