let express =  require("express");
let {Client} = require('pg');
let cors = require('cors');
let app = express();

const client = new Client({
    connectionString: "postgresql://postgres:docker@127.0.0.1:5432/kjv_bible_and_notes_db"
})

app.use(express.json());
app.use(cors());

const PORT = 8000

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

    client.query(`SELECT * FROM kjv_bible WHERE book = ${books.indexOf(book) + 1} AND chapter = ${chapter} AND verse = ${verse};`)
    .then(data => {
        res.send(data.rows)
    })
})

app.listen(PORT, console.log(`listening on port ${PORT}`));