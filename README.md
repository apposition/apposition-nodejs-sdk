Apposition-NodeJS-SDK
================

*Apposition NodeJS SDK* is the official SDK wrapper for the [Appostion API service](https://apposition.com)

API docs: [https://github.com/apposition/api](https://github.com/apposition/api/)

Requirements
------------

- NodeJS 0.10+

User Installation
-----------------

    npm install apposition
    
Initialize Apposition client via:

    var AppositionClient = require('apposition');
    var client = new AppositionClient('<App ID>', '<App secret>');

Report install / uninstall event

    var shop_url = 'happy-customers.myshopify.com';
    var status = 'installed'; // or 'uninstalled'
    // UTC timestamp in ms when install / uninstall occurred, default should be current timestamp
    var timestamp = new Date().getTime();
    client.reportAppShopStatus(shop_url, status, timestamp, function (savedEvent) {
        console.log(savedEvent);
    });

If you have questions, email us at [help@apposition.io](mailto:help@apposition.io).