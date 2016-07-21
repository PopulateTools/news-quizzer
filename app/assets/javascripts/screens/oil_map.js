(function() {
  this.App.oil_map = function(){
    var locked = false;
    var mobile = $(window).width() <= 740;
    var totalResponses = parseInt($('[data-total]').data('total'));
    var totalHints = 0;
    $('[data-total]').html(totalResponses);
    $('form[data-answers] input:submit').hide();
    $('[data-after-go]').hide();
    $('#counter').hide();

    var question_data = {
      "map": "oil",
      "setup_classes": [{
          "class":"hint",
          "filter_by": "sov_a3",
          "values": ['COG','SDN','TUN','CIV','MOZ','TGO','UGA']
        },
        {
          "class":"selected_safaris",
          "filter_by": "sov_a3",
          "values": ['KEN','NAM','TZA','ZAF','ZMB','BWA','EGY','SWZ','ZWE']
        }
      ]
    }
    $('input[name="answer[options]"]').val(null);
    var map = new VisMap('#map','/json/africaTopoMap.json', question_data);
    map._click_subunit = function(country,selection_index) {
      if(locked)
        return false;
      if($('path.' + country.properties.sov_a3).hasClass('give_hint')){
        return false;
      }
      if(toggleValue(country.properties.subunit))
        $('path.' + country.properties.sov_a3).toggleClass('selected');
    }
    map.render(function(){
      $('path.hint').each(function(){
        $(this).addClass('give_hint');
        toggleValue($(this).data('name'));
      });
    });

    map.showPreviousValuesLegend();

    // position the text container in the middle and front to start
    if(mobile){

    } else {
      $('.text_container').velocity({translateX: "50%", "z-index": 100 }, {duration: "0"} ).css("visibility", "visible");
      $('.map_container').velocity({visibility: "visible", translateX: "-50%", scale: "50%", opacity: .2}, {duration: "0"} ).css("visibility", "visible");
      $('.give_hint_button').hide();
    }

    $('.init_inter').on('click', function(e){
      e.preventDefault();
      $('.text_container').velocity({translateX: 0}, {duration: "650"} );
      $('.map_container').velocity({translateX: 0, scale: "100%", opacity: 1}, {duration: "650", complete: function(){ $('.give_hint_button').velocity("transition.slideDownIn", { delay: 300 }); }});
      $(this).hide();
      $('[data-after-go]').velocity("transition.slideDownIn", { delay: 1000 });
    });

    $('.give_hint_button').on('click', function(e){
      e.preventDefault();
      $('path.hint').each(function(){
        if(!$(this).hasClass('selected')){
          $(this).addClass('give_hint');
          toggleValue($(this).data('name'));
          totalHints++;
        }
      });
      // TODO: hide the button in a funny way
      // $(this).velocity({opacity: 0}, {complete: function(){$(this).remove();}});
      $(this).velocity("transition.slideDownOut");
    });

    $('form[data-answers]').on('ajax:success', function(e, data, status, xhr){
      e.preventDefault();
      e.stopPropagation();

      locked = true;
      $('[data-after-go]').hide();
      $('#counter').hide();
      $('.give_hint_button').hide();
      var $results = $('#results');
      var diff = getResultsDifference(data.right_options);
      if(diff.length == 0) {
        $results.html('Wow, that was perfect!');
      } else {
        var total = $('#total').attr('data-total');
        var right = total - diff.length - $('path.give_hint').length;
        $results.html('Ohhh, you got ' + right + ' right, so you missed ' + diff.length + '. Look at the map to learn the right ones.');
        diff.forEach(function(name){
          var $el = $('path[data-name="'+name+'"]');
          $el.addClass('not_selected');
        });
        $('path.selected,path.give_hint').each(function(){
          var name = $(this).data('name');
          if(data.right_options.indexOf(name) === -1){
            $(this).addClass('failed');
          }
        });
      }
      $('path.give_hint').each(function(){
        $(this).removeClass('give_hint').addClass('selected');
      });
      $results.velocity("transition.slideDownIn");
      $(this).hide();
      $('#next-screen').velocity("transition.slideDownIn", { delay: 3000 });
      map.showResultsLegend();
      $('[data-after-map]').fadeIn();
    });

    function toggleValue(val){
      $('#counter').show();
      var valuesLength = $('input[name="answer[options][]"]').length;
      var $input = $('input[name="answer[options][]"][value="'+val+'"]');
      if($input.length){
        $input.remove();
        valuesLength--;
      } else {
        if( valuesLength < totalResponses){
          $('form[data-answers]').append('<input multiple="multiple" type="hidden" value="'+val+'" name="answer[options][]" id="answer_options">');
          valuesLength++;
        } else {
          return false;
        }
      }

      $('#count').html(valuesLength);
      $('[data-pending]').html(totalResponses - valuesLength);

      if(valuesLength == totalResponses) {
        $('form[data-answers] input:submit').show();
      } else {
        $('form[data-answers] input:submit').hide();
      }
      return true;
    }

    function getResultsDifference(data){
      var selectedCountries = $('path.selected,path.give_hint').map(function(){ return $(this).data('name'); });

      return _.difference(data, selectedCountries.toArray());
    }
  }
}).call(this);
