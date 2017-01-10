const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log(`Unable to connect to MongoDB server`);
	} 
	console.log(`Connected to MongoDB server`);

	// db.collection('Todos').find({
	// 	// completed: false
	// 	_id: new ObjectID('58752b19c337f237cc392b58')
	// }).toArray().then((docs) => {
	// 	console.log('todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	db.collection('Users').find({
		name: 'Robbie Sherman'
	}).toArray().then((docs) => {
		console.log('todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});

	// db.collection('Todos').find({}).count().then((count) => {
	// 	console.log('todos');
	// 	console.log(count);
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// db.close();
});