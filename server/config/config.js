var env = process.env.NODE_ENV || 'development' ;

if(env === 'production') {
	process.env.MONGODB_URI = 'mongodb://dev:d382ec9aw47PZUPL@ds117109.mlab.com:17109/node-2-todo-api';
} else if(env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
