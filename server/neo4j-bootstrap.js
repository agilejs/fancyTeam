'use strict';

var request = require('superagent');
var config = require('./config');

module.exports.configureAutoIndex = function () {
    // Enable auto-indexing, primarily needed for heroku,
    // where we dont have access to neo4j.properties.
    // See http://bit.ly/12fL6Gy
    request.post(config.neo4j.url + '/db/data/index/node')
        .type('application/json')
        .send({
            'name' : 'node_auto_index',
            'config' : {
                'type' : 'exact',
                'provider' : 'lucene'
            }
        }).end(function (err, res) {
            if (err) {
                console.error(err);
            } else if (res.status !== 201) {
                if (res.body.message) {
                    console.error(res.body.message);
                    console.log(res.body);
                } else {
                    console.error(res.body);
                }
            } else {
                console.log('Added index "node_auto_index"');
            }
        });

    request.put(config.neo4j.url + '/db/data/index/auto/node/status')
        .type('application/json')
        .send(true)
        .end(function (err, res) {
            if (err) {
                console.error(err);
            } else if (res.status !== 204) {
                console.error(res.body);
            } else {
                console.log('Activated neo4j auto-indexing');
            }
        });

    ['id','type','title','release'].forEach(function (property) {
        request.post(config.neo4j.url + '/db/data/index/auto/node/properties')
            .type('application/json')
            .send(property)
            .end(function (err, res) {
                if (err) {
                    console.error(err);
                } else if (res.status !== 204) {
                    console.error(res.body);
                } else {
                    console.info('Added property ' + property +
                            ' to neo4j auto-indexing.');
                }
            });
    });
};
