const canvas = document.querySelector<HTMLDivElement>(".canvas")!;
const penColorInput = document.querySelector<HTMLInputElement>("#pen-color")!;
const bgColorInput = document.querySelector<HTMLInputElement>("#bg-color")!;
const randomBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--erase")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>(".controls__grid-size-label")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;
const gridLinesBtn = document.querySelector<HTMLButtonElement>(".controls__btn--grid-lines")!;
const clearGridBtn = document.querySelector<HTMLButtonElement>(".controls__btn--clear")!;

type Mode = "draw" | "random" | "erase";

const state = {
  mode: "draw" as Mod,
  penColor: penColorInput.value,
  bgColor: bgColorInput.value,
  gridSize: 16,
  gridLines: true
};

function createGrid(size: number) {
  canvas.replaceChildren();
  
  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "canvas__cell";
    
    canvas.appendChild(cell);
  }
}

function updatePenColor() {
  state.penColor = penColorInput.value;
}

function updateBgColor() {
  state.bgColor = bgColorInput.value;
  canvas.style.backgroundColor = state.bgColor;
}

function paintCell(e: PointerEvent) {
  if (e.buttons !== 1) return;
  if (!(e.target instanceof HTMLDivElement)) return;
  if (!e.target.matches(".canvas__cell")) return;

  const cell = e.target;

  switch (state.mode) {
    case "draw":
      cell.style.backgroundColor = state.penColor;
      break;
    case "random":
      cell.style.backgroundColor = getRandomColor();
      break;
    case "erase":
      cell.style.removeProperty("background-color");
  }
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function setMode(mode: Mode) {
  state.mode = state.mode === mode ? "draw" : mode;

  eraserBtn.classList.toggle("controls__btn--active", state.mode === "erase");
  randomBtn.classList.toggle("controls__btn--active", state.mode === "random");
}

function updateGridSize(e: Event) {
  const gridSize = Number(gridSizeInput.value);

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;
  
  if (e.type === "change") {
    state.gridSize = gridSize;
    createGrid(gridSize);
  }
}

function toggleGridLines() {
  state.gridLines = !state.gridLines;

  canvas.classList.toggle("canvas--grid", state.gridLines);
  gridLinesBtn.classList.toggle("controls__btn--active", state.gridLines);
}

function clearGrid() {
  const cells = canvas.querySelectorAll<HTMLDivElement>(".canvas__cell");
  cells.forEach(cell => cell.style.removeProperty("background-color"));
}

function setupEvents() {
  penColorInput.addEventListener("input", updatePenColor);
  bgColorInput.addEventListener("input", updateBgColor);
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);

  canvas.addEventListener("pointerdown", paintCell);
  canvas.addEventListener("pointerover", paintCell);

  randomBtn.addEventListener("click", () => setMode("random"));
  eraserBtn.addEventListener("click", () => setMode("erase"));
  gridLinesBtn.addEventListener("click", toggleGridLines);
  clearGridBtn.addEventListener("click", clearGrid);
}

function init() {
  createGrid(state.gridSize);
  setupEvents();
}

init();
