
// Octoblu-Node-Pixel-Jars
// John Moody horacegoesskiing.com @johnmoody
//
// Version: 0.2
//
// Overview:  
// This script uses messages recieved from Octoblu to light up a specific neopixel in a strip. Colour is dependent on the value of "cpu".
//
// Future Roadmap:
// The eventual purpose of this script is to power an art installation known as "Jars", each Jar (neo-pixel in a glass jar) represents a XenApp server and 
// will "display" it's current CPU usage or any value between 0 and 100 - could easily be used to display number of users per server etc.
// Think of it as 3D perfmon ;-)
//
// Credits:
// Many thanks to: @ajfisher, @virgilvox, @stevegreenberg, @chrismatthieu, @HSNOTTS for Octoblu advice and encouragement!
// Uses bits of different scripts, including:
// - Node-Pixel example scripts by @pierceray
// - https://developer.octoblu.com/docs/nodejs-example
//
// Requirements:  
// Octoblu account: http://www.octoblu.com
// Node:http://www.node.org
// node-pixel: https://github.com/ajfisher/node-pixel
//
// Usage:
// More in-depth article at www.horacegoesskiing.com
// 1) Setup and configure node.
// 2) Setup and configure node-pixel.
// 3) Test you can light up your neopixels using only above.
// 4) In Octoblu create a "Generic Device", grab the UUID and Token - insert in lines below.
// 5) Fire up the script using "node index port", i.e node index COM13
// 6) Send messages from Octoblu data.thispixel, data.cpu

//var pixel = require("./node_modules/node-pixel/lib/pixel.js");

var pixel = require("node-pixel");
var meshblu = require("meshblu");
var five = require("johnny-five");
var strip = null;
var fps = 13;
var thispixel = null;
var cpu = null;
var opts = {};
opts.port = process.argv[2] || "";
var board = new five.Board(opts);

console.log("Setting up Pixels");
board.on("ready", function() {
    strip = new pixel.Strip({
        data: 6,
        length: 7,
        board: this,
        controller: "FIRMATA",
		// controller: "I2CBACKPACK"
	});
	strip.on("ready", function() {
    console.log("Pixels ready, connecting to Octoblu!");
    // Octoblu Connection - see https://developer.octoblu.com/docs/nodejs-example
    var conn = meshblu.createConnection({
    // Grab the UUID and Token of your Octoblu "Generic Device" and enter here
	"uuid" : "Your UUID",
	"token" : "Your Token"
	});
console.log("...Connected! Waiting for a message from Octoblu!");

// When we recieve a message from Octoblu....
conn.on('message', function(data){
	        // We proably need to make this more inteligent, i.e read the message in interpret the command, modded at the moment to pick up a reset code 99
			console.log("message recieved from Octoblu!", data);
			thispixel = data.thispixel;
			cpu = data.cpu;
			console.log(thispixel);
			if (thispixel == 99) {
				resetPixel();
			} else {
				dynamicPixel();
			};
});
});
});
// Set a Trigger in Octoblu to reset the pixels - needed for testing.

function resetPixel(){
        console.log("Reset Pixels command received");	
		// below lifted from node-pixel/examples/rainbow-dynamic.js
		for(var i = 0; i < strip.stripLength(); i++) {
                strip.pixel( i ).color("#000000");
            }
		strip.show();
		}
		
function dynamicPixel(){
	// This function light up pixel number 'thispixel' with a colour, the colour is based on the value of 'cpu'
	// The intention is that Octoblu passes a pixel number (which would be a server number) and the value of cpu (cpu % for example)
	// ...And thus, boring server metrics become art ;-)
	// Below is possibly terrible programming.  
	// Ideally, I'd like a function to work out a colour, possibly using something like http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
				
        console.log("Light up the pixel");
 		// Pixel Colours are in GRB format  - commented colours are wrong, Known Issue.
		  if (cpu < 1) //Your server has died - BSOD Blue!
		{
          strip.pixel( thispixel ).color("#0000FF");  //BSOD Blue
        } else if (cpu < 10) {
     	  strip.pixel( thispixel ).color("#8000FF"); 
		} else if (cpu < 20) {
     	  strip.pixel( thispixel ).color("#8000FF"); 
		} else if (cpu < 30) {
     	  strip.pixel( thispixel ).color("#8000FF");
		} else if (cpu < 40) {
     	  strip.pixel( thispixel ).color("#8000FF");  
		} else if (cpu < 50) {
     	  strip.pixel( thispixel ).color("#FF00FF"); 
		  } else if (cpu < 60) {
     	  strip.pixel( thispixel ).color("#FF0080"); 
		  } else if (cpu < 70) {
     	  strip.pixel( thispixel ).color("#FF0000"); 
		  } else if (cpu < 80) {
     	  strip.pixel( thispixel ).color("#FF8000"); 
		  } else if (cpu < 90) {
     	  strip.pixel( thispixel ).color("#FFFF00");  
		  } else if (cpu < 100) {
     	  strip.pixel( thispixel ).color("#80FF00"); 
		  } else if (cpu = 100) {
     	  strip.pixel( thispixel ).color("#00FF00"); // Maxed out Red
		  }
		strip.show();
	}
	
