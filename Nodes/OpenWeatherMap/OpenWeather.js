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
		        process.stdout.write(d);
		        msg.weather = d + "";
				node.send(msg);
				});
		        //console.log('\n\nPOST completed');   
		    });
		 
		// write the json data
		reqPost.write("");
		reqPost.end();
		console.log('POST Written:\n');
		reqPost.on('error', function(e) {
		    //console.log(e);
		    // info = info + "error : " + e;
		});
     });
 }
        
    RED.nodes.registerType("OpenWeather",OpenWeather);
}