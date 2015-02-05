var express = require('express'),
	app = new express(),
	ejs = require('ejs'),
	md = require('microdatabase'),
	db = md('Phone','Number'),
	ips = md('Phone','IP');

app.configure(function() {
	app.use(express.static(__dirname + '/www'));
	app.use(express.cookieParser());
	/*app.use(express.session({
		secret: 'MD5HeapMap'
	}));*/
	/**
	*Long Alive Server session*/
	
	app.use(express.cookieSession({
		key:'cookie',
		secret:'https://www.youtube.com/watch?v=SR6iYWJxHqs'
	}));
	app.use(express.bodyParser()); //open GER,POST body parser
	app.set('views', __dirname + '/www'); //views engine path
	app.set('view engine', 'ejs');
	app.use(app.router); //open routers

	//404
	app.use(function(req, res, next) {
		res.status(404);

		// respond with html page
		if (req.accepts('html')) {
			res.render('404');
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			res.send({
				error: 'Not found'
			});
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('Not found');
	})
});

app.get('/',function(req,res){
	res.render('index');
});

app.post('/verification',function(req,res){
	isSend(req,res);
});

function isSend(req,res){
	if(!!req.body.number){
		db.find('',function(row){
			for(var i = 0;i<row.length;i++){
				if(row[i].phone == req.body.number/*req.connection.remoteAddress*/){
					res.redirect('/?error=1');
					break;
				}else{
					if(row[i].phone != req.connection.remoteAddress && i == row.length-1){
						var nexmo = require('./lib/nexmo');
						nexmo.initialize('apikey','apivalue');

						nexmo.sendTextMessage('FUGDC',req.body.number,'Thak for your register(FUGDC Summit 2015)!, Now just wait for the time of arrival. We will notify you back.',{},consolelog);
						//感謝你的註冊, 請等待遊戲設計俱樂部的活動, 我們會再次通知您! 您可以先瀏覽我們介紹的 Slideshare 了解更多內容,　ありがと！
						function consolelog (err,messageResponse) {
							if (err) {
						                console.log(err);
						                res.redirect('/?error=3');
						        } else {
						                console.dir(messageResponse);
                						ips.insert({phone:req.connection.remoteAddress});
										db.insert({phone:req.body.number});
						                res.redirect('/finish.html');          
						        }
						}
						break;
					}
				}
			}
		});	
	}else{
		res.redirect('/?error=2');
	}
	
	
}
app.listen(80)