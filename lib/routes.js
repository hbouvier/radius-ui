module.exports = function () {
  var sqlite3 = require('sqlite3').verbose(),
      db      = new sqlite3.Database(process.env['RADIUS_DB']),
      sys     = require('sys'),
      exec    = require('child_process').exec,
      command = process.env['RADIUS_SYNC'];

  function routes(app, config, io) {
    function sync() {
      function puts(error, stdout, stderr) { sys.puts(stdout) }
      exec(command, puts);
    }

    // GET
    app.post('/radius/api/v1/reset', function (req, res) {
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