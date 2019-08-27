function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
    d3.json(url).then(function(response) {
      console.log(response);
    
    
    // Use d3 to select the panel with id of `#sample-metadata`
      var meta = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
      meta.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(response).forEach(([key, value])=>{
        console.log(`${key}: ${value}`);
        meta.append("p").text(`${key}: ${value}`);
  
      });
    });
    };
    // BONUS: Build the Gauge Chart
function buildGauge(sample) {
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    console.log("hello");
  var gauge = [{
    type: "indicator",
    mode: "gauge+number",
    domain: {x:[0,1], y:[0,1]},
    value: response.WFREQ,
    title: {text:"Wash Frequency"},
    
  }];

  var layout = {
    width: 500,
    height: 500
  };

  Plotly.newPlot("gauge", gauge, layout);
});
};



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url2 = `samples/${sample}`;
    d3.json(url2).then(function(response){
      console.log(response);
    // @TODO: Build a Bubble Chart using the sample data
      var data = [{
        x: response.otu_ids,
        y: response.sample_values,
        mode: "markers",
        type: "scatter",
        text: response.otu_labels,
        marker:{
          size: response.sample_values,
          color: response.otu_ids
        }
      }]
      var layout = {
        xaxis: {title:"OTU ID"},
      };
      Plotly.newPlot("bubble", data, layout);
    // @TODO: Build a Pie Chart
    //var sortedlabels = response.otu_labels.sort((first, second)=>second - first);
    // var arrayResponse = [response];
    // console.log(arrayResponse);
    // var sortedValues = arrayResponse.sort((first, second)=>second.sample_values - first.sample_values);
    // console.log(sortedValues);     
    
    var piedata=[{
          labels: response.otu_ids.slice(0,10),
          values: response.sample_values.slice(0,10),
          type:'pie'
        }];
        Plotly.newPlot("pie", piedata);
        
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  
  buildGauge(newSample);
}

// Initialize the dashboard
init();
