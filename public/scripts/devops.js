function myFunction(x) {
      x.style.background = "lightgray";
    }

    function myFunction(x) {
      x.style.background = "lightgray";
    }

    function onblurfunction(x) {
      x.style.background = "";
    }


$(function() {

  /* Slack  starts */
  $('#slackNotification').click(function() {
    document.getElementById("iform").style.display = 'none';

    document.getElementById("tform").style.display = 'block';
    document.getElementById("back").style.display = 'block';
  });

  $("#back").click(function() {
    document.getElementById("tform").style.display = 'none';
    document.getElementById("iform").style.display = 'block';
    document.getElementById("back").style.display = 'none';

  });
  
  $("#basic-addon2").click(function() {

    var token = 'xoxp-13686916903-13684070851-13688233025-3423ce5b81';
    $.ajax({
      url: '/validate?token=' + token,
      type: 'GET',
      dataType: 'json',
      success: function(result) {
        alert(result);
        document.getElementById("validated").style.display = 'block';
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert("error");
        document.getElementById("validated").style.display = 'none';
      }
    });

  });
  
  /* Slack  end */
  
  
  /* Source control starts */
  
  $('#sourcecontrol').click(function() {
    document.getElementById("sc_iform").style.display = 'none';
    // document.getElementById("sc_configure").style.display = 'none';

    document.getElementById("sc_tform").style.display = 'block';
    document.getElementById("sc_back").style.display = 'block';
  });

  $("#sc_back").click(function() {
    document.getElementById("sc_tform").style.display = 'none';
    document.getElementById("sc_iform").style.display = 'block';
    document.getElementById("sc_back").style.display = 'none';
    // document.getElementById("sc_configure").style.display = 'block';

  });

  $("#sc_test").click(function() {
    alert("github validated");
  });
  
 
  /* Source control ends */
  
  
 /* build code starts */
  
  $('#buildcode').click(function() {
    document.getElementById("bc_iform").style.display = 'none';
    // document.getElementById("sc_configure").style.display = 'none';

    document.getElementById("bc_tform").style.display = 'block';
    document.getElementById("bc_back").style.display = 'block';
  });

  $("#bc_back").click(function() {
    document.getElementById("bc_tform").style.display = 'none';
    document.getElementById("bc_iform").style.display = 'block';
    document.getElementById("bc_back").style.display = 'none';
    // document.getElementById("sc_configure").style.display = 'block';

  });

  $("#bc_test").click(function() {
    alert("build code validated");
  });
  
  
  /* build code ends */
  
  
  
  /* ci  starts */
   
   $('#ci').click(function() {
     document.getElementById("ci_iform").style.display = 'none';

     document.getElementById("ci_tform").style.display = 'block';
     document.getElementById("ci_back").style.display = 'block';
   });

   $("#ci_back").click(function() {
     document.getElementById("ci_tform").style.display = 'none';
     document.getElementById("ci_iform").style.display = 'block';
     document.getElementById("ci_back").style.display = 'none';

   });

   $("#ci_test").click(function() {
     alert("build code validated");
   });
   
   /* ci ends */
   
  
  
});