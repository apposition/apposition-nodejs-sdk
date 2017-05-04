/**
 * Copyright (c) 2017. Apposition. https://apposition.io
 **/

/*jslint node: true */
'use strict';
var https = require('https');
var CryptoJS = require("crypto-js");

/**
 * Create AppositionClient
 * @param {string} appId Application ID
 * @param {string} appSecret Application API secret
 * @constructor
 * @class
 */
function AppositionClient(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
}

AppositionClient.prototype = (function () {
    /**
     * Make authorized request to Apposition API
     * @param endpoint {string} API endpoint
     * @param path {string} API path
     * @param method {string} HTTP Method
     * @param appId {string} Application ID
     * @param appSecret {string} Application secret
     * @param callback {callback} Response callback
     * @param data {object} Object to send, object is JSON serialized before it is sent
     * @param version {string} SDK version
     * @return {object} Data received from API response
     */
    function makeRequest(endpoint, path, method, appId, appSecret, callback, data, version) {
        var req, payload, options, headers = {}, date, timestamp, hmac;

        if (data !== undefined) {
            headers['Content-Type'] = 'application/json';
        }

        headers['User-Agent'] = 'Apposition/NodeJS/' + version;

        if (data !== undefined) {
            payload = JSON.stringify(data);
            headers['Content-Length'] = Buffer.byteLength(payload);
        }

        date = new Date();
        timestamp = date.getTime();

        hmac = CryptoJS.HmacSHA256("" + appId + timestamp + payload, appSecret);

        path += "?id=" + encodeURIComponent(appId) + "&timestamp=" + encodeURIComponent(timestamp) + "&hmac=" + encodeURIComponent(hmac);
        options = {
            host: endpoint,
            port: '443',
            path: path,
            method: method,
            headers: headers
        };

        req = https.request(options, function (res) {
            var response = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                response += chunk;
            });
            res.on('end', function () {
                try {
                    var json = JSON.parse(response);
                    callback(json, null);
                } catch (e) {
                }
            });
            res.on('error', function (err) {
                try {
                    var json = JSON.parse(response);
                    callback(json, err);
                } catch (e) {
                }
            });
        });

        if (data !== undefined) {
            req.write(payload);
        }
        req.end();
    }

    return {
        version: '1.0.0',
        appId: '',
        appSecret: '',
        endpoint: 'app.apposition.io',
        constructor: AppositionClient,

        /**
         * Called if Fetching URL is done.
         * @callback AppositionClient~AppositionEventSaveCallback
         * @param {AppositionResponse} response Apposition event response
         * @param {string} errorInfo Error info
         * @returns undefined
         */

        /**
         * Send application shop status
         * @param {string} shop_url Shop URL
         * @param {string} status Shop app install status (installed, uninstalled)
         * @param {number} timestamp UTC Timestamp of event in ms
         * @param {AppositionClient~AppositionEventSaveCallback} callback Response callback
         */
        reportAppShopStatus: function (shop_url, status, timestamp, callback) {
            var date = new Date();
            var currentTimestamp = date.getTime();
            makeRequest(this.endpoint, '/apprank/api/report', 'POST', this.appId, this.appSecret, callback, {
                'shopURL': shop_url,
                'status': status,
                'timestamp': (typeof timestamp === 'undefined' || timestamp === null ? currentTimestamp : timestamp)
            }, this.version);
        }
    };
})
();

module.exports = AppositionClient;