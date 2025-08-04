const fenStart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const pieceMap = {
  p: "♟️", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

const boardEl = document.getElementById("board");
let board = Array(8).fill(null).map(() => Array(8).fill(null));
let selected = null;
let turn = "w";

function renderBoard() {
  boardEl.innerHTML = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.className = "cell " + ((x + y) % 2 == 0 ? "white" : "black");
      const piece = board[y][x];
      if (piece) cell.textContent = pieceMap[piece];
      cell.onclick = () => handleClick(x, y);
      if (selected && selected.x === x && selected.y === y)
        cell.classList.add("selected");
      boardEl.appendChild(cell);
    }
  }
}

function loadFEN(fen) {
  const rows = fen.split("/");
  for (let y = 0; y < 8; y++) {
    let x = 0;
    for (const ch of rows[y]) {
      if (isNaN(ch)) {
        board[y][x++] = ch;
      } else {
        x += parseInt(ch);
      }
    }
  }
}

function handleClick(x, y) {
  const piece = board[y][x];
  if (selected) {
    if (isLegalMove(selected.x, selected.y, x, y)) {
      board[y][x] = board[selected.y][selected.x];
      board[selected.y][selected.x] = null;
      turn = turn === "w" ? "b" : "w";
    }
    selected = null;
  } else {
    if (piece && isSameTurn(piece)) {
      selected = { x, y };
    }
  }
  renderBoard();
}

function isSameTurn(piece) {
  return (turn === "w" && piece === piece.toUpperCase()) ||
         (turn === "b" && piece === piece.toLowerCase());
}

function isLegalMove(sx, sy, dx, dy) {
  const piece = board[sy][sx];
  const target = board[dy][dx];
  if (!piece) return false;

  const dxAbs = Math.abs(dx - sx);
  const dyAbs = Math.abs(dy - sy);
  const dirX = dx > sx ? 1 : dx < sx ? -1 : 0;
  const dirY = dy > sy ? 1 : dy < sy ? -1 : 0;

  const clearPath = () => {
    for (let i = 1; i < Math.max(dxAbs, dyAbs); i++) {
      if (board[sy + dirY * i][sx + dirX * i]) return false;
    }
    return true;
  };

  const isWhite = piece === piece.toUpperCase();
  const lower = piece.toLowerCase();

  switch (lower) {
    case "p":
      let forward = isWhite ? -1 : 1;
      if (dx === sx && !target && dy === sy + forward) return true;
      if (dx === sx && !target && dy === sy + 2 * forward && ((isWhite && sy === 6) || (!isWhite && sy === 1)) && !board[sy + forward][sx]) return true;
      if (Math.abs(dx - sx) === 1 && dy === sy + forward && target && isSameTurn(target) !== isWhite) return true;
      return false;
    case "r":
      if (sx !== dx && sy !== dy) return false;
      return clearPath();
    case "n":
      return dxAbs + dyAbs === 3 && dxAbs !== 0 && dyAbs !== 0;
    case "b":
      if (dxAbs !== dyAbs) return false;
      return clearPath();
    case "q":
      if (dxAbs === dyAbs || sx === dx || sy === dy) return clearPath();
      return false;
    case "k":
      return dxAbs <= 1 && dyAbs <= 1;
  }

  return false;
}

loadFEN(fenStart);
renderBoard();
