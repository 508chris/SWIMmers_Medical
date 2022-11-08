/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 9130;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.use(express.static('public'))
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('homepage');
    });

app.get('/patients', function(req, res)
   {
        let query1 = "SELECT * FROM Patients;";

        db.pool.query(query1, function(error, rows, fields){
            res.render('./patient_pages/patients', {data:rows});
        })
   });

app.get('/doctors', function(req, res)
   {
        res.render('./doctor_pages/doctors')
   });

app.get('/appointments', function(req, res)
   {
        res.render('./appt_pages/appointments')
   });

app.get('/medications', function(req, res)
   {
        res.render('./med_pages/medications')
   });

app.get('/prescriptions', function(req, res)
   {
        res.render('./script_pages/prescriptions')
   });

app.get('/appt_scripts', function(req, res)
   {
        res.render('appts_has_scripts')
   });
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});