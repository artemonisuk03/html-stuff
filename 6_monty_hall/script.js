const state = {
  carPosition: 0,
  playerFirstChoice: null,
  openedDoor: null,
  gameStage: "initial",
};

const doors = document.querySelectorAll(".door");
const messageEl = document.getElementById("message");
const restart = document.getElementById("restart");

state.carPosition = 5;

function initGame() {
  state.playerFirstChoice = null;
  state.openedDoor = null;
  state.gameStage = "initial";

  if (state.carPosition != 5) {
    doors.forEach((door) => {
      door.classList.remove("opened");

      door.innerHTML = "";
      door.style.cursor = "pointer";
    });
  }

  state.carPosition = Math.floor(Math.random() * 3) + 1;

  restart.disabled = false;

  messageEl.textContent = "Выберите одну из трёх дверей";
}

function handleDoorClick(e) {
  const doorNumber = parseInt(e.currentTarget.dataset.number);

  if (state.gameStage === "initial") {
    state.playerFirstChoice = doorNumber;
    state.gameStage = "first-choice";

    openGoatDoor();

    messageEl.textContent = `Вы выбрали дверь ${doorNumber}. Ведущий открыл дверь ${state.openedDoor} с козой. Хотите изменить выбор?`;
  } else if (state.gameStage === "final-choice") {
    makeFinalChoice(doorNumber);
  }
}

function openGoatDoor() {
  const availableDoors = Array.from(doors).filter((door) => {
    const doorNumber = parseInt(door.dataset.number);
    return (
      doorNumber !== state.playerFirstChoice && doorNumber !== state.carPosition
    );
  });

  if (availableDoors.length > 0) {
    const doorToOpen =
      availableDoors[Math.floor(Math.random() * availableDoors.length)];
    state.openedDoor = parseInt(doorToOpen.dataset.number);

    doorToOpen.classList.add("opened");
    const p = document.createElement("p");
    p.innerHTML = `
        <div class="content"><img src="./goat.png" class="goat" width="200"></div>`;

    doorToOpen.appendChild(p);
    doorToOpen.style.cursor = "default";
  }

  state.gameStage = "final-choice";
}

function makeFinalChoice(finalChoice) {
  doors.forEach((door) => {
    const doorNumber = parseInt(door.dataset.number);
    door.classList.add("opened");
    door.style.cursor = "default";
    const p = document.createElement("p");

    if (doorNumber === state.carPosition) {
      p.innerHTML = `
        <div class="content"><img src="./car.png" class="car" width="200"></div>`;
      door.appendChild(p);
    } else if (doorNumber !== state.openedDoor) {
      p.innerHTML = `
        <div class="content"><img src="./goat.png" class="goat" width="200"></div>`;
      door.appendChild(p);
    }
  });

  const isWinner = finalChoice === state.carPosition;

  if (isWinner) {
    messageEl.textContent = `Вы выиграли автомобиль. (Машина была за дверью ${state.carPosition})`;
  } else {
    messageEl.textContent = `Вы проиграли. Автомобиль был за дверью ${state.carPosition}.`;
  }

  state.gameStage = "game-over";
}

doors.forEach((door) => {
  door.addEventListener("click", handleDoorClick);
});

restart.addEventListener("click", initGame);

initGame();
