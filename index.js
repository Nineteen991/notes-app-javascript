// Declare html vars
const noteTitle = document.getElementById('add-note-title')
const noteDetails = document.getElementById('add-note-details')
const addNoteBtn = document.getElementById('add-note-btn')
const notesList = document.getElementById('your-notes-ul')
const deleteAllNotesBtn = document.getElementById('your-notes-delete-all-btn')
const addNoteContainer = document.getElementById('add-note')

// Retrieve saved notes from local storage
const getSavedNotes = () => {
    const savedNotes = localStorage.getItem('notes')
    
    try {
        return savedNotes ? JSON.parse(savedNotes) : []
    } catch (error) {
        return []
    }
}
const notes = getSavedNotes()

// Track whether a note is being edited
let editing = false
let editingNoteId = 0
let editingNoteIndex = null

// Save to local storage
const saveNotes = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes))
}

// Render notes
const renderNotes = notes => {
    // Clear old notes before rendering
    notesList.innerHTML = ''

    notes.map((note, index) => {
        const liElem = document.createElement('li')
        const divElem = document.createElement('div')
        const h4Elem = document.createElement('h4')
        const btnsDivElem = document.createElement('div')
        const deleteBtnElem = document.createElement('button')
        const editBtnElem = document.createElement('button')
        const h3Elem = document.createElement('h3')
        const pElem = document.createElement('p')

        liElem.setAttribute('class', 'your-notes-li')
        divElem.setAttribute('class', 'your-notes-btns-header')
        h4Elem.setAttribute('class', 'your-notes-number')
        btnsDivElem.setAttribute('class', 'btns-div')
        deleteBtnElem.setAttribute('class', 'btn')
        deleteBtnElem.setAttribute('id', 'delete-btn')
        editBtnElem.setAttribute('class', 'btn')
        editBtnElem.setAttribute('id', 'edit-btn')
        h3Elem.setAttribute('class', 'your-notes-title')
        pElem.setAttribute('class', 'your-notes-details')

        // setup note numbers, buttons, note title, & note details
        h4Elem.innerHTML = `Note ${index + 1}`
        deleteBtnElem.innerHTML = 'Delete'
        editBtnElem.innerHTML = 'Edit'
        h3Elem.innerHTML = `${note.title}`
        pElem.innerHTML = `${note.details}`

        // Delete btn event listener
        deleteBtnElem.addEventListener('click', () => deleteNote(note.id))

        // Edit btn event listener
        editBtnElem.addEventListener('click', () => editNote(note))

        // Setup buttons div
        btnsDivElem.append(deleteBtnElem, editBtnElem)
        divElem.append(h4Elem, btnsDivElem)

        // Append children to li
        liElem.append(divElem, h3Elem, pElem)

        // Append li to ul
        notesList.appendChild(liElem)
    })
}
renderNotes(notes)

// Add note btn
addNoteBtn.addEventListener('click', e => {
    e.preventDefault()

    // Make sure inputs aren't empty
    let warning = null

    if (!noteTitle.value || !noteDetails.value) {
        warning = document.createElement('p')
        warning.setAttribute('class', 'warning')
        warning.innerHTML = 'Both note title & details are required!'
        addNoteContainer.appendChild(warning)
    } else {
        if (editing) {
            notes[editingNoteIndex].title = noteTitle.value
            notes[editingNoteIndex].details = noteDetails.value
            saveNotes(notes)
            addNoteBtn.innerHTML = 'Add Note'
            editing = false
            renderNotes(notes)
        } else {
            // Setup a new note
            const newNote = {
                id: Math.floor(Math.random() * 100000) + 1,
                title: noteTitle.value,
                details: noteDetails.value,
            }
            
            // add new note to the notes array, save, & re-render
            notes.push(newNote)
            saveNotes(notes)
            renderNotes(notes)
        }
    
        // clear inputs
        noteTitle.value = ''
        noteDetails.value = ''
    }
})

// Delete all notes
const deleteAllNotes = notes => {
    notes = []
    saveNotes(notes)
    renderNotes(notes)
}

// add event listener to the Delete all notes btn
deleteAllNotesBtn.addEventListener('click', () => deleteAllNotes(notes))

// Delete individual note
function deleteNote (id) {
    const noteToDelete = notes.findIndex(note => note.id === id)
    notes.splice(noteToDelete, 1)
    saveNotes(notes)
    renderNotes(notes)
}

// Edit notes
function editNote(note) {
    editing = true
    editingNoteIndex = notes.findIndex(item => item.id === note.id)
    noteTitle.innerHTML = note.title
    noteDetails.innerHTML = note.details
    addNoteBtn.innerHTML = `Edit Note ${editingNoteIndex + 1}`
}