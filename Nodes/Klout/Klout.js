module.exports = function(RED) {
	
	
    function Klout(config) {
     RED.nodes.createNode(this,config);
     var Klout = require("./node_klout");
	 
	 this.appkey = config.appkey;
	 var klout_v2 = new Klout("fvqnjbdaqhc7vjxxxjha99x2");
     	 
     var node = this;
     this.on('input', function(msg) {
		console.log("Klout Node");
	 //Get Klout identity from Twitter screen name
		klout_v2.getKloutIdentity(msg.tweet.user.screen_name, function(error, klout_user) {
		try {
		
		klout_v2.getUserScore(klout_user.id, function(error, klout_response) {
			try {
			console.log(" KLOUT SCORE of" + msg.tweet.user.name + " is " +klout_response.score);
			
			msg.klout = klout_response.score.toString().substring(0, 4);
			node.send(msg);

			}
			catch (ex) {
			console.log("Error" + ex);
			}
			});
		}
		catch (ex) {
		console.log("Error" + ex);
		}
		});
     });
	 
 }
        
    RED.nodes.registerType("Klout",Klout);
}