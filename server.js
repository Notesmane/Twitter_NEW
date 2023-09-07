const express = require('express');
require('dotenv').config();
const connectDB = require('./utils/connectDB');
const Tweet = require('./models/Tweet');
const manyTweets = require('./models/manytweets');
const jsxEngine = require('jsx-view-engine');
const methodOverride = require('method-override');
// const morgan = require('morgan');
// const { connect } = require('mongoose');

//^ ====================== Variables
const app = express();
const PORT = process.env.PORT || 3000;

//^ ====================== App Configuration
app.set('view engine', 'jsx');
app.engine('jsx', jsxEngine());

//^ ====================== Middleware -> middleware runs as soon as the request comes in
// both of these are built into express
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// this one is not, abe was looking for an error i had so he had me bring this in
// app.use(morgan('dev')); 
// neither is this one
app.use(methodOverride('_method'));

app.use(express.static('public')); //tells express to try to match requests with files in the directory called 'public'



//^ ====================== Routes

/**
 *& Root
 */
app.get("/", (req, res) => {
    res.send("working!")
})


//* ================ View Routes

/**
 *& Index
 */
app.get("/tweets", async (req, res) => {
    try {
        const tweets = await Tweet.find({});
        res.render('Index', {tweets});
        // const tweets = await Tweet.find({likes: {$lte: 20} });
        // $lte is less than or equal to, $gte is greater than equal to, $lt is less than
        // res.send(tweets)
    } catch (e) {
        console.log(e);
    }
})


/**
 *& New
 */
 app.get('/tweets/new', (req,res) => {
    res.render('New');
})


/**
 *& Edit
 */
app.get('/tweets/:id/edit', async (req, res) => {
    const {id} = req.params;
    try {
        // we need to find the tweet
        const tweet = await Tweet.findById(id);
        // we also need to return a form template with the tweet data
        res.render('Edit', {tweet});
    } catch (error) {
        console.log(error);
    }
});


/**
 *& Show
 */
// this route finds the tweet by id
app.get("/tweets/:id", async(req, res) => {
    const {id} = req.params;
    try {
        const tweet = await Tweet.findById(id)
        res.render('Show', {tweet});
    } catch (e) {
        console.log(e);
    }
})


//^ ======================  API Routes, api routes dont send any views they are used by the front end, they send data to the form. they are used to interact with your database
/**
 *& Create POST
 */
app.post("/api/tweets", async (req, res) => {
    const createdTweet = await Tweet.create(req.body);
    res.redirect('/tweets');
});

/**
 *& Update
 */
app.put("/api/tweets/:id", async (req, res) => {
    const {id} = req.params; // destructures the id
    if (req.body.sponsored === "on") {
        req.body.sponsored = true;
    } else {
        req.body.sponsored = false;
    }
    try {
        // const tweetToUpdate = await Tweet.findById();
        const updatedTweet = await Tweet.findByIdAndUpdate(id, req.body, {
            new: true, // this is needed so that it returns the new document, not the old version before the update
        });
        res.redirect(`/tweets/${id}`);
    } catch (e) {
        console.log(e);
    }
})

/**
 *& Delete
 */
app.delete("/api/tweets/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const deletedTweet = await Tweet.findByIdAndDelete(id);
        res.redirect('/tweets');
    } catch (e) {
        console.log(e);
    }
})

/**
 *& Add Comment
 */
app.put("/api/tweets/add-comment/:id", async (req, res) => {
    const {id} = req.params;
    const tweet = await Tweet.findById(id);
    tweet.comments.push(req.body);
    const updatedTweet = await Tweet.findByIdAndUpdate(id, tweet, {new: true});
    res.redirect(`/tweets/${id}`)
})

/**
 *& Increase Likes
 */
app.get('/api/tweets/add-like/:id', async (req, res) => {
    const {id} = req.params;
    // find the tweet to update
    const tweetToUpdate = await Tweet.findById(id);
    // increase the likes by 1
    tweetToUpdate.likes++;
    // update the tweet with the new data
    const updatedTweet = await Tweet.findByIdAndUpdate(id, tweetToUpdate, {new: true});
    res.redirect('/tweets');
})

/**
 *& Seed Route
 */
app.get("/api/tweets/seed", async (req, res) => {
    const createdTweets = await Tweet.insertMany(manyTweets);
    res.send(createdTweets)
})


// listening and connecting to DB
connectDB()
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))