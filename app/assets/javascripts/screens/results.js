(function() {
  this.App.results = function(){
    $('form').one('ajax:success', function(e, data, status, xhr){
      $(this).fadeOut(function(){
        $('#warning_flash').html("Thank you! You'll receive the first email very soon");
      });
    });

    $('form').one('ajax:error', function(e, data, status, xhr){
      $('#warning_flash').html(data.responseJSON.errors);
    });
  }
}).call(this);
