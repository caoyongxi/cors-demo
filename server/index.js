/**
 * server
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
	allowedHeaders: 'client-header',
	exposedHeaders: 'serve-header',
	maxAge: '1800', // 预请求缓存30分钟=1800秒 
};

app.use(cors(corsOptions));

// parses request cookies
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.get('/api/getcors', function(req, res) {
	res.setHeader('serve-header','from->express');
  res.send({ cors: 'cors-get请求' });
});

app.get('/api/getcors2', function(req, res) {
	res.setHeader('serve-header','from->express');
  res.send({ cors: 'cors-get请求' });
});

app.post('/api/formcors', function(req, res) {
  res.send({ cors: 'cors-post请求' });
});

app.listen(3000);
console.log('server started on port 3000');
