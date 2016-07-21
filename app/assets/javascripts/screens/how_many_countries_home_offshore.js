(function() {
  this.App.how_many_countries_home_offshore = function(){
    $('[data-slider]').first().velocity({ opacity: 1});

    var mobile = $(window).width() <= 740;

    $('#next-screen').hide();

    var sliders = {};
    $('[data-slider]').each(function(){
      var id = $(this).attr('id');
      var slider = new VisSlider({
        id: '#' + id,
        questionData: window.questionsData[id],
        optionSelector: 'answer[options]',
        mode: 'horizontal' // mobile ? 'vertical' : 'horizontal'
      });
      slider.render()
      slider.updateContainerOffset();
      sliders[id] = slider;
    });

    if(mobile){
      $('[data-question]').each(function(){
        if($(this).data('question') > 0){
          $(this).hide();
        }
      });
    }

    $('[data-slider]').on('change', function(e){
      e.preventDefault();
      var empty = false;
      if(mobile){
        $(e.target).find('[data-next-question]').show();
      }
      $(e.target).next().velocity({ opacity: 1});
      $("input[name='answer[options]']").each(function(){
        if($(this).val() === ""){
          empty = true;
        }
      });
      if(!empty){
        $('#check-results').velocity("transition.slideDownIn", { delay: 300 });
      }
    }.bind(this));

    $('#check-results').on('click', function(e){
      e.preventDefault();
      $('#check-results').hide();

      $('[data-slider] form').each(function(){
        $(this).submit();
      });

      $('#next-screen').velocity("transition.slideDownIn", { delay: 300 });
    }.bind(this));

    $('[data-slider] form').on('ajax:success', function(e, data, status, xhr){
      e.preventDefault();
      e.stopPropagation();
      var $parent = $(this).parents('[data-slider]');
      var id = $parent.attr('id');
      sliders[id].checkResult(data.right_options);
      $(this).remove();
      $('[data-hint]').fadeIn(500);
    });
  };

}).call(this);
