/**
 * Module dependencies.
 */
let path = require('path');
let express = require('express');
let app = express();

// 模板引擎 ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.get('/index.html', function(req, res, next){
  res.render('index', { title: 'cors-demo' });
});

app.listen(80);
console.log('client started on port 80');
