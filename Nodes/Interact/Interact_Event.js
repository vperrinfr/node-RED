module.exports = function(RED) {
	var http = require('http');
	
    function Interact_Event(config) {
     RED.nodes.createNode(this,config);
	 
     this.url = config.url;
     this.port = config.port;
	 this.session = config.session;
	 this.ic = config.ic;
     this.AudienceLevel = config.AudienceLevel;
	 this.AudienceICName = config.AudienceICName;
	 this.AudienceICType = config.AudienceICType;
     this.rely = config.rely;
	 this.debug = config.debug;
     this.ip = config.ip;
     this.number = config.number;
     
	 var postheaders = {
    'Content-Type' : 'application/json'
     };
	 
     var node = this;
	 
     this.on('input', function(msg) {
		var info="";
		var event = msg.event;
		var indiv_id=msg.indiv_id;
		
		console.log("node.session " + node.session);
		var batch ="{\"sessionId\": \"" + node.session + "\"," +
    "\"commands\": [" +
    "   {" +
            "\"audienceLevel\": \"" + node.AudienceLevel+ "\","+
            "\"debug\": "+node.debug+"," +
            "\"action\": \"startSession\","+
            "\"ic\": \"" + node.ic + "\"," +
            "\"relyOnExistingSession\": "+node.relys+ "," +
            "\"audienceID\": [" + 
            "    {" +
                    "\"t\": \""+ node.AudienceICType+"\","+
                    "\"v\": " + indiv_id+ ","+
                    "\"n\": \""+ node.AudienceICName+"\""+
             "   }"+
            "]"+
       "},"+
        "{"+
            "\"action\": \"postEvent\","+
            "\"event\": \"" + event + "\""+
       " }"+
    "]"+
"}";
console.log("Batch : " + batch);
		  
          var optionspost = {
		    host : node.url,
		    port : node.port,
		    path : '/interact/servlet/RestServlet',
		    method : 'POST',
			headers : postheaders
		  };

		var reqPost = http.request(optionspost, function(res) {
		    //console.log("statusCode: ", res.statusCode);

		    res.on('data', function(d) {
		        console.log('POST result:\n');
		        process.stdout.write(d);
		        msg.interact = d+"";
				
				if (msg.hasOwnProperty("interact")) {
                if (typeof msg.interact === "string") {
                    try {
                        msg.interact = JSON.parse(msg.interact);
                        node.send(msg);
                    }
                    catch(e) { node.log(e+ "\n"+msg.interact); }
                }
                else if (typeof msg.interact === "object") {
                    if (!Buffer.isBuffer(msg.interact) ) {
                        if (!util.isArray(msg.interact)) {
                            msg.interact = JSON.stringify(msg.interact);
                            node.send(msg);
                        }
                    }
                }
                else { node.log("dropped: "+msg.interact); }
            }
				
				});
		    });
		 
		// write the json data
		reqPost.write(batch);
		reqPost.end();
		// console.log('POST Written:\n');
		reqPost.on('error', function(e) {
		    //console.log(e);
		    // info = info + "error : " + e;
		});
     });
 }
        
    RED.nodes.registerType("Interact_Event",Interact_Event);
}