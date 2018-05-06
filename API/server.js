const express = require('express');
const cors = require('cors')
const app = express();
const NodeCouchDb = require('node-couchdb');

app.use(cors())

app.listen(8000, () => {
    console.log('Server started!');
});

const couch = new NodeCouchDb({
    host: '43.240.98.139',
    protocol: 'http',
    port: 5984
});

app.route('/api/city-info/:name').get((req, res) => {
    const cityName = req.params['name'];
    console.log("Querying the info for city:"+cityName);
    couch.get("city_info", cityName).then(({data, headers, status}) => {
        console.log(data);
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});