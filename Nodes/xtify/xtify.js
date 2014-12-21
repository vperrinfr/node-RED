module.exports = function(RED) {
	var https = require('https');
	
    function LowerCaseNode(config) {
     RED.nodes.createNode(this,config);
     this.appkey = config.appkey;
     this.apikey = config.apikey;
	 this.xid = config.xid;
     
     var postheaders = {
    'Content-Type' : 'application/json'
     };
     
     var node = this;
     this.on('input', function(msg) {
		var info="";
		
		var json_message="{\"apiKey\":\""+ node.apikey + "\"," +
          "\"appKey\":\"" + node.appkey + "\"," + 
          "\"xids\": [\"" + node.xid + "\"]," +
          " \"content\": {"+
		  " \"subject\": \"" + node.subject + "\"," +
          "\"message\": \"" + msg.payload + "\"," +
          "\"action\": {" + 
          "\"type\": \"RICH\","+
          "\"label\":\"Open\"},\"rich\": {" +
          "\"subject\": \"" + node.subject+"\","+
          "\"message\": \"" + msg.payload + "\"}}}";
          
          info = info + "json_message " + json_message;
          
          var optionspost = {
		    host : 'api.xtify.com',
		    port : 443,
		    path : '/2.0/push',
		    method : 'POST',
		    headers : postheaders
		  };

		var reqPost = https.request(optionspost, function(res) {
		    console.log("statusCode: ", res.statusCode);
	
		 
		    res.on('data', function(d) {
		        console.log('POST result:\n');
		        process.stdout.write(d);
		        info = info + " output " + d;
		        console.log('\n\nPOST completed');   
		    });
		});
		 
		// write the json data
		reqPost.write(json_message);
		reqPost.end();
		reqPost.on('error', function(e) {
		    console.log(e);
		    // info = info + "error : " + e;
		});
          
		node.send(info);
		
     });
 }
        
    RED.nodes.registerType("xtify",LowerCaseNode);
}