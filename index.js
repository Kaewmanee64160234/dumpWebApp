const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: '',  // Replace with your MySQL password
  database: 'userdb'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Serve a simple HTML form
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="firstname">First Name:</label>
      <input type="text" id="firstname" name="firstname" required>
      <br>
      <label for="lastname">Last Name:</label>
      <input type="text" id="lastname" name="lastname" required>
      <br>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { firstname, lastname } = req.body;

  const query = 'INSERT INTO users (firstname, lastname) VALUES (?, ?)';
  db.query(query, [firstname, lastname], (err, result) => {
    if (err) throw err;
    res.send('User data saved successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
