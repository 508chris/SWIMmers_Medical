function deletePrescription(scriptID) {
    let link = '/delete-prescription-ajax/';
    let data = {
      script_id: scriptID
    };

    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(scriptID);
      }
    });
  }

  function deleteRow(scriptID){
      let table = document.getElementById("prescriptions-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == scriptID) {
              table.deleteRow(i);
              break;
         }
      }
  }