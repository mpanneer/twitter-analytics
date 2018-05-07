const express = require('express');
const cors = require('cors')
const app = express();
const NodeCouchDb = require('node-couchdb');

var args = process.argv.slice(2);
const CouchDBHost = args[0];
const portToBind = args[1];

app.use(cors())

app.listen(portToBind, () => {
    console.log('Server started at '+portToBind);
});

const couch = new NodeCouchDb({
    host: CouchDBHost,
    protocol: 'http',
    port: 5984
});

app.route('/api/states').get((req, res) => {
    console.log("Querying the info for all states");
    const viewUrl = "_design/docs/_view/by_name";
    couch.get("states", viewUrl).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    });  
});

app.route('/api/states/:name').get((req, res) => {
    const stateName = req.params['name'];
    console.log("Querying the info for state:"+stateName);
    const viewUrl = "_design/docs/_view/by_name";
    const queryOptions = {
        'key': stateName
    };
    couch.get("states", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    });
});

app.route('/api/suburbs').get((req, res) => {
    console.log("Querying the info for all suburbs");
    const viewUrl = "_design/docs/_view/by_suburb";
    couch.get("suburbs", viewUrl).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:statename/suburbs').get((req, res) => {
    const stateName = req.params['statename'];
    console.log("Querying the info for all suburbs in "+stateName);
    const viewUrl = "_design/docs/_view/by_state";
    const queryOptions = {
        'key': stateName
    };
    couch.get("suburbs", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/suburb/:name').get((req, res) => {
    const suburbName = req.params['name'];
    console.log("Querying the info for suburb:"+suburbName);
    const viewUrl = "_design/docs/_view/by_suburb";
    const queryOptions = {
        'key': suburbName
    };
    couch.get("suburbs", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});