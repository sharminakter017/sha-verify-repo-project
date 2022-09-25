const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const studentRoute = require('./routes/student')
const expressLayouts = require('express-ejs-layouts');


//express init
const app = express();

//environment variables
dotenv.config();
const PORT = process.env.PORT || 2000;

//ejs init
app.set('view engine', 'ejs')
app.set('layout', 'layouts/app')

//static
app.use('/public',express.static('public'))


//data manage 
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(expressLayouts);


//routing
app.use('/student',studentRoute);




//server listen
app.listen(PORT,(req,res) => {
    console.log(`server is running port of ${PORT}`.bgMagenta.red);
})


