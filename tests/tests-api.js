// to run manually: mocha -u tdd -R spec tests/tests-api.js
var express = require('express');
var router = express.Router();
var expect = require('chai').expect;
var rest = require('restler');
var appSettings = require('../settings');

var reviewsUrl = appSettings.apiReviewsUrl;
var travellerTypesUrl = appSettings.apiTravellerTypesUrl;

// API tests
suite('API tests', function() {
    test('API data for REVIEWS should be array, and its length should be > 0', function(done) {
        rest.get(reviewsUrl)
            .on('success', function(data) {
                //console.log(data);
                expect(data instanceof Array);
                expect(data.length > 0);
                done();
            })
            .on('error', function() {
                expect(false, 'API reviews error');
            });
    });

    test('API data for TRAVELLER TYPES should be array, and its length should be > 0', function(done) {
        rest.get(travellerTypesUrl)
            .on('success', function(data) {
                //console.log(data);
                expect(data instanceof Array);
                expect(data.length > 0);
                done();
            })
            .on('error', function() {
                expect(false, 'API traveller types error');
            });
    });
});
