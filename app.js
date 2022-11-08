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
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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
        let query1 = "SELECT * FROM Doctors;";

        db.pool.query(query1, function(error, rows, fields){
            res.render('./doctor_pages/doctors', {data:rows});
        })
    });


app.get('/add_doctor', function(req, res)
    {
         res.render('./doctor_pages/add_doctor')
    });

app.post('/add-doctor-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log(data)
        
        // Create the query and run it on the database
        query1 = `INSERT INTO Doctors (first_name, last_name, specialty) VALUES ('${data['input-doctor-first-name']}', '${data['input-doctor-last-name']}', '${data['input-specialty']}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
    
            // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
            // presents it on the screen
            else
            {
                res.redirect('/doctors');
            }
        })
    })

app.get('/delete_doctors', function(req, res)
    {
         res.render('./doctor_pages/delete_doctors')
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