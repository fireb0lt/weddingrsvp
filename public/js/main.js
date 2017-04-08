
$(function() {
// Global Variables
var attendingGuests = [];
var searchResults = [];
var currentLast ='';
// send to db
function destroyAllModals(){
  $('#search-form').remove();
  $('#finish-form').remove();
  $('#enter-form').remove();
  $('#details-page').remove();
}
function launchDetails(){
  $.ajax({
    url:'/det',
    success: function(data){
      $('body').append(data);
      $('#details-page').dialog({
          draggable: false,
          resizable: false,
          width: 400,
          autoOpen: true,
          dialogClass: "details-d",
          close: function () {
            destroyAllModals();
            $('.center.entry').show();
          }
      });
    }
  });
}
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
            destroyAllModals();
            $('.center.entry').show();
          }
      });
    }
  });
}
function completeModal(){
  $('#finish-form').remove();
  $('body').append('<div class="ion-ios-checkmark finish-ic"></div>');
  $('.ion-ios-checkmark.finish-ic').animate({fontSize: "150px",opacity:"1" }, 300, function(){
    $('.ion-ios-checkmark.finish-ic').animate({color:"#00c96c" }, 100).delay(500).animate({fontSize: "2000px",opacity:"0.1"}, 200, function(){
      $('.ion-ios-checkmark.finish-ic').remove();
      $('.center.entry').show();
    });
  });

  //$('.ion-ios-checkmark.finish-ic::after').animate({width: "150px",height:"100px" }, 300);


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
          width: 600,
          autoOpen: true,
          close: function () {
            destroyAllModals();
            $('.center.entry').show();
          }
      });
    }
  });
}


$('body').on('click','#finish-form .prev-btn', function(){
  goBack();

});

$('body').on('click','#finish-form .next-btn', function(){
  var finalDetails={};
  finalDetails.name=currentLast;
  finalDetails.message=$('#finish-form .message').val().replace(/\"/g,'\\"');
  finalDetails.song=$('#finish-form .songs').val().replace(/\"/g,'\\"');
  finalDetails.food=$('#finish-form .food').val().replace(/\"/g,'\\"');
  $.ajax({
    type: 'POST',
    data: JSON.stringify(finalDetails),
    contentType: 'application/json',
    url: '/finalize',
    success: function() {
        completeModal();
    }
  });

});






  $.fn.popUpMsg = function(text, duration){
      //Do cool animation
      $(this).text(text);
      $(this).fadeIn(200).delay(duration).fadeOut(650);
    }
//Launch details
$('#rsvp-launch').click(function(e){

  e.preventDefault();
  //Ajax request to get view
  launchSearchModal();
  $('.center.entry').hide();
});
  //Launch search
  $('#details').click(function(e){

    e.preventDefault();
    //Ajax request to get view
    launchDetails();
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
            if (data=='Sorry, we can\'t find that name, try again!'){
              $('.msg').popUpMsg(data,2500);
            } else {
              searchResults=data;
              $.ajax({
                url:'/addRsvp',
                success: function(data){
                  $('#search-form').remove();
                  $('body').append(data);
                  // add guests to dialog html
                  currentLast=searchResults[0].last;
                  $('#enter-form h2').text('RSVP for the ' + searchResults[0].last.charAt(0).toUpperCase() + searchResults[0].last.slice(1) + ' party.')
                  //FOREACH guest
                    //add html wrapper
                    //add checkbox to html wrapper
                    $.each(searchResults, function( key, value ) {
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
                        destroyAllModals();
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
