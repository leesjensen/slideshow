import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.static('public'));

app.get('/photos', (req, res) => {
  fs.readdir('public/photos', (err, files) => {
    let list = [];
    files.forEach((file) => {
      list.push(file);
    });
    res.send(list);
  });
});

const port = process.argv.length > 2 ? process.argv[2] : 3000;
app.listen(port, () => {
  console.log(`started on port ${port}`);
});
