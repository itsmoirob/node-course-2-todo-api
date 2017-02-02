const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');

let userOneID = new ObjectID();
let userTwoID = new ObjectID();

const users = [{
	_id: userOneID,
	email: 'winning@test.com',
	password: 'aPassword1',
	tokens: [{
		token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString(),
		access: 'auth'
	}]
}, {
	_id: userTwoID,
	email: 'loser@test.com',
	password: 'aPassword2',
		tokens: [{
		token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString(),
		access: 'auth'
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneID
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 1234,
	_creator: userTwoID
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};

