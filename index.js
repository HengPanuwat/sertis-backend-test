//Import all necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;

//Connect to my Atlas MongoDb cloud database
var db;
mongo.connect('mongodb+srv://HengPanuwat:heng1712@cluster0-3xqo8.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
	if (err) {
		console.log(err);
	}
	db = client.db('sertis-backend-test');
	console.log('Connected');//This validate the database connection
});

//Create express object and using body-parser middleware
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Route for creating a card with required properties
app.post('/addCard', (req, res) => {
	let data = {
		name: req.body.name,
		status: req.body.status,
		content: req.body.content,
		category: req.body.category,
		auther: req.body.auther,
	};

	//Insert the bodies to the database
	db.collection('cards').insertOne(data, (err, resp) => {
		if (err) {
			return console.log(err.message);
		}
		return res.send(resp);
	});

});

//Route for editing a card filtered by auther's name
app.put('/editCard', (req, res) => {
	//JSON Object using for update
	let data = {
		name: req.body.name,
		status: req.body.status,
		content: req.body.content,
		category: req.body.category,
	};
	let auther = req.body.auther;//Auther's name as a filter

	//Update the document in database
	db.collection('cards').updateOne({ auther: auther }, { $set: data }, (err, resp) => {
		if (err) {
			return console.log(err.message);
		}
		return res.send(resp);
	});

});

//Route for deleting a card filtered by auther's name
app.delete('/deleteCard', (req, res) => {
	let auther = req.body.auther;//Auther's name as a filter

	//Delete the document in database
	db.collection('cards').deleteOne({ auther: auther }, (err, resp) => {
		if (err) {
			return console.log(err.message);
		}
		return res.send(resp);
	});

});


//Setup the port number(here I use port number 80 which is HTTP port)
const port = process.env.PORT || 80;

//Start the server
app.listen(port, () => {
	console.log("Server is ready at " + port);
});