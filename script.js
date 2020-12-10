
var svg = d3.select(".plot").append('svg')
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;
svg.attr("viewBox", [0,0,width,height])//the area of where the network fits|min-x,min-y,width,height

console.log(width)
console.log(height)
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
    .force("charge", d3.forceManyBody().strength(-10))
    .force("center", d3.forceCenter(width/2-10,height/2+80))
    .force("collision",d3.forceCollide().radius(5))//prevent overlap
    // .force("forceX",d3.forceX())
    // .force("forceY",d3.forceY())
   // .force("gravity", d3.forceCollide().radius(10))
    // .force("x", d3.forceX(width / 2))
    // .force("y", d3.forceY(height / 2))
    .on("tick", tick);
  
  // var tooltip= d3.select('#child_div_2')
  //   .append('div')
  //   .attr('id', 'tooltip')
  //   .style("opacity", 0);
  
//Freeze navigation menu
window.onscroll = function() {myFunction()};

var navigation = document.getElementById("myHeader");
var sticky = navigation.offsetTop;
//console.log("sticky:" + sticky);

function myFunction() {
  if (window.pageYOffset > sticky) {
    navigation.classList.add("sticky");
  } else {
    navigation.classList.remove("sticky");
  }
}

d3.json("./data/test.json", function (error,data) {
    if (error) throw error;
    
    data1 = getData("Aug1_15",data);
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
    console.log("btns' length:" + btns_1.length);
    
    for (var i = 0; i < btns_1.length; i++) {
      btns_1[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      });
    }

    // // Add event to each button
    // d3.select('#btn_aug1_15').on('click', function(){
    //   d3.event.preventDefault();
    //   update(data1);
    //   console.log('Aug1–15');
    // });
    // d3.select('#btn_aug16_31').on('click', function(){
    //   data2 = getData("Aug16_31",data);
    //   update(data2);
    //   console.log('Aug16–31');
    // });
    // d3.select('#btn_sep1_15').on('click', function(){
    //   d3.event.preventDefault();
    //   data3 = getData("Sep1_15",data);
    //   update(data3);
    //   console.log('Sep1–15');
    // });
    // d3.select('#btn_sep16_30').on('click', function(){
    //   data4 = getData("Sep16_30",data);
    //   update(data4);
    //   console.log('Sep16–30');
    // });
    // d3.select('#btn_oct1_15').on('click', function(){
    //   d3.event.preventDefault();
    //   data5 = getData("Oct1_15",data);
    //   update(data5);
    //   console.log('Oct1–15');
    // });
    // d3.select('#btn_oct16_31').on('click', function(){
    //   data6 = getData("Oct16_31",data);
    //   update(data6);
    //   console.log('Oct16–31');
    // });
    // d3.select('#btn_nov1_15').on('click', function(){
    //   d3.event.preventDefault();
    //   data7 = getData("Nov1_15",data);
    //   update(data7);
    //   console.log('Nov1–15');
    // });
    // d3.select('#btn_nov16_30').on('click', function(){
    //   data8 = getData("Nov16_30",data);
    //   update(data8);
    //   console.log('Nov16–30');
    // });
    // d3.select("#iframe").remove();
    update(data1);

    d3.select('#button_network').on('click', function(){
      //clear the bar graph
      // d3.select("#iframe").remove();
      myFunction();

      update(data1);
      console.log('network');
      
    });

    var x = document.getElementById("bar");
    x.style.display = "none";
    
    d3.select('#button_summary').on('click', function(){
      myFunction();
      //clear the network
      d3.select(".links").remove();
      d3.select(".nodes").remove();
      // barGraph();
      console.log('summary');
    });

		function myFunction() {
			if (x.style.display === "none") {
				x.style.display = "block";
			} else {
				x.style.display = "none";
			}
		}
})

function getData(key,data){
  for(var i=0;i<data.length;i++){
    if(data[i].date == key){
      return data[i]
    }
  }
}

function update(graph){

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
    .attr("stroke-width", function(d){
      // return Math.sqrt(d.value);
      return d.value;
    })

  linkElements.exit().remove();

  // nodes + labels
  var nodeElements = svg.select(".nodes")
    .selectAll(".node")
    .data(graph.nodes, function(d) { return d.id })
        
  var enterSelection = nodeElements.enter()
    .append("g")
    .attr("class", "node");

  var circles = enterSelection.append("circle")
    .attr('r',function(d){
      if(d.keyword){return 2}
      else{return 0}
    })
    .attr("fill",'white')
    .attr('stroke','black')

  var labels = enterSelection.append("text")
    .text(d=>{return d.keyword})
    .attr('x', 6)
    .attr('y', 3)
    .attr("class", "title")
    .style('font-weight', 'bold')
    .style('font-size', function (d) {
      return d.degree * 5;
    })
    .style('fill', d=>{
      if(d.degree >= 5){return "#CD4D2A"}
      else{return 'white'}
    });
    // .style('stroke',"white")
    // .style('stroke-width','0.5px');

  var images = enterSelection.append('image')
    .attr("xlink:href", function (d) {
      if(d.img){return d.img;}
    })
    .attr("x", function (d) {
      return -5;
    })
    .attr("y", function (d) {
      return -5;
    })
    .attr("class", "zoom")
    .style('opacity',0.85);
  
  images
    .on('mouseenter', function(d) {
      d3.select(this).style('opacity',1);
      d3.select(this.parentNode).raise();
      
      // tooltip
      //   .transition()
      //   .duration(200)
      //   .style('opacity', 1)
      // tooltip.html("'" + d.title + "'")	 
    })
    .on('mouseout', function(){
          d3.select('#tooltip').style('opacity', 0)
          // .on('mousemove', function() {
          //   d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
          // })
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
        return "translate("+d.x+","+d.y+")";
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    linkElements
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
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

function barGraph(){
 
  //create two g elements for the network
  var bars = svg.append("g").attr("class", "bars")

  var title = bars.append('text')
    .text('Top 20 food that people are eating during lockdown')
    .attr('class', 'bar_title')
    .attr('x', 400)
    .attr('y',15)
    .style('fill','white')

  // const parsedData = d3.csvParse('./data/cumulated_food.csv')
  
  
  // d3.text('./data/cumulated_food.csv', function(error, raw){
  //   var dsv = d3.dsvFormat(';')
  //   var data = dsv.parse(raw)
  //   console.log("parsed:" + data);
  // })

  d3.csv("https://raw.githubusercontent.com/huayuan0205/covidcookery/master/data/cumulated_food.csv", function(data){

    data.forEach(d => {
      d.date,
      d.name,
      d.value = +d.value
    });

   console.log(data);
   //{date: "2020-08-01", name: "poppyseed", value: 0}

  names = new Set(data.map(d => d.name));

  datevalues = d3.nest()
    .key(d=>{return d.date})
    .entries(data)
  console.log(datevalues);
  // datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
  //   .map(([date, data]) => [new Date(date), data])
  //   .sort(([a], [b]) => d3.ascending(a, b))
  

     // set bar padding
     var tickDuration = 500;
       
     var top_n = 12;
     var height = 600;
     var width = 960;
       
     const margin = {
       top: 80,
       right: 0,
       bottom: 5,
       left: 0
     };
   
     let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
  });

   

  
  
  // domain scale
  // let x = d3.scaleLinear()
  //   .domain([0, d3.max(yearSlice, d => d.value)])
  //   .range([margin.left, width-margin.right-65]);

  // let y = d3.scaleLinear()
  //   .domain([top_n, 0])
  //   .range([height-margin.bottom, margin.top]);

  // let xAxis = d3.axisTop()
  //   .scale(x)
  //   .ticks(width > 500 ? 5:2)
  //   .tickSize(-(height-margin.top-margin.bottom))
  //   .tickFormat(d => d3.format(',')(d));
    
}

function parseData(d){
  return{
    date:d.date,
    food_name:d.food_name,
    value:d.value
  }
}

      