const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.post('/', (req, res) => {
  res.json(
      {
        "message": "POST",
        "method": "POST"
      }
  );
});

app.put('/:app', (req, res) => {
  const {app} = req.params
  res.json(
      {
        "message": `PUT with param ${app}`,
        "method": "PUT",
      }
  );
});

app.get('/', (req, res) => {
  res.json(
      {
        "message": "GET all list",
        "method": "GET",
      }
  );
});

app.get('/:app', (req, res) => {
  const {app} = req.params
  res.json(
      {
        "message": `Get one with param ${app}`,
        "method": "GET",
      }
  );
});

app.delete('/:app', (req, res) => {
  const {app} = req.params
  res.json(
      {
        "message": `DELETE with param ${app}`,
        "method": "DELETE",
      }
  );
});

let PORT = 8080

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

