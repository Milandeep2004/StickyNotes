document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const colorPicker = document.getElementById('color-picker');
    let currentNote = null; // Keep track of the currently clicked note
  
    function createNote() {
      const note = document.createElement('div');
      note.classList.add('note');
      note.contentEditable = true; // Allow editing text inside the note
      note.style.left = '10px';
      note.style.top = '10px';
  
      let isDragging = false;
      let startX, startY, initialX, initialY;
  
      note.addEventListener('mousedown', (event) => {
        currentNote = note;
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = note.offsetLeft;
        initialY = note.offsetTop;
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
  
      function onMouseMove(event) {
        if (!isDragging) return;
  
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
  
        // Adjust these thresholds to decrease sensitivity
        const sensitivityThreshold = 2;
  
        if (Math.abs(deltaX) > sensitivityThreshold || Math.abs(deltaY) > sensitivityThreshold) {
          note.style.left = `${initialX + deltaX}px`;
          note.style.top = `${initialY + deltaY}px`;
        }
      }
  
      function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        currentNote = null;
      }
  
      note.ondragstart = () => false;
  
      // Event listener for showing color picker on click
      note.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent creating a new note when clicking on an existing one
        colorPicker.style.display = 'block';
        colorPicker.querySelector('input').value = rgbToHex(note.style.backgroundColor || 'rgb(255, 255, 0)'); // Set default yellow if no color set
      });
  
      board.appendChild(note);
    }
  
    // Event listener for creating a note on click on the board
    board.addEventListener('click', (event) => {
      if (event.target === board) {
        createNote();
      }
    });
  
    // Event listener for changing note color using color picker
    colorPicker.querySelector('input').addEventListener('change', (event) => {
      if (currentNote) {
        currentNote.style.backgroundColor = event.target.value;
        colorPicker.style.display = 'none';
      }
    });
  
    // Hide color picker when clicking outside
    document.addEventListener('click', (event) => {
      if (!colorPicker.contains(event.target) && event.target !== currentNote) {
        colorPicker.style.display = 'none';
      }
    });
  
    // Helper function to convert rgb color to hex
    function rgbToHex(rgb) {
      const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
      return result ? "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2) : rgb;
    }
  });
  