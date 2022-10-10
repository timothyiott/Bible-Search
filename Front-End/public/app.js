let resultsCanvas = document.getElementById('resultsCanvas');
let searchInput = document.getElementById('searchField');
let baseUrl = 'http://localhost:8000'

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

async function searchVerse(){
    let reference = searchInput.value;
    let splitReferenceBook = reference.split(' ')
    let splitReferenceChapterVerse = splitReferenceBook[1].split(':')
    
    let book = splitReferenceBook[0]
    let chapter = splitReferenceChapterVerse[0]
    let verse = splitReferenceChapterVerse[1]
    
    let url = `${baseUrl}/search/${book}/${chapter}/${verse}`

    if(reference === ""){
        alert('Enter a scripture reference.')
        return;
    }
   
    let response = await fetch(url);
    let data = await response.json();

    console.log(data)

    emptyRsults()
    createResultCard(data, resultsCanvas)
}

function submitNote(){
    
}


function emptyRsults() {
    while (resultsCanvas.firstChild) {
        resultsCanvas.removeChild(resultsCanvas.firstChild);
    }
}

function createResultCard(data, parent) {
    //data = {id:val, age:val, kind:val, name:val}

    // let overlay = document.createElement("div");
    // overlay.classList.add("overlay");

    let resultsCard = document.createElement("span");
    resultsCard.classList.add("result-card");

    let resultReference = document.createElement("h3");
    resultReference.textContent = `${books[data[0].book - 1]} ${data[0].chapter}:${data[0].verse} ${data[0].text}`;

    resultsCard.append(resultReference);
    parent.appendChild(resultsCard);

    for(let i = 0; i < data.length; i++){
        if(data[i].note_content){
            let resultNotes = document.createElement('p');
            resultNotes.textContent = data[i].note_content
            resultReference.append(resultNotes)
        }
    };
}