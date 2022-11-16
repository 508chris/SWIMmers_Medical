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

// ------------------------------------
// HOMEPAGE ROUTE
// ------------------------------------

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

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            let patients = rows;
           
            return res.render('./patient_pages/patients', {data: patients})
            })
            // res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        });                                                      // an object where 'data' is equal to the 'rows' w                                                      // received back from the query

app.get('/add_patient', function(req, res){
    res.render('./patient_pages/add_patient')
})


// app.get('/delete_patients', function(req, res){
//     res.render('./patient_pages/delete_patients')
// })

app.get('/edit_patient', function(req, res){

    let query3 = `SELECT * FROM Patients WHERE patient_id = "${req.query.edit_patient_id}%";`
    
    db.pool.query(query3, function(error, rows, fields){
        let patients = rows;
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




  app.get('/delete_patient', function(req, res){

    let query1 = `SELECT * FROM Patients WHERE patient_id = "${req.query.delete_patient_id}%";`
    
    db.pool.query(query1, function(error, rows, fields){
        let patients = rows;
        console.log( {data: patients})
        return res.render('./patient_pages/delete_patients', {data: patients})
    })
});


app.delete('/delete-patient-ajax/', function(req,res,next){
    let data = req.body;
    let patientID = parseInt(data.patient_id);
    let deletePatient = `DELETE FROM Patients WHERE patient_id = ?;`;
    
    db.pool.query(deletePatient, [patientID], function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
    })
  });







// ------------------------------------
// DOCTORS PAGE ROUTES
// ------------------------------------

app.get('/doctors', function(req, res)
{
    let query1;

    if (req.query.lname === undefined)
    {
        query1 ="SELECT * FROM Doctors;";
    }

    else
    {
        query1 = `SELECT * FROM Doctors WHERE last_name LIKE "${req.query.lname}%"`
    }
    
    db.pool.query(query1, function(error ,rows, fields){

        let doctors = rows;

        return res.render('./doctor_pages/doctors', {data: doctors})
    })
  });


app.get('/add_doctor', function(req, res)
    {
         res.render('./doctor_pages/add_doctor')
    });

app.post('/add-doctor-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        
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
    });

app.get('/edit_doctor', function(req, res){

        let query1 = `SELECT * FROM Doctors WHERE doctor_id = "${req.query.edit_doctor_id}%";`
        
        db.pool.query(query1, function(error, rows, fields){
            let doctors = rows;
            console.log( {data: doctors})
            return res.render('./doctor_pages/edit_doctor', {data: doctors})
        })
    });
    
app.post('/edit-doctor-form', function(req, res){
    let data = req.body;

    query1 = `UPDATE Doctors SET first_name = '${data['input-doctor-first-name']}', last_name = '${data['input-doctor-last-name']}', specialty = '${data['input-specialty']}' WHERE doctor_id = '${data['input-doctor-id']}';`
    db.pool.query(query1, function(error, rows, fields){
        
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }else{
            res.redirect('/doctors')
        }
    })
});
    
app.get('/delete_doctor', function(req, res){

    let query1 = `SELECT * FROM Doctors WHERE doctor_id = "${req.query.delete_doctor_id}%";`
    
    db.pool.query(query1, function(error, rows, fields){
        let doctors = rows;
        console.log( {data: doctors})
        return res.render('./doctor_pages/delete_doctor', {data: doctors})
    })
});

app.delete('/delete-doctor-ajax/', function(req,res,next){
    let data = req.body;
    let doctorID = parseInt(data.id);
    let deleteAppointment = `DELETE FROM Doctors WHERE doctor_id = ?;`;

  
          // Run the 1st query
          db.pool.query(deleteAppointment, [doctorID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.redirect('/doctors')
              }
  })});

// ------------------------------------
// MEDICATIONS PAGE ROUTES
// ------------------------------------

app.get('/medications', function(req, res)
{
    let query1;

    if (req.query.medication_name === undefined)
    {
        query1 ="SELECT * FROM Medications;";
    }

    else
    {
        query1 = `SELECT * FROM Medications WHERE medication_name LIKE "${req.query.medication_name}%";`
    }
    
    db.pool.query(query1, function(error ,rows, fields){

        let medications = rows;

        return res.render('./med_pages/medications', {data: medications})
    })
  });



app.get('/add_med', function(req, res)
    {
        res.render('./med_pages/add_med')
    });

app.post('/add-med-form', function(req, res){
    let data = req.body;

    query1 = `INSERT INTO Medications (medication_name, medication_type) VALUES ('${data['input-med-name']}', '${data['input-med-type']}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/medications');
        }
});
});

app.get('/edit_med', function(req, res){
    let query1 = `SELECT * FROM Medications WHERE medication_id LIKE "${req.query.edit_med_id}%";`

    db.pool.query(query1, function(error, rows, fields) {
        let meds = rows;
        console.log({data:meds})
        return res.render('./med_pages/edit_med', {data: meds})
    })
});

app.post('/edit-med-form', function(req, res){
    let data = req.body;

    query1 = `UPDATE Medications SET medication_name = '${data['input-med-name']}', medication_type = '${data['input-med-type']}' WHERE medication_id = '${data['input-med-id']}';`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else {
            res.redirect('/medications')
        }
    })
})


app.get('/delete_med', function(req, res){

    let query1 = `SELECT * FROM Medications WHERE medication_id = "${req.query.delete_medication_id}%";`
    
    db.pool.query(query1, function(error, rows, fields){
        let medications = rows;
        console.log( {data: medications})
        return res.render('./med_pages/delete_med', {data: medications})
    })
});



app.delete('/delete-medication-ajax/', function(req,res,next){
    let data = req.body;
    let medicationID = parseInt(data.medication_id);
    let deleteMedication = `DELETE FROM Medications WHERE medication_id = ?;`;
  
          // Run the 1st query
          db.pool.query(deleteMedication, [medicationID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.redirect('/medications')
              }
  })});




// ------------------------------------
// Appointments PAGE ROUTES
// ------------------------------------

app.get('/appointments', function(req, res)
   {
        let query1 = "SELECT Patients.first_name AS patient_first, Patients.last_name AS patient_last, Medications.medication_name,  Patients.patient_id, Doctors.Doctor_id, Doctors.first_name AS doctor_first, Doctors.last_name AS doctor_last, Prescriptions.script_id, Appointments.script_id, Appointments.appt_id, Appointments.reason_for_appt, Appointments.date, Appointments.time FROM Appointments JOIN Doctors on Appointments.doctor_id = Doctors.doctor_id JOIN Patients ON Appointments.patient_id = Patients.patient_id JOIN Prescriptions on Appointments.script_id = Prescriptions.script_id JOIN Medications on Prescriptions.medication_id = Medications.medication_id" ;

        db.pool.query(query1, function(error, rows, fields) {
            res.render('./appt_pages/appointments', {data:rows});
        })
   });




// ------------------------------------
// Prescriptions PAGE ROUTES
// ------------------------------------

   
app.get('/prescriptions', function(req, res)
{
    let query1;

    if (req.query.prescription_name === undefined)
    {
        query1 ="SELECT Medications.medication_name, Prescriptions.script_id, Prescriptions.dosage, Prescriptions.instructions FROM Medications JOIN Prescriptions ON Medications.medication_id = Prescriptions.medication_id;";
    }

    else
    {
        query1 = `SELECT Medications.medication_name, Prescriptions.script_id, Prescriptions.dosage, Prescriptions.instructions FROM Medications JOIN Prescriptions ON Medications.medication_id = Prescriptions.medication_id WHERE medication_name LIKE "${req.query.prescription_name}%";`
    }
    
    db.pool.query(query1, function(error ,rows, fields){

        let prescriptions = rows;

        return res.render('./script_pages/prescriptions', {data: prescriptions})
    })

  });


app.get('/add_script', function(req, res){
    let query1 = `SELECT * FROM Prescriptions;`
    let query2 = `SELECT * FROM Medications;`

    db.pool.query(query1, function(error, rows, fields){
        let prescriptions = rows;
        db.pool.query(query2, function(error, rows, fields){
            let medications = rows;
            return res.render('./script_pages/add_script', {data: prescriptions, medications})
        })
        
    })
})



app.post('/add-script-form', function(req, res){
    let data = req.body;
    query1 = `INSERT INTO Prescriptions (medication_id, dosage, instructions) VALUES ('${data['input-prescription-name']}', '${data['input-dosage']}', '${data['input-instructions']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400)
        } else{
            res.redirect('/prescriptions')
        }
    })

})



app.get('/delete_scripts', function(req, res){

    let query1 = `SELECT Medications.medication_name, Prescriptions.script_id, Prescriptions.dosage, Prescriptions.instructions FROM Medications JOIN Prescriptions ON Medications.medication_id = Prescriptions.medication_id WHERE script_id = "${req.query.delete_script_id}%";`;
    
    db.pool.query(query1, function(error, rows, fields){
        let script = rows;
        return res.render('./script_pages/delete_scripts', {data: script})
    })
});



app.delete('/delete-prescription-ajax/', function(req,res,next){
    let data = req.body;
    let scriptID = parseInt(data.script_id);
    let deletePrescription = `DELETE FROM Prescriptions WHERE script_id = ?;`;
          // Run the 1st query
          db.pool.query(deletePrescription, [scriptID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.redirect('/prescriptions')
              }
  })});




// ------------------------------------
// Appt_scripts PAGE ROUTES
// ------------------------------------

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