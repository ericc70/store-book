const express = require("express")
const dotenv = require("dotenv")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path');
const session = require('express-session')
const passport = require('passport')
const connectDB = require("./config/db")
const { patch } = require("./routes")

// Load config
dotenv.config({ path: "./config/config.env" })

// passport config
require('./config/passport')(passport)

connectDB()
const app = express()

//logging
if(process.env.NODE_ENV === 'developpement')
{
    app.use(morgan('dev'))
}

//handlebar
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions

app.use(session({
    secret: 'keybaort cat',
    resave: false,
    saveUninitialized: false

}))

//Passport middleware

app.use(passport.initiallize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))



const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
