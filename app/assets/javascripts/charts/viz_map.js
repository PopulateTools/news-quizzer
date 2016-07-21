var VisMap = Class.extend({
  init: function(containerId, topoUrl, questionData, optionSelector) {
    this.questionData = questionData;
    this.colors = {
      // selected: '#48AF66',            // selected by the user
      // failed: '#d55c45',              // selected by the user and incorrect
      // not_selected: '#179243',        // not selected by th euser
      selected_safaris: '#E3A517',    // safaris country
      selected_oil: '#3D2D07',           // oil country
      selected_diamond: '#631D1E',   // diamonds country
      // selected: '#6EB644',            // selected by the user
      failed: '#AE2724',              // selected by the user and incorrect
      not_selected: '#FEEDC0',        // not selected by the user

      /*
      #4A1516 - map, with 12% opacity
      #FEEDC0 - blanquito
      #FDBF5A - amarillo
      #4A1516 - marron
      #AE2724 - green right
      #6EB644 - red wrong
      */
    };
    this.dict = {
      selected_safaris: 'Safari countries',
      selected_oil: 'Oil countries',
      selected_diamond: 'Diamond countries',
      not_selected: 'You missed these ones',
      failed: 'You guessed wrong'
    }

    this.containerId = containerId;

    this.visSelector = this.containerId;
    this.topoUrl = topoUrl;

    this.optionSelector = optionSelector;
    this.subunitClass = 'subunit';
    this.othersClass = 'other'
    this.setupClasses = this.questionData.setup_classes.map(function(c) { return c.class })

    this.handledEvents = ['click','mouseout','mouseover']

    // Chart dimensions
    this.containerWidth = null;
    this.margin = {top: 75, right: 50, bottom: 75, left: 50};
    this.width = this._width()
    this.height = this._width();

    // Scales

    // Axis

    // Data
    this.data = null;
    this.userRawAnswer = null;
    this.userFormattedAnswer = null;

    // Chart objects
    this.svg = null;
    this.map = null;
    this.projection = null;
    this.scaleFactor = 0.72;

    // Create main elements
    this.svg = d3.select(this.visSelector)
      .append('svg')
      .attr('width',this.width)
      .attr('height',this.height);

    this.map = this.svg.append("g")
                  .attr("class", "map");

    this.tooltip = {
      element: null,
      init: function() {
          this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
      },
      show: function(t) {
          this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);
      },
      move: function() {
          this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);
      },
      hide: function() {
          this.element.transition().duration(500).style("opacity", 0)
      }
    };

    this.tooltip.init();

    d3.select(window).on('resize', this._resize.bind(this));

  },
  getData: function(callback) {
    d3.json(this.topoUrl, function(error, jsonData) {
      if (error) throw error;

      this.data = jsonData;
      this.updateRender(callback);
      this._bind_events();
      this._bind_tooltip();
    }.bind(this));
  },

  render: function(callback) {
    if (this.data == undefined) {
      this.getData(callback);
    } else {
      this.updateRender(callback);
    }
  },

  updateRender: function(callback) {

    var topo_subunits = topojson.feature(this.data, this.data.objects.collection);

    this.projection = d3.geo.mercator()
        .center([18, 2])
        .scale(this.width * this.scaleFactor)
        .translate([this.width / 2, this.height / 2]);

    var path = d3.geo.path()
        .projection(this.projection);

    var subunits = this.map.selectAll(".subunit")
        .data(topo_subunits.features)

    var subunits_enter = subunits.enter().append("path")
          .attr("class",function(d) { return d.properties.sov_a3; })
          .attr("data-name",function(d) { return d.properties.subunit; })
          .classed(this.subunitClass, true);

    var others_selector = '.' + this.subunitClass;
    this.questionData.setup_classes.forEach(function(setup_class) {

      var possible_values = setup_class.values

      subunits_enter.filter(function(su) {
        var val = su.properties[setup_class.filter_by]
        return possible_values.indexOf(val) > -1
      }).classed(setup_class.class,true);

      others_selector += ":not(." + setup_class.class + ")";
    })

    //We apply the othersClass to any unit not previously filtered
    this.svg.selectAll(others_selector).classed(this.othersClass,true);

    var subunits_update = subunits
          .attr("d", path);

    callback;
  },

  showPreviousValuesLegend: function(){
    $('.legend').remove();
    var classes = this.setupClasses.filter(function(c){ return /^selected/.test(c); });
    var colors = classes.map(function(c){ return this.colors[c]; }.bind(this));
    var prev_legends = this._extractLegendLiterals();
    
    this.legendScale = d3.scale.ordinal()
      .domain(prev_legends)
      .range(colors);

    this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (this.width - 150) + ",10)");

    this.legend = d3.legend.color()
      .shapePadding(7)
      .shape('circle')
      .labelAlign('middle')
      .scale(this.legendScale);

    this.svg.select(".legend").call(this.legend);
  },

  showResultsLegend: function(){
    $('.legend').remove();
    var map_class = "selected_" + this.questionData.map.toLowerCase();
    var classes = [map_class, "not_selected", "failed"];

    var colors = classes.map(function(c){ return this.colors[c]; }.bind(this));
    classes = classes.map(function(c){ return this.dict[c] }.bind(this));
    
    var setupClasses = this.setupClasses.filter(function(c){ return /^selected/.test(c); });
    
    colors = colors.concat(setupClasses.map(function(c){ return this.colors[c]; }.bind(this)))
    setupClasses = this._extractLegendLiterals();
    classes = classes.concat(setupClasses);
    console.log(classes);

    this.legendScale = d3.scale.ordinal()
      .domain(classes)
      .range(colors);

    this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(40,"+(this.height - 200)+")");

    this.legend = d3.legend.color()
      .shapePadding(7)
      .shape('circle')
      .labelAlign('middle')
      .scale(this.legendScale);

    this.svg.select(".legend").call(this.legend);
  },

  checkResult: function() {

    // This should be updated to POST results to the right URL.

    // d3.json(this.checkAnswerUrl, function(error, jsonData) {
    //   if (error) throw error;

    //   this.data = jsonData;
    //   this.updateRender();

    //   //no longer possible to change your answer
    //   this.svg.select('.guess').on(".drag", null)

    // }.bind(this));
  },

  tooltipContent: function(d){
    return "<b>" + d.properties.subunit  + "</b>";
  },
  _extractLegendLiterals: function() {
    return this.setupClasses.filter(function(c) {
      return /^selected/.test(c) }).map(function(c) {
          return this.dict[c];
        }.bind(this))
  },
  _width: function() {
    return parseInt(d3.select(this.visSelector).style('width'));
  },
  _resize: function() {
    this.width = this._width();
    this.height = this._width();
    this.svg.attr('width',this.width)
      .attr('height',this.height);
    this.updateRender();
  },
  _bind_tooltip: function() {
    var subunits = this.svg.selectAll("." + this.subunitClass);
    subunits
      .on("mouseover", function (d, i) {
        this.tooltip.show(this.tooltipContent(d));
      }.bind(this))
      .on("mousemove", function (d, i) {
        this.tooltip.move();
      }.bind(this))
      .on("mouseout", function (d, i) {
        this.tooltip.hide();
      }.bind(this));
  },
  _bind_events: function() {
    var all_classes = d3.merge([this.setupClasses, [this.othersClass,this.subunitClass]]);
    this.handledEvents.forEach(function(ev) {
      all_classes.forEach(function(class_name) {
        try {
          var handler = eval("this._" + ev + "_" + class_name);

          if (typeof(handler) == "function") {
            var event_name = ev + "." + class_name;
            d3.selectAll("." + class_name).on(event_name, handler);
          }
        } catch(err) {}
      }.bind(this));
    }.bind(this))
  }
});

