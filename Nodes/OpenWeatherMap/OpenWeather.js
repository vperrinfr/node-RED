module.exports = function(RED) {
	var http = require('http');
	
    function OpenWeather(config) {
     RED.nodes.createNode(this,config);
     this.pod = config.pod;
     this.tableID = config.tableID;
	 this.login = config.login;
     this.password = config.password;
          
     var node = this;
     this.on('input', function(msg) {
		var info="";
		 
		  var context = "/data/2.5/weather?q=" + msg.location;
		  
          var optionspost = {
		    host : "api.openweathermap.org",
		    port : 80,
		    path : context,
		    method : 'GET'
		  };

		var reqPost = http.request(optionspost, function(res) {
		    //console.log("statusCode: ", res.statusCode);

		    res.on('data', function(d) {
		        console.log('POST result:\n');
		        
		        //process.stdout.write(d);
		        msg.weather = d + "";
				
				if (msg.hasOwnProperty("weather")) {
                if (typeof msg.weather === "string") {
                    try {
                        msg.weather = JSON.parse(msg.weather);
                        node.send(msg);
                    }
                    catch(e) { node.log(e+ "\n"+msg.weather); }
                }
                else if (typeof msg.weather === "object") {
                    if (!Buffer.isBuffer(msg.weather) ) {
                        if (!util.isArray(msg.weather)) {
                            msg.weather = JSON.stringify(msg.weather);
                            node.send(msg);
                        }
                    }
                }
                else { node.log("dropped: "+msg.weather); }
            }
				
				});
		        //console.log('\n\nPOST completed');   
		    });
		 
		// write the json data
		reqPost.write("");
		reqPost.end();
		
		reqPost.on('error', function(e) {
		    //console.log(e);
		    // info = info + "error : " + e;
		});
     });
 }
        
    RED.nodes.registerType("OpenWeather",OpenWeather);
}