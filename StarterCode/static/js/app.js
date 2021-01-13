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
//Populate page based on initial state
function drawData(){
  console.log(names);
  createDrop(names);
  //Update data with first index in names
  updateMetadata(names[0]);
  //start bar chart initial display
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
  console.log(value);
  //Update metadata with selected value
  updateMetadata(value);
  //restyle bar chart
  //restyle bubble chart
}

function updateMetadata(value){
  //get demographic element from HTML
  //filter desired value from metadata
  //update html element with new demo
  var demographic = metadata.filter((demo) => demo.id === parseInt(value));
  console.log(demographic[0]);
  //Grabbed element
  var demoPrint = d3.select("#sample-metadata");
  //Cleared html INSIDE element
  demoPrint.html("");
  Object.entries(demographic[0]).forEach(([key, value]) => demoPrint.append("text").text(`${key}:${value}`).append("p"));
}

//plotly.restyle. restyled must be in bracket: [variable]. > html element, attribute, values