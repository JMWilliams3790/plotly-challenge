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

  
  var trace1 = {
    x: samples[0].sample_values.slice(0, 10).reverse(),
    y: samples[0].otu_ids.slice(0, 10).reverse().map(function (d){
      return "OTU " + d;
    }),
    type: "bar",
    orientation: "h",
    text: samples[0].otu_labels.slice(0, 10).reverse()
  };

  
  // Create the data array for the plot
  var barData = [trace1];

  // Define the plot layout
  var layout = {
    title: "Belly Button Biodiversity Bar Chart"
  };

  // Plot the chart to a div tag with id "plot"
  Plotly.newPlot("bar", barData, layout);

  
  var trace2 = {
    x: samples[0].otu_ids,
    y: samples[0].sample_values,
    mode: "markers",
    marker: {
      size: samples[0].sample_values,
      colorscale: 'Blues',
      color: samples[0].otu_ids
    },
    text: samples[0].otu_labels
  }
  var bubbleData = [trace2];

  var bubbleLayout = {
    title: "Belly Button Bideiversity Bubble Chart",
    showlegend: false,
  };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  var data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: metadata[0].wfreq,
      title: { text: "Bellybutton Scrubs per Week", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 250], color: "cyan" },
          { range: [250, 400], color: "royalblue" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
        }
      }
    }
  ];
  
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot('gauge', data, layout);
}


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
  updateBubbleChart(value);
  //restyle guagaugege
  updateGauge(value);
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
function updateBubbleChart(value){
  var sample = samples.filter((d) => d.id === value)[0];

  var X = sample.sample_values;

  Plotly.restyle("bubble", "y", [X]);

  var Y = sample.otu_ids;

  Plotly.restyle("bubble", "x", [Y]);

  var text = sample.otu_labels;

  Plotly.restyle("bubble", "text", [text]);

  var size = sample.sample_values;

  Plotly.restyle("bubble", "marker.size", [size]);

  var color = sample.otu_ids;

  Plotly.restyle("bubble", "marker.color", [color]);
}

function updateGauge(value){
  var wfreq = metadata.filter((d) => d.id === +value)[0];
  var value = wfreq.wfreq;

  Plotly.restyle("gauge", "value", [value]);
}