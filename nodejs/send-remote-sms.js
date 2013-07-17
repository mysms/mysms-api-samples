#!/usr/bin/js

var https = require('https');

var API_KEY = "Your API Key"; // Your api key
var USER_MSISDN = 123456789; // Your msisdn in international format without plus
var USER_PASSWORD = ""; // Your password
var RECIPIENT_MSISDN = "+123456789"; // Recipient msisdn in international format 

request('/json/user/login', {
    "apiKey" : API_KEY,
    "msisdn" : USER_MSISDN,
    "password" : USER_PASSWORD,
  }, function (error, result) {
  if (result.errorCode == 0) {
    request('/json/remote/sms/send', {
      "recipients" : [ RECIPIENT_MSISDN ],
      "message" : "Hello, this a simple NodeJS test",
      "encoding" : 0,
      "smsConnectorId" : 0,
      "store" : true,
      "authToken" : result.authToken,
      "apiKey" : API_KEY
    }, function (error, result) {
      if (result.errorCode == 0) {
        console.info('your remote sms request has been succesfully send');
      } else {
        console.info('remote sms send request failed with error code: ' + result.errorCode)
      }
    });
  } else {
    console.info('login request failed with error code: ' + result.errorCode);
  }
});

function request(path, request, callback) {
  var requestObject = JSON.stringify(request);
  var postheaders = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(requestObject, 'utf8')
  };
  var optionspost = {
    host : 'api.mysms.com',
    port : 443,
    path : path,
    method : 'POST',
    headers : postheaders
  };
  
  var post = https.request(optionspost, function(response) {
    response.on('data', function(data) {
	if (response.statusCode == 200) {
	  callback("", JSON.parse(data));
	} else {
	  callback("request failed with status code: " + response.statusCode + " - " + data, { errorCode: 99 });
	}
    });
  });

  post.write(requestObject);
  post.end();
  post.on('error', function(e) {
    callback(e, { errorCode: 99 });
  });
}
