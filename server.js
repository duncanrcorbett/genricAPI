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

// GET /allData ?completed=true
app.get('/allData', function (req, res){
    var queryParams = req.query;
    var filteredData = dataItems;

    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredData = _.where(dataItems, {completed: true})
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredData = _.where(dataItems, {completed: false})
    }

    res.json(filteredData);
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


// DELETE /allData/:id
app.delete('/allData/:id', function (req,res){
    var itemID = parseInt(req.params.id, 10);
    var matchedItem = _.findWhere(dataItems, {id: itemID});

    if (!matchedItem){
        res.status(404).json({"error": "no Item found with that ID"});
    } else {
        dataItems = _.without(dataItems,matchedItem);
        res.json(matchedItem);
    }
});

// PUT /allData/:id
app.put('/allData/:id', function (req, res){
    var body = _.pick(req.body,'description','completed' );
    var validAttributes = {};
    var itemID = parseInt(req.params.id, 10);
    var matchedItem = _.findWhere(dataItems, {id: itemID});

    if (!matchedItem){
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedItem, validAttributes);
    res.json(matchedItem);

});

app.listen(PORT, function() {
    console.log('Express listening on port '+ PORT );
});


