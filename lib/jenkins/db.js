var db = {};

//Prepares the data model we want to use
db.initSchema = function() {
	console.log("Initializing schemas");

	//Create the schemas into a list of models that we can create records from
	db.models = {
		DB: require('../model/db.js'),
		githubauthtoken: require('../model/githubauthtoken.js')
	};

}.bind(db);

db.init = function(callback) {
	/*var services = JSON.parse(process.env.VCAP_SERVICES);
	var mongo = services['mongodb-2.2'][0];*/
	var services = JSON.parse(process.env.VCAP_SERVICES_3);
	var mongo = services['mongodb-3.0.3'][0];

	//Connect to MongoDB
	var url = mongo.credentials.url;
	var options = {
		user: mongo.credentials.username,
		pass: mongo.credentials.password
	};

	db.mongoose = require('mongoose');
	console.log("Connecting to MongoDB instance");
	db.mongoose.connect(url, options);

	db.mongoose.connection.on('error', console.error.bind(console, 'Unable to connect to MongoDB: '));
	db.mongoose.connection.on('open', function(err) {
		if(err) return callback(err);

		//Initialize the schemas
		console.log("DB Connected");
		db.initSchema();

		require('./db_version.js')(db).checkDB(function(err) {
			callback(err);
		});
	});
}.bind(db);

db.reset = function(callback) {
	console.log('Resetting DB');

	console.log("Dropping DB");
	db.dropCollection(db.models.DB, function(err) {
		if(err) { return callback(err); }
						console.log("Dropping Githubauthtoken");
						db.dropCollection(db.models.githubauthtoken, function(err) {
							if(err) { return callback(err); } 
							
							//Reload the DB data
							require('./db_version.js')(db).checkDB(callback);
						});
	});
}.bind(db);

db.dropCollection = function(model, callback) {
	model.count().exec(function(err, count) {
		if(count > 0) {
			model.collection.drop(callback);
		} else {
			callback(null);
		}
	});
}.bind(db);

module.exports = db;
