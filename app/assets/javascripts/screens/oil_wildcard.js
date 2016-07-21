(function() {
  this.App.oil_wildcard = function(){
    var correctAnswers = null;

    function dragMoveListener (event) {
      var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    var totalResponses = parseInt($('[data-total]').data('total'));
    $('form[data-answers] input:submit').hide();
    interact('.draggable').draggable({
      // call this function on every dragmove event
      onmove: dragMoveListener,
    });
    interact('[data-droppable]').dropzone({
      overlap: 0.15,
      ondrop: function (event) {
        var $target = $(event.target);
        var position = $target.data('position');
        var option = event.relatedTarget.textContent;
        $(event.relatedTarget).hide();
        $target.html(option);
        var val = position + '|' + option;
        $('input[name="answer[options][]"]').each(function(){
          // remove with the same position
          if($(this).val()[0] === position){
            $(this).remove();
          }
          // remove with the same option
          if($(this).val().slice(2) === option){
            $(this).remove();
          }
        });
        $('form[data-answers]').append('<input multiple="multiple" type="hidden" value="'+val+'" name="answer[options][]" id="answer_options">');

        var valuesLength = $('input[name="answer[options][]"]').length;
        if(valuesLength == totalResponses) {
          $('form[data-answers] input:submit').velocity("transition.slideDownIn");
        } else {
          $('form[data-answers] input:submit').hide();
        }
      }
    });

    $('[data-restart]').on('click', function(e){
      e.preventDefault();

      $('input[name="answer[options][]"]').remove();
      $('[data-droppable]').html('');
      $('li.draggable').attr('style',null);
      $('.draggable').each(function(){
        $(this).removeAttr('data-x').data('x', null);
        $(this).removeAttr('data-y').data('y', null);
      });
    });

    $('form[data-answers]').on('ajax:success', function(e, data, status, xhr){
      e.preventDefault();
      e.stopPropagation();

      correctAnswers = data.right_options;
      var right = 0, wrong = 0;

      $('[data-restart]').remove();
      $(this).hide();
      $('#next-screen').show();
      data.right_options.forEach(function(answer){
        var position = answer.split('|')[0];
        var option = answer.split('|')[1];
        $('.draggable:contains("'+option+'")').remove();
        var $droppable = $('[data-position='+position+']');
        $droppable.html(option);
        if($('input[name="answer[options][]"][value="'+answer+'"]').length){
          $droppable.addClass('correct');
          right++;
        } else {
          $droppable.addClass('wrong');
          wrong++;
        }
      });

      if(wrong > 0){
        $('#results').html('You got '+right+' right, and failed to guess '+wrong+'! Click <a href="#" data-show-correct-answers>here</a> to show the correct sentence.');

        $('[data-show-correct-answers]').on('click', function(e){
          e.preventDefault();

          correctAnswers.forEach(function(answer){
            var position = answer.split('|')[0];
            var option = answer.split('|')[1];
            var $droppable = $('[data-position='+position+']');
            if($droppable.hasClass('wrong')){
              $droppable.html(option);
              $droppable.removeClass('wrong');
            }
          });
          $('#results').hide();
        });
      } else {
        $('#results').html('Wow, that was perfect!');
      }
      $('#results').fadeIn(500);
    });
  }
}).call(this);
