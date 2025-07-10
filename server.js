const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

