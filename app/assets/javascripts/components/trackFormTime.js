(function(window, undefined){
  'use strict';

  window.trackFormTime = flight.component(function(){
    this.attributes({
      inputSelector: 'input[name="answer[took]"]'
    });

    this.after('initialize', function(){
      if(this.hasInputs()){
        this.attr.t0 = new Date();
        this.$node.on('submit', this.trackTime.bind(this));
      }
    });

    this.trackTime = function(e) {
      var took = new Date - this.attr.t0;
      this.$node.find(this.attr.inputSelector).val(took);
      console.log('updated answer took with: ' + took);
      return true;
    };

    this.hasInputs = function(){
      return this.$node.find(this.attr.inputSelector).length > 0;
    };
  });

})(window);
