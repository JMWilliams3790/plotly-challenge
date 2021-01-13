var names = [];
var metadata = [];
var samples = [];

function readData(read) {
  d3.json("data/samples.json").then((data) => {
    data.names.forEach((information) => {
      names.push(information);
    });
    data.metadata.forEach((information) => {
      metadata.push(information);
    });
    data.names.forEach((information) => {
      samples.push(information);
    });
  })
  .then(read);
};

  console.log(names);