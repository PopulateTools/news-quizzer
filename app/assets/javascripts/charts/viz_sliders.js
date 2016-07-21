'use strict';

var VisSlider = Class.extend({
  init: function(options) {
    this.containerId = options.id;
    this.locked = false;

    this.questionSelector = this.containerId + " .question";
    this.sliderSelector = this.containerId + " .slider";

    //this is because scroll takes place within a div, not the browser
    this.scrollableParentSelector = '.content';

    this.optionSelector = options.optionSelector;
    this.mode = options.mode;

    this.number_format = options.questionData.number_format;
    this.data = options.questionData;
    this.domain = options.questionData.domain;

    this.circleRadius = 14;
    this.innerTickSize = 12;
    this.outerTickSize = 0;

    // Chart dimensions
    this.containerWidth = null;
    this.margin = {top: 75, right: 0, bottom: 75, left: 35};
    this.width = parseInt(d3.select(this.sliderSelector).style('width'));
    this.height = (this._horizontalMode()) ? 125 : 400;
    this.labelPaddingTop = 50;
    this.labelPaddingLeft = 80;
    this.labelPaddingBottom = 26;

    // Scales
    this.xScale = d3.scale.linear().clamp(true);

    // Axis
    this.xAxis = d3.svg.axis().orient(this._horizontalMode() ? 'top' : 'right').ticks(5).tickSize(this.innerTickSize, this.outerTickSize);

    // Data
    this.userRawAnswer = null;
    this.userFormattedAnswer = null;

    // Chart objects
    this.svg = null;
    this.chart = null;

    // Handles
    this.drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", this._dragStarted.bind(this))
      .on("drag", this._dragged.bind(this))
      .on("dragend", this._dragEnded.bind(this));

    // Create main elements
    this.svg = d3.select(this.sliderSelector)
      .append('svg')
      .classed('slider_svg',true)
      .attr('width',this.width)
      .attr('height',this.height);

    this.updateContainerOffset();
    d3.select(this.scrollableParentSelector)
      .on('scroll', function() {
        this.updateContainerOffset();
      }.bind(this));
  },

  // Replace G by billion unit
  formatNumber: function(d){
    var format = this.number_format;

    if (d < 10)
      format = ".1" + format;
    else if (d < 100 )
      format = ".2" + format;
    else if (d >= 1000*1000*1000 && d < 1000*1000*1000*10)
      format = "$.1s";
    else
      format = "$.2s";

    var f = d3.format(format)(d);
    switch (f[f.length - 1]) {
      case "G": return f.slice(0, -1) + " " + (this.width < 740 ? 'bn.' : 'billion');
    }
    return f;
  },

  updateContainerOffset: function(){
    if(this._horizontalMode()){
      this.containerOffset = this.svg.node().getBoundingClientRect().left;
    } else {
      this.containerOffset = this.svg.node().getBoundingClientRect().top;
    }
  },

  render: function() {
    if (!this._axisRendered()) {
      d3.select(this.questionSelector).text(this.data.question);
      this._renderAxis();
    }

    var circles = this.svg.selectAll('circle')
      .data(this.data.values, function(d) { return d.class })

    var circles_enter = circles.enter()
      .append('circle')
      .attr('style','opacity:1')
      .attr('class', function(d) { return d.class })
      .attr('id', function(d) { return d.class })
      .on("mouseover", this._mouseOver.bind(this))
      .on("mouseout", this._mouseOut.bind(this))
    ;

    var circles_update = d3.transition(circles)
      .attr('cx', function(d) {
        if(this._horizontalMode()) {
          return this.xScale(d.value);
        } else {
          return this.margin.left + this.labelPaddingLeft;
        }
      }.bind(this))
      .attr('cy', function(d) { return this.margin.top; }.bind(this))
      .attr('r', function(d) { return this.circleRadius; }.bind(this));

    var labels = this.svg.selectAll('text.label')
      .data(this.data.values, function(d) { return d.class })

    var static_labels = labels.enter()
      .append('text')
      .text(function(d) { return d.label })
      .attr('y', function(d) {
        if(d.class == 'guess'){
          if(this._horizontalMode()){
            return this.margin.top - this.labelPaddingTop;
          } else {
            return this.margin.top;
          }
        } else {
          if(this._horizontalMode()){
            return this.margin.top + this.labelPaddingBottom + 20;
          } else {
            return this.margin.top;
          }
        }
      }.bind(this))
      .attr('x', function(d) {
        if(this._horizontalMode()){
          return this.xScale(d.value);
        } else {
          return this.margin.left;
        }
      }.bind(this))
      .attr('class', function(d) { return 'label ' + d.class; })

    var value_labels = labels.enter()
      .append('text')
      .text(function(d) { return this.formatNumber(d.value) }.bind(this))
      .attr('y', function(d) {
        if(d.class == 'guess'){
          if(this._horizontalMode()){
            return this.margin.top - this.labelPaddingTop + 20;
          } else {
            return this.margin.top + 20;
          }
        } else {
          if(this._horizontalMode()){
            return this.margin.top + this.labelPaddingBottom;
          } else {
            return this.margin.top + 20;
          }
        }
      }.bind(this))
      .attr('x', function(d) {
        if(this._horizontalMode()){
          return this.xScale(d.value);
        } else {
          return this.margin.left;
        }
      }.bind(this))
      .attr('class', function(d) { return 'value ' + d.class; })

    this.svg.select('.guess').call(this.drag);
    this.svg.select('.guess')
      .on('touchstart', function() { d3.event.preventDefault(); })
      .on('touchmove', function() { d3.event.preventDefault(); })

    if(this._horizontalMode() && labels.size() > 1)
      this._adjustLabelCollisions();
  },

  checkResult: function(dataValues) {
    this.locked = true;
    this.data.values = dataValues;
    this.render();

     this.svg.selectAll('circle.reality,circle.average')
       .attr('r',function(d) { return this.circleRadius*1.75 }.bind(this))
       .transition()
       .ease("elastic")
       .duration(3200)
       .attr('r',function(d) { return this.circleRadius }.bind(this));
  },

  _renderAxis: function() {
    //xAxis
    this.svg.append('g')
      .attr('class','x axis')
      .attr("transform", "translate("+ (this._horizontalMode() ? 0 : this.margin.left + this.labelPaddingLeft) + "," + (this._horizontalMode() ? this.margin.top : 0) + ")");

    if(this._horizontalMode()){
      this.xScale.domain(this.domain)
        .range([this.margin.left, this.width - this.margin.left - this.margin.right]);
    } else {
      this.xScale.domain(this.domain)
        .range([this.margin.top, this.height - this.margin.top - this.margin.bottom]);
    }

    this.xAxis.tickFormat(this.formatNumber.bind(this));
    this.xAxis.scale(this.xScale);

    this.svg.select(".x.axis").call(this.xAxis);

    // center ticks
    var half_a_tick = this._horizontalMode() ? this.innerTickSize/2 : 0;
    var vhalf_a_tick = this._horizontalMode() ? 0 : -this.innerTickSize/2;
    this.svg.selectAll('.tick line').each(function() {
      d3.select(this).attr('transform', "translate("+vhalf_a_tick+"," + half_a_tick + ")");
    });

    // send path to back
    var axis_path = this.svg.select(this.containerId + ' .axis path').remove();
    this.svg.select('.axis').insert(function() { return axis_path.node() }, '.tick');
  },

  _axisRendered: function() {
    return this.svg.selectAll('.x.axis').size() > 0;
  },

  _adjustLabelCollisions: function() {

    var avrg_label = this.svg.select('text.label.average');
    var rlty_label = this.svg.select('text.label.reality');

    var bb_avrg = avrg_label.node().getBBox();
    var bb_rlty = rlty_label.node().getBBox();

    if (this._labelsDoCollide(bb_avrg,bb_rlty)) {

      var average_value = avrg_label.data()[0].value;
      var reality_value = rlty_label.data()[0].value;

      var left_selector = "text.average",
          right_selector = "text.reality"
      if (average_value >= reality_value) {
        left_selector = "text.reality"
        right_selector = "text.average"
      }

      this.svg.selectAll(left_selector)
          .style('text-anchor','end')
          .attr('x', function(d) {
            return parseFloat(d3.select(this).attr('x')) - 1});
      this.svg.selectAll(right_selector)
        .style('text-anchor','start')
        .attr('x', function(d) {
          return parseFloat(d3.select(this).attr('x')) + 1 });
    }
  },

  _labelsDoCollide: function(box_1, box_2) {
    var box_1_end = box_1.x + box_1.width;
    var box_2_end = box_2.x + box_2.width;

    return (box_1_end > box_2.x && box_1_end < box_2_end) ||
        (box_1.x > box_2.x && box_1.x < box_2_end) ||
        (box_1.x < box_2.x && box_1_end > box_2_end)
  },

  _mouseOver: function(d) {
    if(this.locked) return false;
    this.svg.select("circle.guess").transition()
      .ease("elastic")
      .duration(300)
      .attr('r',function(d) { return this.circleRadius * 1.25 }.bind(this));
  },

  _mouseOut: function(d) {
    if(this.locked) return false;
    this.svg.select("circle.guess").transition()
      .ease("elastic")
      .duration(300)
      .attr('r',function(d) { return this.circleRadius; }.bind(this));
  },

  _dragStarted: function(d) {
    if(this.locked) return false;
    this.updateContainerOffset();
    var target = d3.event.sourceEvent.target;
    this.svg.select("circle.guess").classed("dragging", true);
    this.svg.select("circle.guess").transition()
      .ease("elastic")
      .duration(500)
      .attr('r',function(d) { return this.circleRadius * 1.75 }.bind(this));
  },

  _dragged: function(d) {
    if(this.locked) return false;
    if(this._horizontalMode()){
      var cx = this._getPageX() - this.containerOffset;
      d.value = this.xScale.invert(cx);

      if (this.domain[0] < d.value && d.value < this.domain[1]) {
        this.svg.select("circle.guess")
          .attr("cx", cx);
        this.svg.selectAll('text.guess')
          .attr('x', cx);
      }
    } else {
      var cy =  this._getPageY() - this.containerOffset;
      d.value = this.xScale.invert(cy);

      if (this.domain[0] < d.value && d.value < this.domain[1]) {
        this.svg.select("circle.guess")
          .attr("cy", cy);
        this.svg.selectAll('text.guess')
          .attr('y', cy);
        this.svg.selectAll('text.guess.value')
          .attr('y', cy + 20);
      }
    }

    this.svg.select('text.guess.value').text(this.formatNumber(d.value));
  },

  _dragEnded: function(d) {
    if(this.locked) return false;
    this.svg.select("circle.guess").classed("dragging", false);
    this.svg.select("circle.guess").transition()
      .ease("elastic")
      .duration(500)
      .attr('r',function(d) { return this.circleRadius }.bind(this))

    if(this._horizontalMode()){
      d.value = this.xScale.invert(this._getPageX() - this.containerOffset);
    } else {
      d.value = this.xScale.invert(this._getPageY() - this.containerOffset);
    }
    this.userRawAnswer = d.value;
    this.userFormattedAnswer = this.formatNumber(this.userRawAnswer);
    var $container = $(this.containerId);
    $container.find('input[name="' + this.optionSelector + '"]').val(this.userRawAnswer);
    $('tr[data-row-question="'+this.containerId+'"] td:eq(1)').html(this.userFormattedAnswer);
    var e = jQuery.Event("change");
    jQuery($container).trigger(e);
  },

  _horizontalMode: function(){
    return this.mode == 'horizontal';
  },

  _verticalMode: function(){
    return !this._horizontalMode();
  },

  _getPageY: function(){
    var pageY = d3.event.sourceEvent.pageY;
    if(pageY === undefined){
      if(d3.event.sourceEvent.touches.length)
        pageY = d3.event.sourceEvent.touches[0].pageY;
      if(d3.event.sourceEvent.changedTouches.length)
        pageY = d3.event.sourceEvent.changedTouches[0].pageY;
    }
    return pageY;
  },

  _getPageX: function(){
    var pageX = d3.event.sourceEvent.pageX;
    if(pageX === undefined){
      if(d3.event.sourceEvent.touches.length)
        pageX = d3.event.sourceEvent.touches[0].pageX;
      if(d3.event.sourceEvent.changedTouches.length)
        pageX = d3.event.sourceEvent.changedTouches[0].pageX;
    }
    return pageX;
  },


});

