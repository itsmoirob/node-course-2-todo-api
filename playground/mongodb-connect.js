// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log(`Unable to connect to MongoDB server`);
	} 
	console.log(`Connected to MongoDB server`);

	// db.collection('Todos').insertOne({
	// 	text: 'Is windows mongobooster seeing this?',
	// 	completed: true
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log(`Unable to insert Todo`);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Robbie Sherman',
	// 	age: 2017-1982,
	// 	location: 'London'
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log('There was an error');
	// 	}
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	db.close();
});