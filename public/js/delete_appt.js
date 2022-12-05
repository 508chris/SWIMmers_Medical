function deleteAppt(apptID) {
    let link = '/delete-appt-ajax/';
    let data = {
      appt_id: apptID
    };

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(apptID);
      }
    });
  }

  function deleteRow(apptID){
      let table = document.getElementById("appointment-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == apptID) {
              table.deleteRow(i);
              break;
         }
      }
  }