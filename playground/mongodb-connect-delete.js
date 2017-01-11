const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log(`Unable to connect to MongoDB server`);
	} 
	console.log(`Connected to MongoDB server`);

	//deleteMany
	// db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	//deleteOne
	// db.collection('Todos').deleteOne({text:'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	//findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').deleteMany({name: 'Robbie Sherman'});
	// db.collection('Users').findOneAndDelete({_id: new ObjectID("5875273bbeabee0016b24d7c")}).then((result) => {
	// 	console.log(JSON.stringify(result, undefined, 2));
	// });

	// db.close();
});