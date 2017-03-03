module.exports = function(RED) {
	var https = require('https');
	var qs = require('querystring');

    function LowerCaseNode(config) {
     RED.nodes.createNode(this,config);
     this.clientID = config.clientID;
     this.clientSecret = config.clientSecret;
		  var url_IMC = config.urlIMC;
	 this.refreshToken = config.refreshToken;
	 var channelQualifier = config.channelQualifier;
	 var config = config.source;

	 //var url_IMC = "api0.silverpop.com";


	 var bodyData = qs.stringify( {
	       'grant_type' : 'refresh_token',
	       'refresh_token' : this.refreshToken,
	       'client_id' : this.clientID,
	       'client_secret' : this.clientSecret
	     }
	     );

     var postheaders = {
	       'Content-Type': 'application/x-www-form-urlencoded',
	       'Content-Length': Buffer.byteLength(bodyData)
     };

     var node = this;

     this.on('input', function(msg) {

    var optionspost = {
		    host : url_IMC,
		    port : 443,
		    path : '/oauth/token',
		    method : 'POST',
		    headers : postheaders
		  };



		var reqPost = https.request(optionspost, function(res) {
		    console.log("statusCode: ", res.statusCode);

		    res.on('data', function(d) {
		        console.log('POST result:\n');

						token = d + "";
						if (typeof token === "string") {
								try {
										token = JSON.parse(token);
										console.log("TOKEN " + token.access_token);
										var options = {
										    host : url_IMC,
										    port : 443,
										    path : '/rest/channels/sms/externalconsentsends',
										    method : 'POST',
												headers: {
          											'Authorization':'Bearer ' + token.access_token,
																'Content-Type': 'application/json'
      									}
										  };
											console.log("OPTIONS " + options)
											var reqPost_2 = https.request(options, function(res2) {
											    console.log("statusCode: ", res.statusCode);
													res2.on('data', function(d) {
														console.log('POST result:\n');
										        process.stdout.write(d);
													});
												});
												msg.payload = JSON.parse(msg.payload);
												var body = '{"content": "'+msg.payload.message+'","contacts": [{"phoneNumber": "'+msg.payload.number+'","personalization": {"FNAME": "V"}}],"channelQualifier": "'+channelQualifier+'","source": "'+config+'"}';

												reqPost_2.write(body);
												//reqPost_2.write(test);
												reqPost_2.end();
												reqPost_2.on('error', function(e) {
												    console.log(e);
												    // info = info + "error : " + e;
												});
								}
								catch(e) { node.log(e+ "\n"+token); }
						}
		        console.log('\n\nPOST completed');
		    });
		});

		// write the json data
		reqPost.write(bodyData);
		reqPost.end();
		reqPost.on('error', function(e) {
		    console.log(e);
		    // info = info + "error : " + e;
		});

		node.send();

     });
 }

    RED.nodes.registerType("sms",LowerCaseNode);
}
