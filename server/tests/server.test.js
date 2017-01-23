const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 1234
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {

	it('should create a new todo', (done) => {
		let text = 'This is a test';

		request(app)
			.post('/todos')
			.send({
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({
					text
				}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('GET /todos', () => {

	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});

});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		let hexID = todos[0]._id.toHexString();
		request(app)
			.get(`/todos/${hexID}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return a 404 if id not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return a 404 if not valid id', (done) => {
		request(app)
			.get('/todos/thisisnotvalid')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		let hexID = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${hexID}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexID);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexID).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		let hexID = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${hexID}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if ObjectID is invalid', (done) => {
		request(app)
			.delete('/todos/thisisnotvalid')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', (req, res) => {

	it('should update todo', (done) => {
		let hexID = todos[0]._id.toHexString();
		request(app)
			.patch(`/todos/${hexID}`)
			.send({
				"text": "this has now been changed",
				"completed": true
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe('this has now been changed');
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		let hexID = todos[1]._id.toHexString();
		request(app)
			.patch(`/todos/${hexID}`)
			.send({
				"text": "this has now been changed",
				"completed": false
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe('this has now been changed');
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});

});