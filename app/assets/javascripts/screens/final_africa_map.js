(function() {
  this.App.final_africa_map = function(){
    var question_data = {
      "setup_classes": []
    }
    var map = new VisMap('#map','/json/africaTopoMap.json', question_data);
    map.tooltipContent = function(d){
      return "<b>" + d.properties.subunit  + "</b><br><br>" +
            "<b>Company:</b> " + d.properties.company_name + "<br>" +
            "<b>Offshore:</b> " + d.properties.offshore + "<br>" +
            "<b>Activity:</b> " + d.properties.activity + "<br><br>" +
            d.properties.description;
    },

    map.render(function(){return true;});
    map.showPreviousValuesLegend();
  }
}).call(this);
