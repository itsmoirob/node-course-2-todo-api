const mongoose = require('mongoose');

let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mLab: 'mongodb://dev:d382ec9aw47PZUPL@ds117109.mlab.com:17109/node-2-todo-api'
};

mongoose.Promise = global.Promise;
mongoose.connect( db.localhost || db.mLab, () => {
	console.log('Connected to mongodb');
});


module.exports = {
	mongoose
};