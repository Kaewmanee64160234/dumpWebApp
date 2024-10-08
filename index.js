const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3306;

// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL database connection
// const db = mysql.createConnection({
//   host: 'usernodedatabase-1.cxeeke8sibj8.us-east-1.rds.amazonaws.com',
//   user: 'usernode',  // Replace with your MySQL username
//   password: 'admin-1234567898',  // Replace with your MySQL password
//   database: 'usernode'
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL');
// });

const db = mysql.createConnection({
  host: 'praewdb.cxeeke8sibj8.us-east-1.rds.amazonaws.com',
  user: 'main', // เปลี่ยนเป็น username ของคุณ
  password: 'lab-password', // เปลี่ยนเป็น password ของคุณ
  database: 'praewDB' // เปลี่ยนเป็นชื่อ database ของคุณ
});

// เชื่อมต่อกับ database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});



// Helper function to get navigation HTML
const getNavigation = () => `
  <nav>
    <a href="/">Add New User</a> | 
    <a href="/users">View All Users</a>
  </nav>
  <hr>
`;

// Serve a simple HTML form for creating a new user
app.get('/', (req, res) => {
  res.send(`
    ${getNavigation()}
    <h1>Add New User</h1>
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

// Handle form submission (Create)
app.post('/submit', (req, res) => {
  const { firstname, lastname } = req.body;

  const query = 'INSERT INTO users (firstname, lastname) VALUES (?, ?)';
  db.query(query, [firstname, lastname], (err, result) => {
    if (err) throw err;
    res.send(`${getNavigation()}<p>User data saved successfully. <a href="/users">View All Users</a></p>`);
  });
});

// Read all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) throw err;

    let responseHTML = `${getNavigation()}<h1>Users List</h1><ul>`;
    results.forEach(user => {
      responseHTML += `<li>${user.firstname} ${user.lastname} - 
        <a href="/edit/${user.id}">Edit</a> | 
        <a href="/delete/${user.id}">Delete</a></li>`;
    });
    responseHTML += `</ul><br><a href="/">Add New User</a>`;
    res.send(responseHTML);
  });
});

// Serve a form to edit a user (Update Form)
app.get('/edit/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.send(`${getNavigation()}<p>User not found. <a href="/users">View All Users</a></p>`);
    }

    const user = results[0];
    res.send(`
      ${getNavigation()}
      <h1>Edit User</h1>
      <form action="/update/${user.id}" method="POST">
        <label for="firstname">First Name:</label>
        <input type="text" id="firstname" name="firstname" value="${user.firstname}" required>
        <br>
        <label for="lastname">Last Name:</label>
        <input type="text" id="lastname" name="lastname" value="${user.lastname}" required>
        <br>
        <button type="submit">Update</button>
      </form>
    `);
  });
});

// Handle user update (Update)
app.post('/update/:id', (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname } = req.body;

  const query = 'UPDATE users SET firstname = ?, lastname = ? WHERE id = ?';
  db.query(query, [firstname, lastname, userId], (err, result) => {
    if (err) throw err;
    res.redirect('/users');
  });
});

// Handle user deletion (Delete)
app.get('/delete/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) throw err;
    res.redirect('/users');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
