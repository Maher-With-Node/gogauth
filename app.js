const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dotenv =require ('dotenv');
dotenv.config({path: './config.env'});

const app = express();

const dbURI  = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
    );
//mongodb+srv://Maher:<PASSWORD>@cluster0.4lera.mongodb.net/Natours?retryWrites=true&w=majority


const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const authRoutes = require('./routers/auth');
// initialize passport
app.use(passport.initialize());


app.use("/auth", authRoutes);


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

mongoose
.connect(dbURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => console.log('Database Connected'))
.catch((err) => console.log(err));
mongoose.Promise = global.Promise;
//route not found
app.use((req, res, next) => {
const error = new Error('Route not found');
error.status = 404;
next(error);
});



app.use((error, req, res, next) => {
res.status(error.status || 500);
res.json({
error: {
message: error.message,
       },
        });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Listening on port ${PORT}`);
});