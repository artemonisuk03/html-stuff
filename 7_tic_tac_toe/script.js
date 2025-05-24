document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");
  const status = document.querySelector(".status");
  const restartButton = document.getElementById("restart");

  let active = true;
  let currPlayer = "⛌";
  let gameState = ["", "", "", "", "", "", "", "", ""];

  const winCnd = [
    [0, 1, 2], // горизонтальные
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // вертикальные
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // диагональные
    [2, 4, 6],
  ];

  function cellClick(e) {
    const clickedCell = e.target;
    const clickedIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedIndex] !== "" || !active) {
      return;
    }

    playerMove(clickedCell, clickedIndex);

    if (checkWin()) {
      return;
    }

    if (checkDraw()) {
      return;
    }

    if (active) {
      currPlayer = "◯";
      oppMove();
    }
  }

  function playerMove(cell, index) {
    gameState[index] = currPlayer;
    cell.textContent = currPlayer;
    cell.classList.add(currPlayer.toLowerCase());
  }

  function oppMove() {
    let oppWinMove = findWinMove("◯");
    if (oppWinMove !== -1) {
      makeMove(oppWinMove, "◯");
      return;
    }

    let playerWinMove = findWinMove("⛌");
    if (playerWinMove !== -1) {
      makeMove(playerWinMove, "◯");
      return;
    }

    const availableCells = [];
    gameState.forEach((cell, index) => {
      if (cell === "") {
        availableCells.push(index);
      }
    });

    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      makeMove(availableCells[randomIndex], "◯");
    }
  }

  function findWinMove(player) {
    for (let i = 0; i < winCnd.length; i++) {
      const [a, b, c] = winCnd[i];

      if (
        (gameState[a] === player &&
          gameState[b] === player &&
          gameState[c] === "") ||
        (gameState[a] === player &&
          gameState[c] === player &&
          gameState[b] === "") ||
        (gameState[b] === player &&
          gameState[c] === player &&
          gameState[a] === "")
      ) {
        if (gameState[a] === "") return a;
        if (gameState[b] === "") return b;
        if (gameState[c] === "") return c;
      }
    }
    return -1;
  }

  function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;

    if (checkWin()) {
      return;
    }

    if (checkDraw()) {
      return;
    }

    currPlayer = "⛌";
  }

  function checkWin() {
    for (let i = 0; i < winCnd.length; i++) {
      const [a, b, c] = winCnd[i];

      if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
        continue;
      }

      if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
        status.textContent =
          currPlayer === "⛌" ? "Вы победили" : "Вы проиграли";
        active = false;
        board.classList.add("disabled");
        return true;
      }
    }

    return false;
  }

  function checkDraw() {
    if (!gameState.includes("")) {
      status.textContent = "Ничья";
      active = false;
      board.classList.add("disabled");
      return true;
    }
    return false;
  }

  function restartGame() {
    active = true;
    currPlayer = "⛌";
    gameState = ["", "", "", "", "", "", "", "", ""];
    status.textContent = " ";
    board.classList.remove("disabled");

    cells.forEach((cell) => {
      cell.textContent = "";
    });
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", cellClick);
  });

  restartButton.addEventListener("click", restartGame);
});
