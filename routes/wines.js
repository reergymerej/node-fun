var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server(
		'localhost',
		27017,
		{
			auto_reconnect: true,
		}
	);

db = new Db('winedb', server);

db.open(function(err, db){
	if(!err){
		console.log('connected');
		db.collection('wines', { safe: true}, function(err, collection){
			if(err){
				console.log('wines does not exist');
				// populateDB();
			}
			// populateDB();
		});
	};
});
	
exports.findAll = function(req, res){
	console.log('find all');

	db.collection('wines', function(err, collection){
		if(err){
			console.log('error', err);
			return;
		};

		collection.find().toArray(function(err, items){
			res.send(items);
		});
	});
};

exports.findById = function(req, res){
	var id = req.params.id;
	
	db.collection('wines', function(err, collection){
		collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item){
			res.send(item);
		});
	});
};

exports.addWine = function(req, res){
	var wine = req.body;
	console.log('adding', wine);

	db.collection('wines', function(err, collection){
		collection.insert(wine, {safe: true}, function(err, result){
			if(err){
				res.send({'error': 'unable to insert'});
			} else {
				console.log('success', result[0]);
				res.send(result[0]);
			};
		});
	});
};

exports.updateWine = function(req, res){
	var id = req.params.id,
		wine = req.body;

	console.log('update', id, wine);

	db.collection('wines', function(err, collection){
		collection.update({'_id': new BSON.ObjectID(id)}, wine, {safe: true}, function(err, result){
			if(err){
				res.send({'error': 'unable to update: ' + err});
			} else {
				res.send(req.body);
			};
		});
	});
};

exports.deleteWine = function(req, res){
	var id = req.params.id;
	console.log('delete:', id);

	db.collection('wines', function(err, collection){
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result){
			if(err){
				res.send({'error': 'unable to delete: ' + err});
			} else {
				res.send(req.body);
			};
		});
	});
};

//////////////
var populateDB = function(){
	var wines = [
		{
			name: "CHATEAU DE SAINT COSME",
			year: "2009",
			grapes: "Grenache / Syrah",
			country: "France",
			region: "Southern Rhone",
			description: "The aromas of fruit and spice...",
			picture: "saint_cosme.jpg"
		},
		{
			name: "LAN RIOJA CRIANZA",
			year: "2006",
			grapes: "Tempranillo",
			country: "Spain",
			region: "Rioja",
			description: "A resurgence of interest in boutique vineyards...",
			picture: "lan_rioja.jpg"
		}];

	db.collection('wines', function(err, collection){
		if(!err){
			collection.insert(wines, {safe: true}, function(err, result){
				console.log('collection created: ', result);
			});
		} else {
			console.log('err', err);
		}
	});
};