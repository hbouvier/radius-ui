// Start the server
var app = require('tomahawk').create(
    {
        port    :5080,
        www     : "www",
        level   : "debug",
        plugins : {
            "radius-ui" : {
                "implementation" : __dirname + "/lib/"
            }
        }
    }).start();
