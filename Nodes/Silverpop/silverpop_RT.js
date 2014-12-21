module.exports = function(RED) {
	var http = require('http');
	
    function Silverpop(config) {
     RED.nodes.createNode(this,config);
     this.pod = config.pod;
     this.tableID = config.tableID;
	
     var postheaders = {
    'Content-Type' : 'text/xml'
     };
     
     var node = this;
     this.on('input', function(msg) {
		var info="";
		
		var d = new Date(); 
		var n = d.getDate();
		var n2 = d.getMonth();  
		var y = d.getFullYear(); 
		var openTag = '<Envelope><Body>\n';
		var closeTag = '\n</Body></Envelope>';
		var line_to_insert="<InsertUpdateRelationalTable><TABLE_ID>"+ node.tableID+ "</TABLE_ID><ROWS><ROW>"+
		"<COLUMN name=\"twitter\"><![CDATA[" +msg.payload.tweet.tweet_user+"]]></COLUMN>"+
		"<COLUMN name=\"timestamp\"><![CDATA["+ d +"]]></COLUMN>"+
		"<COLUMN name=\"date\"><![CDATA["+ n2 +"/"+ n +"/"+ y +"]]></COLUMN>"+
		"<COLUMN name=\"sentiment\"><![CDATA["+ msg.payload.tweet.sentiment + "]]></COLUMN>"+
		"</ROW></ROWS></InsertUpdateRelationalTable>";
		
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
        
    RED.nodes.registerType("RT",Silverpop);
}