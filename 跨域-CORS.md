# 跨域-CORS

> 对前端来说跨域应该是不陌生的，解决跨域的方案有很多种。而我司接口调用采用的正是CORS的方式，所以难免在调接口的时候会遇见一些跨域的问题，下面通过一个简单的demo验证一下CORS解决跨域的过程中对一些不清楚的知识点做一个简单的总结，如果你之后的工作中有遇到CORS相关的问题时可以通过这个demo来改写相关的配置进行验证，找到问题的所在

示例demo已经放在[GitHub](https://github.com/wuba/wwto) 上

demo目录结构如下： client目录作为客户端、server目录作为处理CORS的服务端，分别把两端的代码跑起来，就可以进行CORS相关配置的学习了
![](https://user-gold-cdn.xitu.io/2020/7/12/1734146bcf50081a?w=1460&h=873&f=png&s=54531) 

对CORS的了解可以先看下一下阮老师的这两篇文章:   
1、[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)  
2、[跨域资源共享CORS详解](http://www.ruanyifeng.com/blog/2016/04/cors.html) 


1、假设你已经了解服务端处理CORS时会配置相关的一些响应头，如下：
```JavaScript
Access-Control-Allow-Credentials: true,
Access-Control-Allow-Origin: *,
Access-Control-Allow-Headers: 'header',
Access-Control-Expose-Headers: 'serve-header',
Access-Control-Allow-Methods: 'methods',
Access-Control-Max-Age: '1800', // 30min = 1800s
```

那这些响应头都具体是神马作用呢？ 下面会结合demo来了解各参数的配置作用，并给出结果图。

**第一个参数：** Access-Control-Allow-Origin作用：服务端允许跨域的源，也就是浏览器的输入的地址,demo中为：`http://huoyun-test.djtest.cn` 包括端口号80，80端口默认省略了。 

如果把server端的origin改为: `http://huoyun-online.djtest.cn`, 当发送请求的时候，浏览器包如下错误：
![](https://user-gold-cdn.xitu.io/2020/7/12/1734182b9c88c650?w=1921&h=885&f=png&s=57554)

由请求头和响应头以及控制台(1、2、3)三点得出：控由于CORS的策略，通过浏览器预检请求options得出源Origin对应的url不在CORS跨域允许的范围类，因此呢，服务端应该设置对应的页面域名`http://huoyun-test.djtest.cn`，这样才不会报这样的错误。

**第二个参数：** Access-Control-Allow-Credentials 作用：携带cookie  

如果调用接口过程中，需要cookie的传递，则需要设置这个参数为true，并且Access-Control-Allow-Origin就不能设为星号*，必须指定明确的、与请求网页一致的域名。 如果前端采用axios来请求接口时，需同时设置`axios.defaults.withCredentials = true;`

这里如果设置 `Access-Control-Allow-Origin: *` ，会报如下的错误:![](https://user-gold-cdn.xitu.io/2020/7/12/173419af93831313?w=1922&h=893&f=png&s=60820)
也就是上面说的Access-Control-Allow-Origin此时不能设置为星号*，如果不需要携带cookie时即不设置Access-Control-Allow-Credentials响应头，但此时前端设置了`axios.defaults.withCredentials=true;`，浏览器也会包类似的错误：![](https://user-gold-cdn.xitu.io/2020/7/12/17341a3e0c6db429?w=1522&h=155&f=png&s=9264) 

即当浏览器通过XMLHttpRequest对象发送请求时，设置了withCredentials属性为true时，对应的服务端此时需要做相应的处理，这里是不是感觉到通过这个简单的demo，修改配置来验证，当前后端在CORS跨域出现问题时，是不是就可以很好的找到答案，而不是百度了一遍，依然是处于茫然中，不知道要让服务端干嘛，同时作为前端应该该干嘛等疑惑，不让自己成为前端小白，有话可说...

**第三个参数：** Access-Control-Allow-Headers 作用：前后端需要通过header来进行数据交互时，需要设置使用到的header字段  
如前端通过设置请求头header中的字段`axios.defaults.headers.common['client-header'] = 1;`, 如果此时Access-Control-Allow-Headers字段没有设置对应的header字段，浏览器会报如下错误：![](https://user-gold-cdn.xitu.io/2020/7/12/17341b74b7004083?w=1517&h=162&f=png&s=7932)

也就是说通过前端设置的自定义header字段，需要服务端在Access-Control-Allow-Headers字段中设置相应的header  

**第四个参数：** Access-Control-Expose-Headers 作用：允许浏览器端能够获取相应的header值  

如果服务端接口设置了响应头字段`res.setHeader('serve-header','from->express');` 但是CORS中对应的字段Access-Control-Expose-Headers并没有处理，此时通过请求响应后的header结果如下：
![](https://user-gold-cdn.xitu.io/2020/7/12/17341c99e6add343?w=960&h=394&f=png&s=18717) ![](https://user-gold-cdn.xitu.io/2020/7/12/17341c8b3522a31d?w=874&h=383&f=png&s=16495)  

可以看到虽然响应头里面有`serve-header`字段，但是却获取不到， 如果设置了 `Access-Control-Allow-Headers: serve-header`再来看下结果
![](https://user-gold-cdn.xitu.io/2020/7/12/17341cd1ac94b5d7?w=831&h=383&f=png&s=16530)  

此时则可以拿到服务端设置的响应头里面的`serve-header`字段了

**第五个参数：** Access-Control-Max-Age 作用：控制发送预检请求options的频率

1、如果设置`Access-Control-Max-Age: 0`, 则发送请求的时候浏览器始终都会先发送预检请求options。如图
![](https://user-gold-cdn.xitu.io/2020/7/12/17341dccc89223d5?w=1168&h=269&f=png&s=19813)  

每次点击**send cors**按钮请求接口 `api/getcors` 时，都会发送options预检请求

2、如果设置`Access-Control-Max-Age: 1800`, //预请求缓存30分钟=1800秒 结果如下：
![](https://user-gold-cdn.xitu.io/2020/7/12/17341e12d09df4af?w=1181&h=292&f=png&s=19262)  
对应的响应头：
![](https://user-gold-cdn.xitu.io/2020/7/12/17341e329a118eb6?w=1263&h=488&f=png&s=29453)

点击**send cors**按钮请求接口 `api/getcors` 时，只会首次发送options预检请求，接着后面再次请求时就不会发options请求了

3、在2的基础上，如果你的Chrome浏览器在debug状态，勾选上Disable cache，也是失效的 如下：
![](https://user-gold-cdn.xitu.io/2020/7/12/17341e5bc2302fe7?w=1259&h=304&f=png&s=21459)  

即每次都会发送预检请求  

4、这里**强调**一下`Access-Control-Max-Age:1800`设置缓存时间，仅仅是针对已经请求过的接口如`api/getcors`，当点击按钮**send cors2** 第一次请求接口`api/getcors2`时，同样也会发送预检请求options 



**第六个参数：** Access-Control-Allow-Methods 作用：请求方法的限制  
这里最后一个参数就留给读者你去校验了，修改下Access-Control-Allow-Methods 参数看看浏览器的报错结果，体会一下...


到这里6个参数就总结完了，下面补充一下CORS跨域时，cookie的携带过程

**CORS跨域中cookie的携带**

1、首先Cookie操作具有不可跨域特性，如：
```JavaScript
// client 端设置
Cookies.set('cookie-value', '1', { domain: 'huoyun-test.djtest.cn' });
Cookies.set('cookie-value', '2', { domain: 'test.djtest.cn' });
Cookies.set('cookie-value', '3', { domain: 'djtest.cn' });

// server 端设置
res.setHeader('Set-Cookie', 'cookie-value=22;domain=.test.djtest.cn;path=/');
```
打开chrom调试工具：如下
![](https://user-gold-cdn.xitu.io/2020/7/12/1734232d8548fce3?w=1416&h=437&f=png&s=23126)  

即：页面`huoyun-test.djtest.cn`不可以操作`test.djtest.cn`的cookie，通过document.cookie读取的时候是可以获取到从一级域名`djtest.cn` 及以下的所有子域的cookie值，而在面板中是**看不见**服务端设置的`cookie-value=22;domain=.test.djtest.cn;path=/`的值，说这里注意下！！！

那此时再请求接口`api/getcors`，服务端接受到的cookie值以哪个为准呢 ？ 如下：
![](https://user-gold-cdn.xitu.io/2020/7/12/1734258febdec3c4?w=1209&h=540&f=png&s=30856) 

即：最终解析到的cookie会以client端**一级域名**设置的值`Cookies.set('cookie-value', '3', { domain: 'djtest.cn' });` 为准  

**最后** 对于express中间价cors、以及cookie-parser的解析代码都不复杂，想了解的同学，欢迎clone [demo](https://github.com/wuba/wwto)下来debug一下，印象会深刻点  

**参考：**  
1、[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)  
2、[跨域资源共享CORS详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)  
3、[如何区分不同用户——Cookie/Session机制详解](https://www.cnblogs.com/zhouhbing/p/4204132.html)  
4、[关于cookie的深入了解](https://www.cnblogs.com/tylerdonet/p/13100788.html)