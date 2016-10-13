$(function() {

  //Validate
  function validateSearch(textbox){
    if (textbox.val() == null || textbox.val()==""){
      alert("Please enter a value in both boxes");
      return false;
    } else {
      return true;
    }
  }

  $('#search-form').submit(function(e){
    e.preventDefault();
    if (validateSearch($('#textSearchLast'))==true && validateSearch($('#textSearchFirst'))){
      //Query can proceed
      var data = {};
      data.lastsearch = $('#textSearchLast').val();
      data.firstsearch = $('#textSearchFirst').val();
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/search',
        success: function(data) {
          console.log('success');
          console.log(JSON.stringify(data));
        }
      });
    }
  });



});
