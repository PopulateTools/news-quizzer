(function() {
  this.App.start = function(){
    // document.getElementById("videohome").playbackRate = 0.2;
    if($('#session_country').length > 0){
      var remoteIP = $('#remote_ip').val();
      if(remoteIP !== '127.0.0.1' && remoteIP !== ''){
        $.getJSON('https:/'+'/freegeoip.net/json/' + remoteIP + '?callback=?', function (location, textStatus, jqXHR) {
            var found = false;
            $('#session_country option').each(function(){
              if($(this).html() === location.country_name){
                $(this).prop('selected', true);
                found = true;
              }
            });
          if(!found)
            $('#session_country option:contains("' + location.country_name + '")').prop('selected', true);
        });
      }
    }
  }
}).call(this);

