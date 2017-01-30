const expect = require('expect');
const request = require('supertest');
const {
	ObjectID
} = require('mongodb');

const {
	app
} = require('./../server');
const {
	Todo
} = require('./../models/todo');
const {
	User
} = require('./../models/user');
const {
	todos,
	populateTodos,
	users,
	populateUsers
} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', (done) => {
	it('should create a user', (done) => {
		const email = 'new@email.com';
		const password = 'password';

		request(app)
			.post('/users')
			.send({
				email,
				password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({
					email
				}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return validation errors if request invalid', (done) => {
		const email = 'newemail.com';
		const password = 'fail';

		request(app)
			.post('/users')
			.send({
				email,
				password
			})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in user', (done) => {
		const email = users[0].email;
		const password = 'password';

		request(app)
			.post('/users')
			.send({
				email,
				password
			})
			.expect(400)
			.end(done);
	});
})

describe('POST /users/login', () => {

	it('should login in user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[0].email,
				password: users[0].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.findById(users[0]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));
			});
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'somewrongpassword'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('DELETE /users/me/token', () => {

	it('should remove x-auth token on log out', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if(err){
					return done(err);
				}
				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});

});