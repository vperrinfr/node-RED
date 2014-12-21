module.exports = function(RED) {
	var http = require('http');
	
    function Silverpop_optin(config) {
     RED.nodes.createNode(this,config);
     this.pod = config.pod;
     this.tableID = config.tableID;
	
     var postheaders = {
    'Content-Type' : 'text/xml'
     };
     
     var node = this;
     this.on('input', function(msg) {
		var info="";

		var openTag = '<Envelope><Body>\n';
		var closeTag = '\n</Body></Envelope>';
		
		var line_to_insert="<AddRecipient><LIST_ID>"+node.tableID+"</LIST_ID><CREATED_FROM>1</CREATED_FROM>"+
		"<UPDATE_IF_FOUND>true</UPDATE_IF_FOUND>"+
		"<COLUMN>"+
			"<NAME>name</NAME>"+
			"<VALUE>"+ msg.tweet.user.name +"</VALUE>"+
		"</COLUMN>"+
		"<COLUMN>"+
			"<NAME>screen_name</NAME>"+
			"<VALUE>"+	msg.tweet.user.screen_name +"</VALUE>"+
		"</COLUMN>"+
		"<COLUMN>"+
			"<NAME>location</NAME>"+
			"<VALUE>"+ msg.tweet.user.location+"</VALUE>"+
		"</COLUMN>"+
		"<COLUMN>"+
			"<NAME>sentiment</NAME>"+
			"<VALUE>"+	msg.payload.tweet.sentiment +"</VALUE>"+
		"</COLUMN>"+
		"<COLUMN>"+
			"<NAME>followers_count</NAME>"+
			"<VALUE>"+	msg.tweet.user.followers_count +"</VALUE>"+
		"</COLUMN>"+
		"</AddRecipient>";
				
		var XML_message = openTag + line_to_insert + closeTag;
		info = info + "XML_message " + XML_message;
		//console.log("MESSAGE " + msg);
		var path_context = "/XMLAPI" + msg.jsessionid;
		
		console.log("XML_message " +XML_message);
		console.log("path_context " +path_context);
          
          var optionspost = {
		    host : node.pod,
		    port : 80,
		    path : path_context,
		    method : 'POST',
		    headers : postheaders
		  };

		var reqPost = http.request(optionspost, function(res) {
		    console.log("statusCode: ", res.statusCode);
	
		 
		    res.on('data', function(d) {
		        //console.log('POST result:\n');
		        process.stdout.write(d);
		        info = info + " output " + d;
				node.send("Good " + d);
		       // console.log('\n\nPOST completed');   
		    });
		});
		 
		// write the json data
		reqPost.write(XML_message);
		reqPost.end();
		reqPost.on('error', function(e) {
		    console.log(e);
		    // info = info + "error : " + e;
		});
          
		
		
     });
 }
        
    RED.nodes.registerType("Opt-in",Silverpop_optin);
}