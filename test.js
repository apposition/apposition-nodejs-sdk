/**
 * Copyright (c) 2017. Apposition. https://apposition.io
 **/

/*jslint node: true */
'use strict';
var AppositionClient = require('./lib/index');
var assert = require('assert');

var appId = '<APP ID>';
var appSecret = '<API secret>';
var client = new AppositionClient(appId, appSecret);
var date = new Date();
var currentTimestamp = date.getTime();
client.reportAppShopStatus('gapi-store-2.myshopify.com', 'installed', currentTimestamp, function(response) {
    assert.equal(response.success, true);
});

client.reportAppShopStatus('gapi-store-2.myshopify.com', 'uninstalled', currentTimestamp, function(response) {
    assert.equal(response.success, true);
});