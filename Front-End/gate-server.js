let express = require('express');
let app = express();

const PORT = process.env.PORT;

  app.use(express.static('public'))

app.listen(PORT, console.log(`Listening on port ${PORT}`));