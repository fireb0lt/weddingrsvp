







$(function() {
  $.fn.popUpMsg = function(text, duration){
      //Do cool animation
      $(this).text(text);
      $(this).css({"opacity":"0","left":"100%"});
      $(this).animate({ "left": "0" }, duration, "swing" );
      $(this).animate({ "opacity":"1" }, duration + 50, "swing" );
    }

  //Validate
  function validateSearch(textbox){
    if (textbox.val() == null || textbox.val()==""){
      $('.msg').popUpMsg("Please enter a value in both boxes",350);
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
          $('.msg').popUpMsg(JSON.stringify(data),350);

        }
      });
    }
  });



});
