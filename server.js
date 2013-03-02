//	load modules
var express = require('express'),
	wines = require('./routes/wines');

//
var app = express();


app.get('/wines', wines.findAll);
app.get('/wines/:id', wines.findById);
app.post('/wines', wines.addWine);
app.put('/wines/:id', wines.updateWine);
app.delete('/wines/:id', wines.deleteWine);


app.listen(1887);
console.log('1887, man...');