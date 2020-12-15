var svg = d3.select(".plot").append('svg')
    .classed("svg-container", true)
    .attr("preserveAspectRatio", "xMinYMin meet")//keep proportion
    .attr("viewBox", "50 0 1280 1000")
    .classed("svg-content-responsive", true);
    
width = +svg.node().getBoundingClientRect().width,
height = +svg.node().getBoundingClientRect().height;
console.log(width)
console.log(height)
// svg.attr("viewBox", [0, 0, width, height]) 
//the area of where the network fits|min-x,min-y,width,height


// var svg = d3.select("#network")
//     .append("div")
//     // Container class to make it responsive.
//     .classed("svg-container", true)
//     .append("svg")
// Responsive SVG needs these 2 attributes and no width and height attr.
// .attr("preserveAspectRatio", "xMinYMin meet")
// .attr("viewBox", "0 0 1080 640")//the area of where the network fits
// .classed("svg-content-responsive", true)  // Class to make it responsive

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) {
    return d.id;
  }))
  .force("charge", d3.forceManyBody().strength(-8))
  .force("center", d3.forceCenter(width / 2+100 , height / 2 - 150))
  .force("collision", d3.forceCollide().radius(5)) //prevent overlap
  // .force("forceX",d3.forceX())
  // .force("forceY",d3.forceY())
  // .force("gravity", d3.forceCollide().radius(10))
  // .force("x", d3.forceX(width / 2))
  // .force("y", d3.forceY(height / 2))
  .on("tick", tick);

var tooltip= d3.select('#tooltip')
  .style("opacity", 0);
var up_votes = d3.select('#like')
  .style("opacity", 0);
var icon = d3.select('.fas')
  .style("opacity", 0);

//Freeze navigation menu
window.onscroll = function () {
  myFunction()
};

// var navigation = document.getElementById("myHeader");
// var sticky = navigation.offsetTop;
//console.log("sticky:" + sticky);

// function myFunction() {
//   if (window.pageYOffset > sticky) {
//     navigation.classList.add("sticky");
//   } else {
//     navigation.classList.remove("sticky");
//   }
// }

d3.json("./data/network_aug_nov.json", function (error, data) {
  if (error) throw error;

  data1 = getData("Aug1_15", data);
  // console.log("data1: ");
  // console.log(data1);

  // Add active class to the current button (highlight it)
  // var container = document.getElementById('child_div_1');
  // var btns = container.getElementsByClassName("btn");
  // console.log("btns' length:" + btns.length);

  // for (var i = 0; i < btns.length; i++) {
  //   btns[i].addEventListener("click", function() {
  //   var current = document.getElementsByClassName("active");
  //   current[0].className = current[0].className.replace(" active", "");
  //   this.className += " active";
  //   });
  // }

  //Add active class to the current button (highlight it)
  var container_1 = document.getElementById('myHeader');
  var btns_1 = container_1.getElementsByClassName("btn");
  //console.log("btns' length:" + btns_1.length);

  for (var i = 0; i < btns_1.length; i++) {
    btns_1[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace("active", "");
      this.className += " active";
    });
  }

 // pre-setting for dropdown and buttons
  var x = document.getElementById("bar");
  x.style.display = "none";
  var y = document.getElementById("dropdown");
  y.style.display = "block";
  
  var eID = document.getElementById("networks");
  

  // initial view
  update(data1);
  // Add event to each dropdown option
  eID.onchange = function(){changeNetwork(data);}

  // click navigation menu
  d3.select('#button_network').on('click', function () {
    //clear the bar graph
    myFunction();
    update(data1);
    console.log('btn_network');
  });

  d3.select('#button_summary').on('click', function () {
    //clear the network
    d3.select(".links").remove();
    d3.select(".nodes").remove();
    // display bar graph
    myFunction();
    console.log('btn_summary');
  });

  function changeNetwork(data) {
    var netVal = eID.options[eID.selectedIndex].value;
    console.log(netVal);

    var picked_data = getData(netVal,data);
    update(picked_data);
    console.log(picked_data);
  }

  function myFunction() {
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }
})

function getData(key, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].date == key) {
      return data[i]
    }
  }
}

function update(graph) {

  //create two g elements for the network
  svg.append("g").attr("class", "links");
  svg.append("g").attr("class", "nodes");

  // links
  var linkElements = svg.select(".links")
    .selectAll(".link")
    .data(graph.links);

  linkElements.enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke-width", function (d) {
      // return Math.sqrt(d.value);
      return d.value;
    })

  linkElements.exit().remove();

  // nodes + labels
  var nodeElements = svg.select(".nodes")
    .selectAll(".node")
    .data(graph.nodes, function (d) {
      return d.id
    })

  var enterSelection = nodeElements.enter()
    .append("g")
    .attr("class", "node");

  var circles = enterSelection.append("circle")
    .attr('r', function (d) {
      if (d.keyword) {
        return 2
      } else {
        return 0
      }
    })
    .attr("fill", 'white')
    .attr('stroke', 'black')

  var labels = enterSelection.append("text")
    .text(d => {
      return d.keyword
    })
    .attr('x', 6)
    .attr('y', 3)
    .attr("class", "title")
    .style('font-weight', 'bold')
    .style('font-size', function (d) {
      return d.degree * 5;
    })
    .style('fill', d => {
      if (d.degree >= 5) {
        return "#CD4D2A"
      } else {
        return 'white'
      }
    });
  // .style('stroke',"white")
  // .style('stroke-width','0.5px');

  var images = enterSelection.append('image')
    .attr("xlink:href", function (d) {
      if (d.img) {
        return d.img;
      }
    })
    .attr("x", function (d) {
      return -5;
    })
    .attr("y", function (d) {
      return -5;
    })
    .attr("class", "zoom")
    .style('opacity', 0.85);

  images
    .on('mouseenter', function (d) {
      d3.select(this).style('opacity', 1);
      d3.select(this).style('cursor', 'pointer');
      d3.select(this.parentNode).raise();
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 1)
      tooltip.html("'" + d.title + "'")	 
      icon
        .transition()
        .duration(200)
        .style('opacity', 1)
      up_votes
        .transition()
        .duration(200)
        .style('opacity', 1);
      up_votes.html(d.vote);
    })
    .on('mouseout', function () {
      tooltip.style('opacity', 0);
      up_votes.style('opacity', 0);
      icon.style("opacity", 0);
      // .on('mousemove', function() {
      //   d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
      // })
    })
    .on('click', function(d){
      window.open(d.comment, 'post_link','_blank')
    })

  nodeElements.exit().remove();

  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);
  simulation.alphaTarget(0.1).restart();

}

function tick() {
  var nodeElements = svg.select(".nodes").selectAll(".node");
  var linkElements = svg.select(".links").selectAll(".link");

  var radius = 6;
  nodeElements
    // .attr("transform", function(d) {
    //   return "translate(" + d.x + "," + d.y + ")";
    // })
    .attr("transform", function (d) {
      d.x = Math.max(radius, Math.min(width - radius, d.x));
      d.y = Math.max(radius, Math.min(height - radius, d.y));
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  linkElements
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.select(this).raise();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

