//= require jquery
//= require jquery_ujs
//= require flight-for-rails
//= require d3.v3.min
//= require d3-legend.min
//= require topojson.v1.min
//= require velocity.min
//= require velocity.ui
//= require jquery.animateNumber.min
//= require jquery.magnific-popup.min
//= require underscore-min
//= require interact.min
//= require app
//= require klass
//= require_tree ./components/
//= require_tree ./screens/
//= require_tree ./charts/

/*
(function(d) { var vmd=d.createElement("script"); vmd.src="http://velocityjs.org/vmd.min.js"; d.body.appendChild(vmd); })(document);
*/

function update_progress(new_value) {
  new_value = (new_value / parseFloat($('.progress').attr('max'))) * 100;
  $('.progress .progressed').velocity({width: new_value + '%'});
}

function open_help() {
  $('.buttons .open_help').velocity({ opacity: 0 }, { display: "none" });
  $('#help_overlay').velocity({ opacity: 1 }, { display: "block" });
  $('#menu-toggle').velocity({ opacity: 0 }, { display: "none" });
}
function close_help() {
  $('.buttons .open_help').velocity({ opacity: 1 }, { display: "inline-block" });
  $('#help_overlay').velocity({ opacity: 0 }, { display: "none" });
  $('#menu-toggle').velocity({ opacity: 1 }, { display: "inline-block" });
}


// Put code for document load and ajax success
function onDocumentLoad(){

  // a small bounce of the progress bar in the first load
  // $('#progress .progressed').velocity({width: '50%'}).velocity({width: '0%'});

  var currentScreen = $('body').data('screen');
  if(App[currentScreen] !== undefined)
    App[currentScreen]();

  if(currentScreen == 'how_many_people') {
    open_help();
  }
  // Track response time component
  window.trackFormTime.attachTo('form');

  // Share in social networks component
  window.shareContent.attachTo('[data-share]');


  $('.open_modal').magnificPopup({
    type: 'inline',
    removalDelay: 300,
    mainClass: 'mfp-fade'
  });

  $('.close_modal').click(function(e) {
    $.magnificPopup.close();
  });

  $('.start').click(function(e) {
    e.preventDefault();
    $(this).hide();
    // $('.intro_modal').velocity("transition.slideDownBigIn");
    $('.intro_modal').show();
    $('.intro_modal').velocity("scroll", { container: $(".content") });
  });

  // Single questions interaction
  $('form[data-question="single-choice"] input').on('change', function(e){
    e.preventDefault();
    $(this).parents('form').submit();
  });

  $('form[data-question="single-choice"]').one('ajax:success', function(e, data, status, xhr){
    if($('[data-hint]').length){
      $('[data-hint]').html(data.hint).velocity("transition.slideDownIn");
    }
    var $right = $(this).find('input[name="answer[options]"][value="'+data.right_options[0]+'"]');
    if(!$right.prop('checked')){
      $(this).find('input[name="answer[options]"]:checked').parent().addClass('wrong').append('<i class="fa fa-times"></i>');
    }
    $right.parent().addClass('correct').append('<i class="fa fa-check"></i>');;
    $('.answers').velocity('scroll', { container: $(".content") });
    $('#next-screen').velocity("transition.slideDownIn", { delay: 2000 });

    $(this).find('input').prop('disabled', true);
  });

  $('form').one('ajax:success', function(e, data, status, xhr){
    var previousPoints = parseInt($('#points').html());
    if(data.points !== undefined && previousPoints !== data.points) {
      $('#points').animateNumber({ number: data.points, easing: 'easeInQuad'});
      // $('.callout_points').velocity("transition.expandIn").velocity("transition.shrinkOut");
      $('.callout_points').velocity("transition.expandIn", { delay: 1000 }).velocity("transition.expandOut");
      // $('.callout_points').velocity("callout.pulse");
      console.log('callout points');
    }

    if(data.ranking_position !== undefined && parseInt($('#ranking-position').html()) !== data.ranking_position)
      $('#ranking-position').animateNumber({ number: data.ranking_position });
  });

}

// Capture custom event instead of Ajax success
$(document).on('pageLoaded', function() {
  onDocumentLoad();
});

$(function() {
  update_progress($('.progress').attr('value'));

  // Run only once because the element is not loaded in the Ajax request
  $('.menu-toggle').click(function(e) {
    e.preventDefault();
    $('#menu-toggle').toggleClass('opened');
    $('#menu-toggle').attr('aria-expanded', true);
    if($('.slide_menu').css('display') == 'block') {
      $('.slide_menu').velocity("transition.slideLeftBigOut").velocity({ display: 'none'});
      $('.buttons .open_help').velocity({ opacity: 1 }, { display: "block" });
    }
    else {
      $('.slide_menu').velocity("transition.slideLeftBigIn");
      $('.buttons .open_help').velocity({ opacity: 0 }, { display: "none" });
    }
  });

  $('.open_help').click(function(e) {
    e.preventDefault();
    open_help();
  });

  $('.close_help').click(function(e) {
    e.preventDefault();
    close_help();
  });


  onDocumentLoad();
});
