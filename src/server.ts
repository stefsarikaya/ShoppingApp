import express from 'express';

const app = express();

// parse JSON request bodies
app.use(express.json());

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  // your code here
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
