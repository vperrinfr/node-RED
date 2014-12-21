module.exports = function(RED) {
	var http = require('http');
	var parseString = require('xml2js').parseString;
	
    function silverpop_login(config) {
     RED.nodes.createNode(this,config);
     this.pod = config.pod;
     this.tableID = config.tableID;
	 this.login = config.login;
     this.password = config.password;
     
     var postheaders = {
    'Content-Type' : 'text/xml'
     };
     
     var node = this;
     this.on('input', function(msg) {
		var info="";
		
		var openTag = '<Envelope><Body>\n';
		var closeTag = '\n</Body></Envelope>';
		var login_xml='<Login>\n<USERNAME>' + node.login + '</USERNAME>\n<PASSWORD>' + node.password +'</PASSWORD>\n</Login>'; 
		var login_message=openTag + login_xml + closeTag;
		info = info + "Pod "+ node.pod + "  login_message " + login_message;
          
          var optionspost = {
		    host : node.pod,
		    port : 80,
		    path : '/XMLAPI',
		    method : 'POST',
		    headers : postheaders
		  };

		var reqPost = http.request(optionspost, function(res) {
		    //console.log("statusCode: ", res.statusCode);

		    res.on('data', function(d) {
		        console.log('POST result:\n');
		        process.stdout.write(d);
		        xml = "" + d;
				//console.log(xml);
				parseString(xml, function (err, result) {
				//console.log(result);
				var json_full = JSON.stringify(result);
				
				var obj = JSON.parse(json_full);
				//console.log("OBJ" + obj);
				var jsessionID = obj.Envelope.Body[0].RESULT[0].SESSION_ENCODING;
				//console.log("jsessionID" + jsessionID);
				msg.jsessionid = ""+jsessionID;
				node.send(msg);
				});
		        //console.log('\n\nPOST completed');   
		    });
		});
		 
		// write the json data
		//console.log('POST Write:\n' + login_message);
		reqPost.write(login_message);
		reqPost.end();
		console.log('POST Written:\n');
		reqPost.on('error', function(e) {
		    //console.log(e);
		    // info = info + "error : " + e;
		});
     });
 }
        
    RED.nodes.registerType("Login",silverpop_login);
}