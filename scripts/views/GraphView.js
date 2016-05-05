var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var GraphCollection = require('./../collections/GraphCollection');

module.exports = Backbone.View.extend({

	/*
		Define colors to use in the graph.
		Todo: implement D3.js color creation functionality
	*/
	colors: ["#0022FF", "#D97600", "#4cdbab", "#b0ca4c"],

	graphYearTicks: [1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000],

	/*
		Graph size and visual margins
	*/
	graphWidth: 1120,
	graphHeight: 300,

	graphMargins: {
		top: 20,
		right: 0,
		bottom: 20,
		left: 40
	},

	startYear: 1600,
	endYear: 2015,

	/*
		Initialize the module
	*/
	initialize: function(options) {
		this.options = options;
		/*
			Initialize the collection that handles API calls
		*/
		this.collection = new GraphCollection();
		this.collection.on('reset', this.renderGraph, this);
		this.render();
	},


	createLine: function(yProcessor) {
		/*
			Generate path data.
			yProcessor: function that returns value for the y axis

		*/
		var view = this;

		return d3.svg.line()
			.interpolate("ordinal")
			.x(function(d) {
				// Returns a pixel value for the x range based on the corrent year using the xRange scale object
				return view.xRange(Number(d.year));
			})
			.y(yProcessor)
	},

	createYRangeValues: function() {
		this.yRangeValues = _.union(
			_.map(this.collection.at(0).get('data').birth_years, _.bind(function(item) {
				 return Number(item.c);
			}, this)),
			_.map(this.collection.at(0).get('data').death_years, _.bind(function(item) {
				 return Number(item.c);
			}, this))
		);
	},

	createYRange: function() {
		return d3.scale.linear().range([this.graphHeight - this.graphMargins.top, this.graphMargins.bottom]).domain([0,
			d3.max(this.yRangeValues)
		]);
	},

	renderGraph: function() {
		// Render the graph

		this.$el.removeClass('loading');
		var view = this;

		this.graphWidth = this.$el.parent().width();

		this.$el.find('.graph-container svg').attr('height', this.graphHeight);

		this.$el.find('.search-term-label').text(this.collection.queryString);

		// Remove all elements from our svg element
		d3.selectAll('svg#graphContainer'+this.cid+' > *').remove();

		// Check if we have results or not
		if (this.collection.at(0).get('data').length == 0) {
			this.trigger('zeroresults');
			this.$el.addClass('no-results');

			return;
		}
		else {
			this.$el.removeClass('no-results');
		}

		// Collect all x values (year) from the result colleciton

		this.xRangeValues = _.uniq(_.union(
			_.map(this.collection.at(0).get('data').birth_years, function(item) {
				return Number(item.year);
			}),
			_.map(this.collection.at(0).get('data').death_years, function(item) {
				return Number(item.year);
			})
		));

		this.xRangeValues = this.xRangeValues.sort();

//		this.startYear = this.xRangeValues[0];
//		this.endYear = this.xRangeValues[this.xRangeValues.length-1];

		// Create x range scale which we will use to position points on the graph
		this.xRange = d3.scale.linear().range([this.graphMargins.left, this.graphWidth - this.graphMargins.right]).domain([this.startYear, this.endYear]);

		// Collect all y values from the result collection
		this.createYRangeValues();

		// Create y range scale which we will use to position points on the graph
		var yRange = this.createYRange();

		// Create the overlay rectangle which is used to display selected time range on the graph
		this.vis.append("rect")
			.attr("class", "timerange-overlay")
			.attr("x", this.graphMargins.left)
			.attr("y", this.graphMargins.top)
			.attr("width", this.graphWidth-this.graphMargins.right-this.graphMargins.left)
			.attr("height", this.graphHeight-this.graphMargins.bottom-this.graphMargins.top)
			.style("opacity", 0);

		// Bind mouse events to the graph
		this.vis
			.on("mouseenter", _.bind(function() {
				this.$el.find('.info-overlay').addClass('visible'); // Make the Info/Legends box visibile when the mouse enters the graph
			}, this))
			.on("mouseleave", _.bind(function() {
				this.$el.find('.info-overlay').removeClass('visible'); // Hide the Info/Legends box when the mouse leaves the graph
			}, this))
			.on("mousemove", function(event) {
				/*
					Move the Info/Legends box with relevant information about the year under the mouse.
				*/

				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		        // Position the Info/Legends box and pass the x mouse position as a year as a parameter
//		        view.overlayMessage(year, [d3.event.clientX, d3.event.clientY]);
			})
			.on('mousedown', function(event) {
				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		       // set dragStart to know in mousemove handler if we are draging the timerange or not
		       if (!view.options.disableDrag) {
			        view.dragStart = year;
		       }
			})
			.on('mouseup', function(event) {
				// Get the current position of the mouse
				var xPos = d3.mouse(this)[0];

				// Convert x position of the mouse to a year on the x axis using our xRange scale object
		        var year = Math.round(view.xRange.invert(xPos));

		        if (view.dragStart) {
		        	// if we are finishing a drag on the graph, fire a 'timerange' event
			        view.trigger('timerange', {
			        	values: [view.dragStart < year ? view.dragStart : year, view.dragStart > year ? view.dragStart : year]
			        });
		        }
		        else {
		        	// othervise fire a normal 'click' event
			        view.trigger('graphclick', {
			        	year: year
			        });
		        }

		        // unset dragStart var
		        view.dragStart = undefined;
			});


		// Create the visual x axis
		var xAxis = d3.svg.axis()
			.scale(this.xRange)
			.tickSize(1)
			.innerTickSize(-(this.graphHeight-this.graphMargins.bottom-this.graphMargins.top))
			.tickValues(this.graphYearTicks)
			.tickSubdivide(true)
			.tickFormat(function(d, i) {
				return d;
			});
		this.vis.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (this.graphHeight - this.graphMargins.bottom) + ')')
			.call(xAxis);

		// Create the visual x axis
		var yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(1)
			.innerTickSize(-this.graphWidth)
			.orient('left')
			.tickSubdivide(true);
		this.vis.append('svg:g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + (this.graphMargins.left) + ',0)')
			.call(yAxis);

		var addLine = _.bind(function(lineData, color, index, area) {
			/*
				Helper function to create a line on the graph.

				lineData: buckets from the API
				color: color value for the line
				index: index of the line in the context of results items from the API (results.data.[...])
				*/

			/*
				When the graph renders, y values animate from 0 to the correcct value.
				In the becinning, we create a path data where y is always 0
			*/

			var lineData = (function() {
				var dataArray = [];

				for (var year = view.startYear; year<=view.endYear; year++) {
					var found = _.find(lineData, function(item) {
						return item.year == year;
					});

					if (found) {
						dataArray.push(found);
					}
					else {
						dataArray.push({
							year: year,
							c: 0
						});
					}
				}

				return dataArray;
			})();

			var line1 = this.createLine(_.bind(function(d) {
					return (yRange(0));
				}, this));

			// Create path data with correct y values
			var line = this.createLine(_.bind(function(d) {
				 return (yRange(d.c));
			}, this));

			// Appent the path element to the svg object
			this.vis.append("path")
				.datum(lineData) // set the data to the path element.
				.attr("class", "line line-"+index)
				.attr('fill', area ? color : 'none')
				.attr('fill-opacity', area ? '0.3' : '0')
				.attr('stroke-width', area ? 0 : 1)
				.attr('stroke', color)
				.attr("data-index", index)
				.attr("d", line1) // Set the path data with y values as 0 to the path "d" attribute.
				.transition() // Initialize animation.
				.duration(1000)
				.attr("d", line); // Animate the line to the corrent y values.

			// Append the small circles to each data point on the line.
/*
			var circles = this.vis.append('g');
			var data = circles.selectAll('circle')
				.data(lineData);

			data.enter()
				.append('circle')
				.attr('class', 'point')
				.attr('fill', color)
				.attr('cx', function (d) {
					return view.xRange(Number(d.year));
				})
				.attr('cy', _.bind(function (d) {
					return (yRange(d.c));
				}, this))
				.attr('r', 0)
				.on('mouseover', function() {
					tooltip.style('display', null);
				})
				.on('mouseout', function() {
					tooltip.style('display', 'none')
				})
				.on('mousemove', function(d) {
					var xPosition = d3.mouse(this)[0] - 50;
					var yPosition = d3.mouse(this)[1] - 25;
					tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
					tooltip.select('text').text(d.year+': '+d.c);
				})
				.transition()
				.delay(750)
				.duration(200)
				.attr('r', strokeWidth ? strokeWidth : 2);

			data.exit().attr('class', 'exit').transition(750)
				.ease('linear')
				.attr('cy', 0)
				.style('opacity', 0.2)
				.remove();
*/
		}, this);
		addLine(this.collection.at(0).get('data').map_birth_years, this.colors[0], 2, true);
		addLine(this.collection.at(0).get('data').map_death_years, this.colors[1], 3, true);
		addLine(this.collection.at(0).get('data').birth_years, this.colors[0], 0);
		addLine(this.collection.at(0).get('data').death_years, this.colors[1], 1);

		var tooltip = this.vis.append('g')
			.attr('class', 'tooltip')
			.style('display', 'none');

		tooltip.append('rect')
			.attr('width', 100)
			.attr('height', 20)
			.attr('fill', '#333')
			.style('opacity', 1);

		tooltip.append('text')
			.attr('x', 50)
			.attr('dy', '1.2em')
			.style('text-anchor', 'middle')
			.attr('fill', 'white')
			.attr('font-size', '12px');

		// If the grahp has a set timerange, then adjust the time overlay.
		if (this.timeOverlay) {
			this.setTimeOverlay(this.timeOverlay);
		}

		this.trigger('rendergraph'); // Trigger 'renderGraph' event.
	},

	setTimeOverlay: function(values) {
		/*
			Adjust the visual time range overlay.
		*/
		this.timeOverlay = values;

		if (Number(this.timeOverlay[0]) == this.startYear && Number(this.timeOverlay[1]) == this.endYear) {
			this.vis.select('rect.timerange-overlay')
				.transition()
				.duration(100)
				.style('opacity', 0);
		}
		else {

			this.vis.select('rect.timerange-overlay')
				.attr('x', this.xRange(Number(values[0])+0.2))
				.attr('width', this.xRange(Number(values[1])-0.2)-this.xRange(Number(values[0])+0.2))
				.transition()
				.duration(100)
				.style('opacity', 0.1);			
		}
	},

	overlayMessage: function(year, position) {
		/*
			Position the info/legends box for the current year and feed the right data into it.
		*/
		
		var birthYearCount = _.find(this.collection.at(0).get('data').birth_years, function(data) {
			return data.year == year;
		});
		var deathYearCount = _.find(this.collection.at(0).get('data').death_years, function(data) {
			return data.year == year;
		});

		var template = _.template($("#ngramInfoTemplate").html());

		this.$el.find('.info-overlay').html(template({
			data: {
				year: year,
				total:this.collection.getTotalByYear(year),
				legends: legends
			}
		}));

		var xPos = (position[0]+60);
		var yPos = (position[1]);

		if (xPos+this.$el.find('.info-overlay').width() > $(window).width()) {
			xPos = xPos-this.$el.find('.info-overlay').width()-100;
		}

		this.$el.find('.info-overlay').css({
			'-webkit-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-moz-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-ms-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'-o-transform': 'translate('+xPos+'px, '+yPos+'px)',
			'transform': 'translate('+xPos+'px, '+yPos+'px)'
		})
	},

	render: function() {
		/*
			Render the graph.
		*/
		var template = _.template($("#graphViewTemplate").html());
	
		this.$el.html(template({}));

		this.$el.find('.graph-container svg').attr('id', 'graphContainer'+this.cid); // Set a unique ID to the graph to enable multiple graphs to be displayed on a single page.

		this.vis = d3.select('#graphContainer'+this.cid);

		window.onresize = _.bind(function() {
			if (this.collection.length > 0) {
				this.renderGraph();
			}
		}, this);
	}
});