var
  fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  modules = path.join(__dirname, '..', 'node_modules', 'wru', 'node', 'program.js'),
  tests = [],
  ext = /\.js$/,
  code = 0,
  many = 0;

function exit($code) {
  if ($code) {
    code = $code;
  }
  if (!--many) {
    if (!code) {
      fs.writeFileSync(
        path.join(__dirname, '..', 'index.html'),
        fs.readFileSync(
          path.join(__dirname, '..', 'index.html'),
          'utf-8'
        ).replace(/var TESTS = \[.*?\];/, 'var TESTS = ' + JSON.stringify(tests) + ';'),
        'utf-8'
      );
    }
    process.exit(code);
  }
}

fs.readdirSync(__dirname).filter(function(file){
  if (ext.test(file) && (fs.existsSync || path.existsSync)(path.join(__dirname, '..', 'src', file))) {
    ++many;
    tests.push(file.replace(ext, ''));
    spawn(
      'node', [modules, path.join('test', file)], {
      detached: false,
      stdio: [process.stdin, process.stdout, process.stderr]
    }).on('exit', exit);
  }
});