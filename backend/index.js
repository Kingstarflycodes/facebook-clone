const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const { fullName, email, password, birthday, gender } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        birthday: new Date(birthday),
        gender
      }
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});