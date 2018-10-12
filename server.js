//server.js
const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const port = process.env.PORT || 3000;


//instantiate the app
var app = express();


//register ability to create partials. tell where to get partials 
hbs.registerPartials(__dirname + '/views/partials');

//tell Express which view engine we would like to use
app.set('view engine', 'hbs');

//middleware to point app to static html pages
app.use(express.static(__dirname + '/public'));

//middleware, a custom middleware. note that you must call next,
//otherwise your app will be stuck
app.use((req, res, next)=>{
	next();
});


//a middleware that behaves like a logger everytime a page is called
app.use((req, res, next)=>{
	var now = new Date().toString();
	var log = `${now} ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log+'\n', (err)=>{
		if (err) {
			console.log('unable to append to server log');
		}
	});
	next();
});

//a middleware can also render a page
//this middleware has no next(), but it will not hang the page, because we use a res.render.
//everything after this middleware will not be setup.
//app.use((req, res, next)=>{
//	res.render('maintenance.hbs');
//});

//creating helper functions
hbs.registerHelper('getCurrentYear', ()=>{
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
	return text.toUpperCase();
});


//set up the pages you want to redirect
app.get('/', (req, res)=>{
	//res.send('hello express');
	//res.send({
	//	name : "andrew",
	//	likes : ["biking", "cities"]
	//});
	res.render('home.hbs',{
		pageTitle : 'Home Page',
		welcomeMessage : 'Welcome to my website'
		//currentYear : new Date().getFullYear()
	});
});

app.get('/about', (req, res)=>{
	//res.send('about page');
	res.render('about.hbs', {
		pageTitle : 'About Page',
		//currentYear : (new Date().getFullYear())+1

	});
});

app.get('/bad', (req, res)=>{
	res.send({
		errorMessage : 'unable to handle request'
	});
});

// execute the app by allowing it to listen to incoming
app.listen(port, ()=>{
	console.log(`server is up on port ${port}`);
});
