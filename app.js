/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 9001;

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


/* 
    Patients Pages
*/
app.get('/patients', function(req, res)
   {
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.last_name === undefined)
        {
            query1 = "SELECT * FROM Patients;";
        }
    
        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Patients WHERE last_name LIKE "${req.query.last_name}%"`
        }

        let query2 = "SELECT * FROM Patients;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            let patients = rows;
            db.pool.query(query2, (error, rows, fields) => {
                let row = rows;
                return res.render('./patient_pages/patients', {data: patients, row: row})
            })
            // res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/add_patient', function(req, res){
    res.render('./patient_pages/add_patient')
})


app.get('/delete_patients', function(req, res){
    res.render('./patient_pages/delete_patients')
})

app.get('/edit_patient', function(req, res){

    let query3 = `SELECT * FROM Patients WHERE patient_id = "${req.query.edit_patient_id}%";`
    
    db.pool.query(query3, function(error, rows, fields){
        let patients = rows;
        console.log( {data: patients} )
        return res.render('./patient_pages/edit_patient', {data: patients})
    })
    
})

app.post('/edit-patient-form', function(req, res){
    let data = req.body;
    console.log(data)
    query1 = `UPDATE Patients SET first_name = '${data['input-first-name']}', last_name = '${data['input-last-name']}', dob = '${data['input-dob']}', address = '${data['input-address']}', email = '${data['input-email']}', phone_number = '${data['input-phone-number']}', insurance = '${data['input-insurance']}' WHERE patient_id = '${data['input-patient-id']}';`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }else{
            res.redirect('/patients')
        }
    })
})



app.post('/add-patient-form', function(req, res){
    let data = req.body;
    query1 = `INSERT INTO Patients (first_name, last_name, dob, address, email, phone_number, insurance) VALUES ('${data['input-patient-first-name']}', '${data['input-patient-last-name']}', '${data['input-dob']}', '${data['input-address']}', '${data['input-email']}', '${data['input-phone-number']}', '${data['input-insurance']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400)
        } else{
            res.redirect('/patients')
        }
    })

})


app.delete('/delete-patient-ajax/', function(req,res,next){
    let data = req.body;
    let patientID = parseInt(data.patient_id);
    let deletePatient = `DELETE FROM Patients WHERE patient_id = ?`;
    
    db.pool.query(deletePatient, [patientID], function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.sendStatus(204);
        }
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