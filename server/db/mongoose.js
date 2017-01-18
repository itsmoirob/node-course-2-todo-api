const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dev:d382ec9aw47PZUPL@ds117109.mlab.com:17109/node-2-todo-api');


module.exports = {
	mongoose
};