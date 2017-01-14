const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// let id = '587a2a029c399e00bc70651f';
let id = '58767d2803e56802950602c1';

if(!ObjectID.isValid(id)) {
	return console.log('id is not valid');
}

User.findById(id).then((user) => {
	if(!user){
		return console.log('No user found');
	}
	console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
	console.log(e);
});

// if(!ObjectID.isValid(id)) {
// 	return console.log('id is not valid');
// }

// Todo.find({
// 	_id:id
// }).then((docs) => {
// 	console.log('todos find', docs);
// });

// Todo.findOne({
// 	_id:id
// }).then((doc) => {
// 	console.log('todos findOne', doc);
// });

// Todo.findById(id).then((doc) => {
// 	if(!doc){
// 		return console.log('ID not found');
// 	}
// 	console.log('todos findById', doc);
// }).catch((e) => console.log(e));

