var treeData = [
  {
    "name": "David Hilbert",
    "parent": "null",
    "value": 10,
    "type": "black",
    "level": "red",
    "_children": [
    	{
        "name": "Richard Courant",
        "parent": "David Hilbert", 
		    "value": 10,
		    "type": "black",
		    "level": "red",
        "_children": [      
	        {
		        "name": "Harold Grad",
		        "parent": "Richard Courant",
		      }, 
		      {
		        "name": "William Feller",
		        "parent": "Richard Courant",
		      }, 
		      {
		        "name": "Kurt Friedrichs",
		        "parent": "Richard Courant",
				    "value": 10,
				    "type": "black",
				    "level": "red",
		        "_children": [
		          {
		            "name": "Peter Lax",
		            "parent": "Kurt Friedrichs", 
						    "value": 10,
						    "type": "black",
						    "level": "red",
		            "_children": [
				          {
				            "name": "Alexandre Chorin",
				            "parent": "Peter Lax"
				          }, 
				          {
				            "name": "C. David Levermore",
				            "parent": "Peter Lax", 
								    "value": 10,
								    "type": "black",
								    "level": "red",
			            	"_children": [
						          {
						            "name": "Shi Jin",
						            "parent": "C. David Levermore", 
										    "value": 10,
										    "type": "black",
										    "level": "red",
						            "_children": [
						            	{
						            		"name": "Jingwei Hu", 
						            		"parent": "Shi Jin",
												    "value": 10,
												    "type": "black",
												    "level": "red",
						            		"_children": [
							            		{
							            			"name": "Me", 
							            			"parent": "Jingwei Hu",
														    "value": 10,
														    "type": "black",
														    "level": "red"
							            		}
						            		]
						            	}
						            ]
						          }, 
						        ]
			          	}
			          ]
		          }
		        ]
		      }
		    ]
      }
    ]
  }
];


// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 0, bottom: 0, left: -100},
	width = 800 - margin.right - margin.left,
	height = 1000 - margin.top - margin.bottom;
	
var i = 0, duration = 500;

var tree = d3.layout.tree()
	.size([width, height]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#acad-tree").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = width / 2;
root.y0 = 0;
  
update(root);
function autoOpen(head, time) {
  window.setTimeout(function() {
    show(head); //do node click
    if (head.children) {
      //if has children
      var timeOut = 1000; //set the timout variable
      head.children.forEach(function(child){
        autoOpen(child, timeOut);//open the child
        timeOut = timeOut + 1000;
      })
    }
  }, time);
}
function autoClose(head) {
  if (head.children) {
    head.children.forEach(function(child){
      autoClose(child); //close the child
    })
  }
  click(head);
}

d3.select(self.frameElement).style("width", "50px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
	  .on("click", click);

	nodeEnter.append("circle")
   .attr("r", function(d) { return d.value; })
   .style("stroke", function(d) { return d.type; })
   .style("fill", function(d) { return d.level; })
   .attr("x", function(d) { 
    return d.children || d._children ? 
    (d.value + 4) * -1 : d.value + 4 });

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? 13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", "start")
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .style("stroke", function(d) { return d.target.level; })
	  .attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

// Show children
function show(d) {
  if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

// Hide children
function hide(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
  //update(d);
}
