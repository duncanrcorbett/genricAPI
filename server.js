var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var dataItems = [];                                             // should be in database
var itemNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req, res){
    res.send('API root');
});

// GET /allData
app.get('/allData', function (req, res){
   res.json(dataItems);
});

// GET /allData/:id                                             // one item
app.get('/allData/:id',function (req, res){
    var itemID = parseInt(req.params.id, 10);
    var matchedItem = _.findWhere(dataItems, {id: itemID});

    if (matchedItem){
        res.json(matchedItem)
    } else {
        res.status(404).send();
    }
});

// POST /allData
app.post('/allData', function (req,res){
    var body = _.pick(req.body,'description','completed' );

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send(); // bad data
    }

    body.description = body.description.trim();

    body.id = itemNextId++;
    dataItems.push(body);
    res.json(body);

});


app.listen(PORT, function() {
    console.log('Express listening on port '+ PORT );
});


