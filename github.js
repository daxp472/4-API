const cors = require('cors');


const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const urilocal = 'mongodb://localhost:27017';
const uri = 'mongodb+srv://daxpatelcg:Volleyball10@cluster0.ds8ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = "codinggita";

let db;
let client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();




// Users All Requests Added hear 


app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.collection('users').findOne({ userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
    try {
        await db.collection('users').insertOne(req.body);
        res.status(201).send("User added");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

  
app.patch('/users/:userId', async (req, res) => {
    try {
        const result = await db.collection('users').updateOne(
            { userId: req.params.userId },
            { $set: req.body }
        );
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const result = await db.collection('users').deleteOne({ userId: req.params.userId });
        result.deletedCount > 0 ? res.status(200).send(`${result.deletedCount} document(s) deleted`) : res.status(404).send("User not found");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});





// Repositories All Requests Added hear


app.get('/repositories', async (req, res) => {
  try {
    const repositories = await db.collection('repositories').find().toArray();
    res.json(repositories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
  
      const repository = await db.collection('repositories').findOne({ repoId });
      if (!repository) {
        res.status(404).json({ error: 'Repository not found' });
      } else {
        res.json(repository);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.post('/repositories', async (req, res) => {
    try {
      const newRepo = req.body;
      const result = await db.collection('repositories').insertOne(newRepo);
      res.status(201).send({ message: 'Repository created', repoId: result.insertedId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  

  app.patch('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
      const updates = req.body;
      const result = await db.collection('repositories').updateOne({ repoId }, { $set: updates });
      res.status(200).send({ message: `${result.modifiedCount} document(s) updated` });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  app.delete('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
      const result = await db.collection('repositories').deleteOne({ repoId });
      if (result.deletedCount > 0) {
        res.status(200).send({ message: 'Repository deleted' });
      } else {
        res.status(404).send({ error: 'Repository not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  


  // All issues Requests Added hear



app.get('/issues', async (req, res) => {
  try {
    const issues = await db.collection('issues').find().toArray();
    res.json(issues);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/issues', async (req, res) => {
    try {
        const issue = { ...req.body, createdAt: new Date(), closedAt: null };
        const result = await db.collection('issues').insertOne(issue);
        res.status(201).json({ message: 'Issue added', issueId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.patch('/issues/:issueId/status', async (req, res) => {
    try {
        const result = await db.collection('issues').updateOne(
            { issueId: req.params.issueId },
            { $set: { status: req.body.status } }
        );
        res.status(200).json({ message: 'Issue status updated', modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/issues/:issueId', async (req, res) => {
    try {
        const result = await db.collection('issues').deleteOne({ issueId: req.params.issueId });
        res.status(200).json({ message: 'Issue deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// All PullRequest Added hear


app.get('/pullRequests', async (req, res) => {
  try {
    const pullRequests = await db.collection('pullRequests').find().toArray();
    res.json(pullRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/pull-requests', async (req, res) => {
    try {
        const result = await db.collection('pullRequests').insertOne({
            prId: req.body.prId,
            repoId: req.body.repoId,
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            status: "open",
            createdAt: new Date().toISOString(),
            mergedAt: null
        });
        res.status(201).send(`Pull request created with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating pull request: " + err.message);
    }
});



app.delete('/pull-requests/:prId', async (req, res) => {
    try {
        const result = await db.collection('pullRequests').deleteOne({ prId: req.params.prId });
        res.status(200).json({ message: 'Pull request deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// All commit related request Added hear


app.get('/commits', async (req, res) => {
  try {
    const commits = await db.collection('commits').find().toArray();
    res.json(commits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/commits', async (req, res) => {
    try {
        const result = await db.collection('commits').insertOne({
            commitId: req.body.commitId,
            repoId: req.body.repoId,
            userId: req.body.userId,
            message: req.body.message,
            createdAt: new Date().toISOString()
        });
        res.status(201).send(`Commit created with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating commit: " + err.message);
    }
});


app.delete('/commits/:commitId', async (req, res) => {
    try {
        const result = await db.collection('commits').deleteOne({ commitId: req.params.commitId });
        if (result.deletedCount > 0) {
            res.status(200).send(`Commit with ID: ${req.params.commitId} deleted`);
        } else {
            res.status(404).send("No commit found with the specified ID");
        }
    } catch (err) {
        res.status(500).send("Error deleting commit: " + err.message);
    }
});





// All fork related request Added hear


app.get('/forks', async (req, res) => {
  try {
    const forks = await db.collection('forks').find().toArray();
    res.json(forks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/forks', async (req, res) => {
    try {
      const { forkId, repoId, userId, forkedAt } = req.body;
      await db.collection('forks').insertOne({ forkId, repoId, userId, forkedAt });
      res.status(201).send('Fork created');
    } catch (err) {
      res.status(500).send("Error creating fork: " + err.message);
    }
  });
  




  // all stars realted requests added hear


app.get('/stars', async (req, res) => {
  try {
    const stars = await db.collection('stars').find().toArray();
    res.json(stars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/stars', async (req, res) => {
    try {
      const { starId, repoId, userId, starredAt } = req.body;
      await db.collection('stars').insertOne({ starId, repoId, userId, starredAt });
      res.status(201).send('Star added');
    } catch (err) {
      res.status(500).send("Error adding star: " + err.message);
    }
  });
  






// main thing 





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});