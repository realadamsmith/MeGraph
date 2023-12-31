// us1.tsx
const {MongoClient, ServerApiVersion} = require('mongodb');
const uri =
  'mongodb+srv://Errinwright:dxQNvyjjVj39ofYY@useryoutubecluster.lm2n1t9.mongodb.net/?retryWrites=true&w=majority';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();
app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post('/test', async (req, res) => {
  console.log('Request received:', req.body); // Log the received data
  try {
    // You can add code here to handle and store the test data in MongoDB
    // For this test, let's just send a response back
    res.status(200).json({message: 'Test data received successfully'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({error: error.message});
  }
});

app.post('/getYoutubeData', async (req, res) => {
  
  try {
    res.status(200).json({message: 'Test data received successfully'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({error: error.message});
  }
});

app.post('/storeYoutubeData', async (req, res) => {
  const {user, youtubeData} = req.body; 
  let collection;
  await client.connect();
  const db = client.db('userData');
  collection = db.collection('user');

  if (!collection) {
    res.status(500).json({error: 'DB connection not established'});
    return;
  }
  try {
    const existingUser = await collection.findOne({ "user.user.id": user.user.id });
    if (existingUser) {
        res.status(200).json({ message: 'User already exists, welcome' });
        // add func to track how many times the user has logged in
      } else {
        // User does not exist - insert a new document
        const result = await collection.insertOne({user, youtubeData});
        res.status(200).json({message: 'YoutubeData stored '});
      }

  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({error: error.message});
  }
});

app.post('/storeLikes', async (req, res) => {
  try {
    const likesData = req.body.likes; // Assuming likes is an array of video data
    const database = client.db('userData'); 
    const collection = database.collection('likesCollection'); 
    console.log('Received likesData:', likesData); // Log the likesData

    // Create bulk operations
    const bulkOps = likesData.map(likeData => {
      return {
        updateOne: {
          filter: { 
            userId: likeData.userId, 
            "video.videoId": likeData.video.videoId 
          },
          update: { $set: likeData },
          upsert: true
        }
      };
    });

    await collection.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Likes stored/updated successfully' });
  } catch (error) {
    console.error('Error in bulk storing/updating likes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/homeFeed', async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 15; 
  const skip = (page - 1) * limit; // Calculate the number of documents to skip for pagination

  try {
    await client.connect();
    const database = client.db('userData'); // Replace with your actual database name
    const collection = database.collection('likesCollection'); // Retrieving data from 'likesCollection'

    const data = await collection.find({})
                                 .skip(skip)
                                 .limit(limit)
                                 .toArray();

    // Check if there is more data to send for the next page
    const totalCount = await collection.countDocuments();
    const isMore = skip + data.length < totalCount;

    res.status(200).json({ data, isMore });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
