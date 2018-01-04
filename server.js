var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var dataItems = [{
    id: 1,
    description: 'description goes here',
    completed: false
},
    {
        id: 2,
        description: 'description 2 goes here',
        completed: false
    }];                                             // should be in database

app.get('/',function(req, res){
    res.send('API root');
});

// GET /getAllData
app.get('/getAllData', function (req, res){
   res.json(dataItems);
});

//GET /allData/:id                                  // one item
app.get('/allData/:id',function (req, res){
    var itemID = parseInt(req.params.id, 10);
    var matchedItem;

    dataItems.forEach(function (item){
       if (itemID === item.id){
           matchedItem = item;
       }
    });

    if (matchedItem){
        res.json(matchedItem)
    } else {
        res.status(404).send();
    }
});


app.listen(PORT, function() {
    console.log('Express listening on port '+ PORT );
});


