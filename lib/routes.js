module.exports = function () {
  var sqlite3 = require('sqlite3').verbose(),
      db      = new sqlite3.Database(process.env['RADIUS_DB']),
      sys     = require('sys'),
      exec    = require('child_process').exec,
      command = process.env['RADIUS_SYNC'],
      admin   = process.env['RADIUS_UI_ADMIN'];
      adminPassword = process.env['RADIUS_UI_PASSWORD'];

  function routes(app, config, io) {
    function sync() {
      function puts(error, stdout, stderr) { sys.puts(stdout) }
      exec(command, puts);
    }

    function authenticate(req, res) {
      var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
      console.log("Authorization Header is: ", auth);
      if(!auth) {     // No Authorization header was passed in so it's the first time the browser hit us
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.status(401).end();
        return false;
      }
      else if(auth) {    // The Authorization was passed in so now we validate it
        var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

        var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
        var plain_auth = buf.toString();        // read it back out as a string
        console.log("Decoded Authorization ", plain_auth);

        // At this point plain_auth = "username:password"
        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        if((username == admin) && (password == adminPassword)) {   // Is the username/password correct?
          return true;
        }
        else {
          res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
          res.status(401).end();
          return false;
        }
      }      
    }

    // GET
    app.post('/radius/api/v1/reset', function (req, res) {
      if (authenticate(req,res) == false) {
        return;
      }

      db.all("SELECT username FROM radcheck WHERE username = $username", {$username:req.body.username}, function(err,rows) {
        if (rows.length === 1) {
          if (req.body.create) {
            return res.status(409).end();
          }

          console.log('update ' + req.body.username);
          db.all("UPDATE radcheck SET value = $password WHERE username = $username", {$username:req.body.username, $password:req.body.password}, function(err,rows) {
            if (!rows || err) {
              return res.status(500).end();
            }
            sync();
            return res.status(204).end();
          });
        } else {
          if (!req.body.create) {
            return res.status(404).end();
          }
          db.all("INSERT INTO radcheck (username,attribute,op,value) VALUES ($username, 'Cleartext-Password', ':=', $password)", {$username:req.body.username, $password:req.body.password}, function(err,rows) {
            if (!rows || err) {
              return res.status(500).end();
            }
            sync();
            return res.status(204).end();
          });
        }
      });
    });
  }
  return routes;
}();