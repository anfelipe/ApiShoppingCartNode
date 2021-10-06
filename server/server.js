require('./config/config');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*Se asignan las rutas*/
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto:" + process.env.PORT);
});