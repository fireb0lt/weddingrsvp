
$(function() {
// Global Variables
var attendingGuests = [];
var searchResults = [];

// send to db

function launchSearchModal(){
  $.ajax({
    url:'/launch',
    success: function(data){
      $('body').append(data);
      $('#search-form').dialog({
          draggable: false,
          resizable: false,
          width: 400,
          autoOpen: true,
          close: function () {
            $('#search-form').remove();
            $('.center.entry').show();
          }
      });
    }
  });
}

function goBack(){
  $('.ui-dialog.enter-modal').show();
  $('#finish-form').remove();
  //$('.center.entry').show();
}
$('#finish-form .next-btn').click(function(){

});
$('#finish-form .prev-btn').click(function(){
  goBack();
  $('#finish-form').remove();
});
function launchFinishModal(){

  $.ajax({
    url:'/addFinish',
    success: function(data){
      $('.ui-dialog.enter-modal').hide();
      $('body').append(data);
      $('#finish-form').dialog({
          draggable: false,
          resizable: false,
          width: 400,
          autoOpen: true,
          close: function () {
            $('#enter-form').remove();
            $('#finish-form').remove();
            $('.center.entry').show();
          }
      });
    }
  });
}


$('body').on('click','#finish-form .prev-btn', function(){
  goBack();
});








  $.fn.popUpMsg = function(text, duration){
      //Do cool animation
      $(this).text(text);
      $(this).fadeIn(200).delay(duration).fadeOut(650);
    }

  //Launch search
  $('#rsvp-launch').click(function(e){

    e.preventDefault();
    //Ajax request to get view
    launchSearchModal();
    $('.center.entry').hide();
  });
  //Validate

  function validateSearch(textbox){
    if (textbox.val() == null || textbox.val()==""){
      $('.msg').popUpMsg("Please enter a value in both boxes",350);
      return false;
    } else {
      return true;
    }
  }
  $('body').on('submit', '#search-form', function(e){
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
          //  console.log(data);
            if (data=='Sorry, we can\'t find that name, try again!'){
              $('.msg').popUpMsg(data,2500);
            } else {
              //$('.msg').popUpMsg(JSON.stringify(data),2500);
              searchResults=data;
            //  console.log(searchResults);
              $.ajax({
                url:'/addRsvp',
                success: function(data){
                  $('#search-form').remove();
                  $('body').append(data);
                //  console.log(searchResults);
                  // add guests to dialog html
                  $('#enter-form h2').text('RSVP for the ' + searchResults[0].last.charAt(0).toUpperCase() + searchResults[0].last.slice(1) + ' party.')
                  //FOREACH guest
                    //add html wrapper
                    //add checkbox to html wrapper
                    $.each(searchResults, function( key, value ) {
                        console.log(value.first);
                        $('#enter-form .content').append('<div class=\'check-field\'> <input type=\'checkbox\' id=\'guest-check-'+key+'\'><label for=\'guest-check-'+key+'\'></label> <span class=\'check-field-content\'>'+value.first+'</span></div>');
                    });

                  // $('#enter-form')

                    //Check

                  $('#enter-form').dialog({
                      draggable: false,
                      resizable: false,
                      width: 400,
                      autoOpen: true,
                      dialogClass:'enter-modal',
                      close: function () {
                        $('#enter-form').remove();
                        $('.center.entry').show();
                      }
                  });
                  $('#enter-form .prev-btn').click(function(){
                    $('#enter-form').remove();
                    searchResults=[];
                    launchSearchModal();
                  });
                  $('#enter-form .next-btn').on('click', function(){
                    $('#enter-form input').each(function(){
                      if ($(this).prop('checked')) {
                        var guest = $(this).siblings('.check-field-content').text();
                        $.each(searchResults, function( key, value ) {
                          if (value.first==guest) {
                            searchResults[key].rsvp=1;
                          }
                        });
                      } else {
                        var guest = $(this).siblings('.check-field-content').text();
                        $.each(searchResults, function( key, value ) {
                          if (value.first==guest) {
                            searchResults[key].rsvp=0;
                          }
                        });
                      }
                    });
                    console.log(searchResults);
                    //Now send to backend
                    $.ajax({
                      type: 'POST',
                      data: JSON.stringify(searchResults),
                      contentType: 'application/json',
                      url: '/saversvp',
                      success: function() {
                            launchFinishModal();
                      }
                    });
                  });
                }
              });
            }
          }
        });
      }
    });




});
