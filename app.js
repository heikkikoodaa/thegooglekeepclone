class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$closeFormButton = document.querySelector('#form-close-button');
    this.$colorToolTip = document.querySelector('#color-tooltip');
    this.$form = document.querySelector('#form');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formContainer = document.querySelector('#form-container');
    this.$modal = document.querySelector('.modal');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$notes = document.querySelector('#notes');
    this.$noteText = document.querySelector('#note-text');
    this.$noteTitle = document.querySelector('#note-title');
    this.$placeholder = document.querySelector('#placeholder');
    this.$toolbarColor = document.querySelector('.toolbar-color');
    this.$toolbarDelete = document.querySelector('.toolbar-delete');
    
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => {
      this.openToolTip(event);
    });

    document.body.addEventListener('mouseout', event => {
      this.closeToolTip(event);
    });

    this.$colorToolTip.addEventListener('mouseover', function() {
      this.style.display = 'flex';
    });

    this.$colorToolTip.addEventListener('mouseout', function() {
      this.style.display = 'none';
    });

    this.$colorToolTip.addEventListener('click', event => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();

      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.$closeFormButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener('click', (event) => {
      this.closeModal(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({title, text});
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$formContainer.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = "flex";
  }

  closeForm() {
    this.$formContainer.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteText.value = '';
    this.$noteTitle.value = '';
  }

  openModal(event) {
    if (event.target.matches('.toolbar-delete')) return;

    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  openToolTip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left;
    const vertical = window.scrollY - 23;
    this.$colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorToolTip.style.display = 'flex';
  }

  closeToolTip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorToolTip.style.display = 'none';
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };

    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note => 
      note.id === +this.id ? { ...note, title, text } : note
    );
    this.render();
  }

  editNoteColor(color) {
    this.notes = this.notes.map(note =>
      note.id === +this.id ? { ...note, color } : note
    );
    this.render();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== +id);
    this.render();
  }

  render() {
    this.saveNotes();
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
    
    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note" data-id="${note.id}">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
          <div class="toolbar">
            <span class="toolbar-color" data-id=${note.id}>Color</span>
            <span class="toolbar-delete" data-id=${note.id}>Delete</span>
          </div>
      </div>
    `).join("");
  }
}

new App();
