const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log(`Palette picker listening on port ${app.get('port')}.`);
});

app.get('/', (request, reponse) => {
  console.log('hello');
});

