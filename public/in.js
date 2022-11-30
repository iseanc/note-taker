const noteEl = document.getElementById('notes');
const termButton = document.getElementById('term-btn');

const getNotes = () =>
  fetch('/api/pets', { method: 'GET' })
    .then((res) => res.json())
    .then((data) => data);

const renderNote = (note) => {
  const cardEl = document.createElement('li');
  const cardTitleEl = document.createElement('div');
  const cardTextEl = document.createElement('div');
  const cardImageEl = document.createElement('img');

  cardEl.classList.add('card', 'p-5');
  cardTitleEl.classList.add('card-header', 'card-title', 'link');
  cardTextEl.classList.add('card-body', 'p-5');
  cardImageEl.classList.add('image', 'p-5');

  cardTitleEl.innerHTML = note.title;
  cardTextEl.innerText = note.text;
  cardImageEl.setAttribute('src', note.image_url);
  cardEl.appendChild(cardTitleEl);
  cardEl.appendChild(cardTextEl);
  cardEl.appendChild(cardImageEl);
  noteEl.appendChild(cardEl);
};

const buttonHandler = () =>
  getNotes().then((response) => response.forEach((item) => renderNote(item)));

// termButton.addEventListener('click', buttonHandler);

window.addEventListener("load", (event) => {
  console.log("Notes page has loaded")
});

