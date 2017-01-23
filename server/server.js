require('./config/config');

const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.json());

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text,
		completed: req.body.completed
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({
			todos
		});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			res.status(404).send();
		}
		res.send({
			todo
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	let id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (todo === null) {
			return res.status(404).send();
		}
		res.send({
			todo
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`App started on port ${port}`);
});

module.exports = {app};