class EmbedController < ApplicationController
  def show
    respond_to do |format|
      format.js do
render text: <<-JS
(function(global, undefined){
  'use strict';

  var jQuery;

  if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.12.1') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src", "//#{request.host_with_port}/embed-include.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          scriptLoadHandler();
        }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
  } else {
    jQuery = window.jQuery;
    main();
  }

  function scriptLoadHandler() {
    jQuery = window.jQuery.noConflict(true);
    main();
  }

  function main() {
    jQuery(document).ready(function($) {
      var $script = $('script[data-embed]');
      var url = "//#{request.host_with_port}/";
      var embedID = "icij_embed";
      if($('#' + embedID).length === 0){
        // Your embed code
      }
    });
  }
})(window);
JS
      end
    end
  end
end
