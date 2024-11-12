const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => res.json({ version: "1.0.0" }));

// Example of `/sets` endpoint
app.get('/api/sets', async (req, res) => {
  const sets = await prisma.flashcardSet.findMany();
  res.json(sets);
});

app.post('/api/sets', async (req, res) => {
  try {
    const set = await prisma.flashcardSet.create({
      data: req.body,
    });
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({ error: "Failed to create set" });
  }
});

//Get a single flashcard set by ID
app.get('/api/sets/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const set = await prisma.flashcardSet.findUnique({
        where: { id: parseInt(id) },
        include: { cards: true, comments: true },
      });
      res.json(set);
    } catch (error) {
      res.status(500).json({ error: "Flashcard set not found" });
    }
  });
  //Update a flashcard set
  app.put('/api/sets/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSet = await prisma.flashcardSet.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json(updatedSet);
    } catch (error) {
      res.status(500).json({ error: "Failed to update flashcard set" });
    }
  });
  //Delete flashcard set
  app.delete('/api/sets/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.flashcardSet.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete flashcard set" });
    }
  });
  //Get all flashcards in a specific set
  app.get('/api/sets/:setId/cards', async (req, res) => {
    const { setId } = req.params;
    try {
      const cards = await prisma.flashCard.findMany({
        where: { setId: parseInt(setId) },
      });
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve flashcards" });
    }
  });
  //Add a flashcard to a set
  app.post('/api/sets/:setId/cards', async (req, res) => {
    const { setId } = req.params;
    const { question, answer, difficulty } = req.body;
    try {
      const card = await prisma.flashCard.create({
        data: {
          question,
          answer,
          difficulty,
          set: { connect: { id: parseInt(setId) } },
        },
      });
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to create flashcard" });
    }
  });
  //Update a flashcard
  app.put('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updatedCard = await prisma.flashCard.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json(updatedCard);
    } catch (error) {
      res.status(500).json({ error: "Failed to update flashcard" });
    }
  });
  //Delete a flashcard
  app.delete('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.flashCard.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete flashcard" });
    }
  });
  //Get comments for a specific set
  app.get('/api/sets/:setId/comments', async (req, res) => {
    const { setId } = req.params;
    try {
      const comments = await prisma.comment.findMany({
        where: { setId: parseInt(setId) },
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve comments" });
    }
  });
  //Add a comment to a set
  app.post('/api/sets/:setId/comments', async (req, res) => {
    const { setId } = req.params;
    const { comment, authorId } = req.body;
    try {
      const newComment = await prisma.comment.create({
        data: {
          comment,
          author: { connect: { id: authorId } },
          set: { connect: { id: parseInt(setId) } },
        },
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });
  //Delete a comment
  app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.comment.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });
  //Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  });
  //Get a single user by ID
  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { sets: true },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "User not found" });
    }
  });
  //Create a new user
  app.post('/api/users', async (req, res) => {
    const { username, admin } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          admin: admin || false,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });
//Delete a user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  