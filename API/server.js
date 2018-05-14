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
    port: 5984,
    timeout: 30000
});

app.route('/api/:statename/suburbs').get((req, res) => {
    const stateName = req.params['statename'];
    console.log("Querying the info for all suburbs in "+stateName);
    const viewUrl = "_design/example/_view/StateSuburb";
    const queryOptions = {
        'key': stateName,
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/suburb/:state/:name').get((req, res) => {
    const suburbName = req.params['name'];
    const stateName = req.params['state'];
    console.log("Querying the info for suburb:"+suburbName);
    const viewUrl = "_design/example/_view/suburbDetails";
    const queryOptions = {
        'key': [stateName,suburbName],
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:state/salary/top').get((req, res) => {
    const stateName = req.params['state'];
    console.log("Querying the info for top 10 suburb with highest salary:"+stateName);
    const viewUrl = '_design/example/_view/salarySuburb';
    const startKey = [stateName+'zzz'];
    const endKey = [stateName];
    const queryOptions = {
        'startkey' : startKey,
        'endkey': endKey,
        'descending': true,
        'limit': 10,
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:state/illiterate/top').get((req, res) => {
    const stateName = req.params['state'];
    console.log("Querying the info for top 10 suburb with highest literacy:"+stateName);
    const viewUrl = '_design/example/_view/literacyRateSuburb';
    const startKey = [stateName];
    const endKey = [stateName+'zzz'];
    const queryOptions = {
        'startkey' : startKey,
        'endkey': endKey,
        'limit': 10,
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:state/unistudents/top').get((req, res) => {
    const stateName = req.params['state'];
    console.log("Querying the info for top 10 suburb with highest number of university students:"+stateName);
    const viewUrl = '_design/example/_view/UniStudentSuburb';
    const startKey = [stateName+'zzz'];
    const endKey = [stateName];
    const queryOptions = {
        'startkey' : startKey,
        'endkey': endKey,
        'descending': true,
        'limit': 10,
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:state/employment/top').get((req, res) => {
    const stateName = req.params['state'];
    console.log("Querying the info for top 10 suburb with highest number of university students:"+stateName);
    const viewUrl = '_design/example/_view/EmployedSuburb';
    const startKey = [stateName+'zzz'];
    const endKey = [stateName];
    const queryOptions = {
        'startkey' : startKey,
        'endkey': endKey,
        'descending': true,
        'limit': 10,
        'include_docs': true
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
});

app.route('/api/:state/emotions/:emotion/top').get((req, res) => {
    const stateName = req.params['state'];
    const emotionname = req.params['emotion'];
    console.log("Querying the info for top 10 suburb with highest number of university students:"+stateName);
    getSuburbEmotionsByState(stateName,emotionname,res);
});

function getSuburbEmotionsByState(stateName, emotion, res) {
    const viewUrl = '_design/example/_list/sortByAttribute/SentimentTweetStateSuburb';
    const queryOptions = {
        'group' : true,
        'group_level': 2,
        'sentiment': emotion,
        'min': 1,
        'state': stateName,
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
};

app.route('/api/emotion/:state/:suburb').get((req, res) => {
    const stateName = req.params['state'];
    const suburbname = req.params['suburb'];
    getSuburbEmotionsByName(stateName,suburbname,res);
});

function getSuburbEmotionsByName(stateName, suburbname, res) {
    console.log("Querying" + suburbname+ " emotions info:");
    const viewUrl = '_design/example/_view/SentimentTweetStateSuburb';
    const queryOptions = {
        'group' : true,
        'key': [stateName,suburbname]
    };
    couch.get("twitter", viewUrl, queryOptions).then(({data, headers, status}) => {
        res.send({data});
    }, err => {
        console.error(err);
        res.send({err});
    }); 
};

