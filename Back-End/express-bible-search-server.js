let express =  require("express");
let {Client, ClientBase} = require('pg');
let cors = require('cors');
let app = express();

const client = new Client({
    connectionString: "postgres://kjv_bible_and_notes_db_user:0HgtdxdWqVFtgSld4FUda2g6ZOTO3sYZ@dpg-cd3dj82rrk0ajgo2n7a0-a.oregon-postgres.render.com/kjv_bible_and_notes_db"
})

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT

client.connect();

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

app.get('/search/:book/:chapter/:verse', (req, res) => {
    let book = req.params.book;
    let chapter = req.params.chapter;
    let verse = req.params.verse;

    client.query(`SELECT kjv_bible.verse_id, kjv_bible.book, kjv_bible.chapter, kjv_bible.verse, kjv_bible.text, notes.note_id, notes.note_content FROM kjv_bible LEFT OUTER JOIN notes ON kjv_bible.verse_id=notes.verse_id WHERE book = ${books.indexOf(book) + 1} AND chapter = ${chapter} AND verse = ${verse} ORDER BY kjv_bible.verse_id ASC;`)
    .then(data => {
        console.log(data.rows)
        res.send(data.rows)
    })
    .catch(error => {
        throw error;
    })

})

app.get('/search/:book/:chapter', (req, res) => {
    let book = req.params.book;
    let chapter = req.params.chapter;

    client.query(`SELECT kjv_bible.verse_id, kjv_bible.book, kjv_bible.chapter, kjv_bible.verse, kjv_bible.text, notes.note_id, notes.note_content FROM kjv_bible LEFT OUTER JOIN notes ON kjv_bible.verse_id=notes.verse_id WHERE book = ${books.indexOf(book) + 1} AND chapter = ${chapter} ORDER BY kjv_bible.verse_id ASC;`)
    .then(data => {
        console.log(data.rows)
        res.send(data.rows)
    })
    .catch(error => {
        throw error;
    })
    console.log(data.rows)
})

app.post('/add-note/:verse_id', (req, res) => {
    console.log(req.body)
    console.log(req.params.verse_id)
    let verse_id = req.params.verse_id;
    let note_content = req.body.value
    console.log(note_content)

    client.query(`INSERT INTO notes (verse_id, note_content) VALUES (${verse_id}, N'${note_content}');`)
    .then(data => {
        console.log(data.rows)
        res.send(data.rows)
    })
    .catch(error => {
        throw error;
    })
})

app.get('/delete/:note_id' , (req, res) => {
    let note_id = req.params.note_id

    client.query(`DELETE FROM notes WHERE note_id = ${note_id}`)
    .then(data => {
        console.log(data.rows)
        res.send(data.rows)
    })
    .catch(error => {
        throw error;
    })
})

app.use((req, res, er) => {
    res.status(404).send(er);
})

app.listen(PORT, console.log(`listening on port ${PORT}`));