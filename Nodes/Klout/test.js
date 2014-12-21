var Klout = require("./node_klout");
var klout_v2 = new Klout("fvqnjbdaqhc7vjxxxjha99x2");
var assert = require("assert");
var events = require("events");
var util = require("util");

// Get Klout identity from Twitter screen name
klout_v2.getKloutIdentity("vperrin", function(error, klout_user) {
try {
console.log("klout_user.id" + klout_user.id);
klout_v2.getUserScore(klout_user.id, function(error, klout_response) {
try {
console.log(klout_response.score);

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

