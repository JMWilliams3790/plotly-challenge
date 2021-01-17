var names = [];
var metadata = [];
var samples = [];

function readData(read) {
  d3.json("../data/samples.json").then((data) => {
    data.names.forEach((information) => {
      names.push(information);
    });
    data.metadata.forEach((information) => {
      metadata.push(information);
    });
    data.samples.forEach((information) => {
      samples.push(information);
    });
  })
  
  .then(read);
};



//draw first Bar Chart
function drawChart(){
  // console.log(names)
  // console.log(metadata)
  console.log(samples)
  var trace1 = {
    x: samples[0].sample_values.slice(0, 10).reverse(),
    y: samples[0].otu_ids.slice(0, 10).reverse().map(function (d){
      return "OTU " + d;
    }),
    type: "bar",
    orientation: "h",
    text: samples[0].otu_labels.slice(0, 10).reverse()
  };

  console.log(trace1);
  // Create the data array for the plot
  var barData = [trace1];

  // Define the plot layout
  var layout = {
    title: "Belly Button Biodiversity Bar Chart"
  };

  // Plot the chart to a div tag with id "plot"
  Plotly.newPlot("bar", barData, layout);


  var trace2 = {
    x: samples[0].sample_values,
    y: samples[0].otu_ids,
    mode: "markers",
    marker: {
      size: samples[0].sample_values
    },
  }
  var bubbleData = [trace2];

  var bubbleLayout = {
    title: "Belly Button Bideiversity Bubble Chart",
    showlegend: false,
  };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

//draw first bubble




//Populate page based on initial state
function drawData(){
  
  createDrop(names);
  //Update data with first index in names
  updateMetadata(names[0]);
  //start bar chart initial display
  drawChart(names);
  //start bubble chart initial display
}



readData(drawData);

function createDrop(values){
  d3.select("#selDataset")
      .selectAll("option") // select elements
      .data(values) // bind data, telling D3 there are 5 elements
      .enter() // use enter to create placeholders
      .append("option") // append new elements to the placeholders
      .text(function(d) { //update the elements
        return d;
      })
      .attr("value", function(d) { //update the elements
        return d;
      });
}
//draw page after changing option in dropdown
function optionChanged(value){
 
  //Update metadata with selected value
  updateMetadata(value);
  //restyle bar chart
  updateBarChart(value);
  //restyle bubble chart
}

function updateMetadata(value){
  //get demographic element from HTML
  //filter desired value from metadata
  //update html element with new demo
  var demographic = metadata.filter((demo) => demo.id === parseInt(value));
 
  //Grabbed element
  var demoPrint = d3.select("#sample-metadata");
  //Cleared html INSIDE element
  demoPrint.html("");
  Object.entries(demographic[0]).forEach(([key, value]) => demoPrint.append("text").text(`${key}:${value}`).append("p"));
}

//plotly.restyle. restyled must be in bracket: [variable]. > html element, attribute, values
function updateBarChart(value){
  var sample = samples.filter((d) => d.id === value)[0];

  var X = sample.sample_values.slice(0, 10).reverse();

  Plotly.restyle("bar", "x", [X]);
  
  var Y = sample.otu_ids.slice(0, 10).reverse().map(function(d){
    return "OTU " + d;
  });

  Plotly.restyle("bar", "y", [Y]);

  var text = sample.otu_labels.slice(0, 10).reverse();

  Plotly.restyle("bar", "text", [text]);
};
//restyle. there will be 5