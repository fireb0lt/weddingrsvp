
$(function() {
  $.fn.popUpMsg = function(text, duration){
      //Do cool animation
      $(this).text(text);
      $(this).fadeIn(200).delay(duration).fadeOut(300);
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
          console.log(data);
          if (data=='Sorry, we can\'t find that name, try again!'){
            $('.msg').popUpMsg(data,2500);
          } else {
            $('.msg').popUpMsg(JSON.stringify(data),2500);
            
          }

        }
      });
    }
  });



});
