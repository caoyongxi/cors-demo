/**
 * Module dependencies.
 */
let path = require('path');
let express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
const cors = require('cors');

// 跨域中间件
let corsOptions = {
	origin: 'http://huoyun-test.djtest.cn',
	credentials: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'myheader',
	exposedHeaders: 'serve-header'
};

app.use(cors(corsOptions));

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.get('/api/getcors', function(req, res) {
  res.send({ cors: 'cors-get请求' });
});

// // 没有对应的路径时，跨域也会报错
app.post('/api/formcors', function(req, res) {
  res.send({ cors: 'cors-post请求' });
});

app.listen(3000);
console.log('server started on port 3000');
