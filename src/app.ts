import { Base, GameState, ScoreEntry } from "./types";
import {
  isValidGuess,
  createDigitValidator,
  countPossibleSecrets,
  addGuess,
  startGame,
  loadScores,
  addScore,
  formatTime,
} from "./game";

const root = document.createElement("div");
root.id = "app";
document.body.appendChild(root);
const app = root;

let state: GameState | null = null;

function makeLabel(text: string, el: HTMLElement): HTMLElement {
  const l = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = text;
  l.appendChild(span);
  l.appendChild(el);
  return l;
}

function clear(node: HTMLElement): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function renderSettings() {
  clear(app);
  const card = document.createElement("div");
  card.className = "card";
  const title = document.createElement("h1");
  title.textContent = "Bulls and Cows";
  card.appendChild(title);

  const row = document.createElement("div");
  row.className = "row";

  const lengthSelect = document.createElement("select");
  for (let i = 2; i <= 6; i++) {
    const o = document.createElement("option");
    o.value = String(i);
    o.textContent = String(i);
    lengthSelect.appendChild(o);
  }

  const baseSelect = document.createElement("select");
  (["bin", "oct", "dec", "hex"] as Base[]).forEach((b) => {
    const o = document.createElement("option");
    o.value = b;
    o.textContent = b;
    baseSelect.appendChild(o);
  });

  function updateLengths() {
    const base = baseSelect.value as Base;
    const max = base === "bin" ? 2 : 6;
    Array.from(lengthSelect.options).forEach((o) => {
      const v = Number(o.value);
      o.disabled = v > max;
    });
    if (Number(lengthSelect.value) > max) lengthSelect.value = String(max);
  }
  baseSelect.addEventListener("change", updateLengths);
  updateLengths();

  const startBtn = document.createElement("button");
  startBtn.textContent = "Start";
  startBtn.addEventListener("click", () => {
    const length = Number(lengthSelect.value);
    const base = baseSelect.value as Base;
    state = startGame(length, base, Math.random);
    renderGame();
  });

  row.appendChild(makeLabel("Length", lengthSelect));
  row.appendChild(makeLabel("Base", baseSelect));
  row.appendChild(startBtn);
  card.appendChild(row);

  const info = document.createElement("p");
  const updateInfo = () => {
    info.textContent = `Possible secrets: ${countPossibleSecrets(
      Number(lengthSelect.value),
      baseSelect.value as Base
    )}`;
  };
  updateInfo();
  lengthSelect.addEventListener("change", updateInfo);
  baseSelect.addEventListener("change", updateInfo);
  card.appendChild(info);

  app.appendChild(card);
  renderScores();
}

function renderGame() {
  if (!state) return;
  clear(app);
  const card = document.createElement("div");
  card.className = "card";
  const title = document.createElement("h1");
  title.textContent = "Bulls and Cows";
  card.appendChild(title);

  const info = document.createElement("div");
  info.textContent = `Length: ${state.length}, Base: ${state.base}`;
  card.appendChild(info);

  const input = document.createElement("input");
  const validator = createDigitValidator(state.base);
  input.addEventListener("input", () => {
    input.value = input.value
      .split("")
      .filter((c) => validator(c))
      .join("");
  });
  const guessBtn = document.createElement("button");
  guessBtn.textContent = "Guess";
  guessBtn.addEventListener("click", () => {
    const guess = input.value;
    if (!isValidGuess(guess, state!.length, state!.base)) return;
    if (state!.history.some((h) => h.guess.toLowerCase() === guess.toLowerCase())) return;
    state = addGuess(state!, guess);
    input.value = "";
    renderGame();
  });

  const row = document.createElement("div");
  row.className = "row";
  row.appendChild(input);
  row.appendChild(guessBtn);
  card.appendChild(row);

  if (state.status === "won") {
    const msg = document.createElement("div");
    msg.className = "message won";
    const elapsed = Date.now() - (state.startTime ?? Date.now());
    msg.textContent = `You won in ${state.attempts} attempts, ${formatTime(elapsed)}`;
    card.appendChild(msg);
    const score: ScoreEntry = {
      length: state.length,
      base: state.base,
      attempts: state.attempts,
      time: elapsed,
      date: new Date().toISOString(),
    };
    addScore(score);
    const newBtn = document.createElement("button");
    newBtn.textContent = "New Game";
    newBtn.addEventListener("click", () => {
      state = null;
      renderSettings();
    });
    card.appendChild(newBtn);
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["#", "Guess", "Bulls", "Cows"].forEach((t) => {
    const th = document.createElement("th");
    th.textContent = t;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  state.history.forEach((h, i) => {
    const tr = document.createElement("tr");
    const cells = [String(i + 1), h.guess, String(h.bulls), String(h.cows)];
    cells.forEach((c) => {
      const td = document.createElement("td");
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  card.appendChild(table);

  app.appendChild(card);
}

function renderScores() {
  const scores = loadScores();
  if (scores.length === 0) return;
  const card = document.createElement("div");
  card.className = "card";
  const h3 = document.createElement("h3");
  h3.textContent = "Scores";
  card.appendChild(h3);
  const table = document.createElement("table");
  table.className = "scoreboard";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Attempts", "Time", "Settings"].forEach((t) => {
    const th = document.createElement("th");
    th.textContent = t;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  scores.forEach((s) => {
    const tr = document.createElement("tr");
    const cells = [String(s.attempts), formatTime(s.time), `${s.length}/${s.base}`];
    cells.forEach((c) => {
      const td = document.createElement("td");
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  card.appendChild(table);
  app.appendChild(card);
}

renderSettings();