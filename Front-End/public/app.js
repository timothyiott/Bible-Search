let resultsCanvas = document.getElementById('resultsCanvas');
let searchInput = document.getElementById('searchField');
// let baseUrl = 'http://localhost:8000'
let baseUrl = 'https://bible-search-api.onrender.com'

var books = [
    'Genesis',         'Exodus',          'Leviticus',     'Numbers',
    'Deuteronomy',     'Joshua',          'Judges',        'Ruth',
    '1 Samuel',        '2 Samuel',        '1 Kings',       '2 Kings',
    '1 Chronicles',    '2 Chronicles',    'Ezra',          'Nehemiah',
    'Esther',          'Job',             'Psalm',         'Proverbs',
    'Ecclesiastes',    'Song of Solomon', 'Isaiah',        'Jeremiah',
    'Lamentations',    'Ezekiel',         'Daniel',        'Hosea',
    'Joel',            'Amos',            'Obadiah',       'Jonah',
    'Micah',           'Nahum',           'Habakkuk',      'Zephaniah',
    'Haggai',          'Zechariah',       'Malachi',       'Matthew',
    'Mark',            'Luke',            'John',          'Acts',
    'Romans',          '1 Corinthians',   '2 Corinthians', 'Galatians',
    'Ephesians',       'Philippians',     'Colossians',    '1 Thessalonians', 
    '2 Thessalonians', '1 Timothy',       '2 Timothy',     'Titus',
    'Philemon',        'Hebrews',         'James',         '1 Peter',
    '2 Peter',         '1 John',          '2 John',        '3 John',
    'Jude',            'Revelation'
];

async function search(){
    let reference = searchInput.value;
    let splitReferenceBook = reference.split(' ')
    let splitReferenceChapterVerse = splitReferenceBook[1].split(':')
    
    let book = splitReferenceBook[0]
    let chapter = splitReferenceChapterVerse[0]
    let verse = splitReferenceChapterVerse[1]

    if(reference === ""){
        alert('Enter a scripture reference.')
        return;
    } else if(book && chapter && verse){
        searchVerse(book, chapter, verse)
    } else if(book && chapter && !verse){
        searchChapter(book, chapter)
    }
}

async function searchVerse(book, chapter, verse){
    let url = `${baseUrl}/search/${book}/${chapter}/${verse}`
   
    let response = await fetch(url);
    let data = await response.json();

    console.log(data)

    emptyResults()
    populateResults(data)
}

async function searchChapter(book, chapter){
    let url = `${baseUrl}/search/${book}/${chapter}`

    let response = await fetch(url);
    let data = await response.json();

    console.log(data)

    emptyResults()
    populateResults(data)
}

async function submitNote(verseId){
    let addNoteInput = document.getElementById('addNote');
    if (!addNoteInput.value) {
        alert("You need to type in a note before pressing the submit button.")
        return;
    }
    console.log(addNoteInput.value)
    let body = {"value":`${addNoteInput.value}`};
    let url = `${baseUrl}/add-note/${verseId}`

    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"value":`${addNoteInput.value}`})
    });
    const content = await rawResponse.json();

    search()
}

function emptyResults() {
    while (resultsCanvas.firstChild) {
        resultsCanvas.removeChild(resultsCanvas.firstChild);
    }
}

function populateResults(data) {

    let html = ''
    for(let i = 0; i < data.length; i++){
        html = html.concat(`
        <div class="result-card">
            <h3>${books[data[i].book - 1]} ${data[i].chapter}:${data[i].verse} ${data[i].text}</h3>
            ${evaluateNoteContent(data, i)}
        </div>`)
    }

    $('#resultsCanvas').append(html)

    $('#notes').empty()
    $('#notes').append(`
        <div id="notes">
            <h2>Add notes here for ${books[data[0].book - 1]} ${data[0].chapter}:${data[0].verse}</h2>
            <input type="text" id="addNote">
            <button type="button" id="submitNote" onclick="submitNote(${data[0].verse_id})">Submit</button>
        </div>`)
}

function evaluateNoteContent(data, i){
    if(data[i].note_content){
        return `<p>${data[i].note_content}</p>
        <button type="button" id="searchButton" onclick="deleteNote(${data[i].note_id})">Delete Note</button>`
    } else {
        return "";
    }
}

async function deleteNote(note_id){
    let url = `${baseUrl}/delete/${note_id}`
   
    let response = await fetch(url);
    let data = await response.json();

    console.log(data)
    search()
}
