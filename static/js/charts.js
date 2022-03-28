function init() {
  console.log("working");
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let storedSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSamples = storedSamples.filter(sampleObj => sampleObj.id==sample);
    //  5. Create a variable that holds the first sample in the array.
    let beginningSample = filteredSamples[0];
    console.log(beginningSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = beginningSample.otu_ids;
    console.log(otu_ids)
    let otu_labels = beginningSample.otu_labels;
    console.log(otu_labels)
    let sample_values = beginningSample.sample_values;
    console.log(sample_values)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(function(id) {
      return `OTU ${id}`;
    }).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text:otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {color: "black", size: 20},
      },
      height: 450,
      width: 487,
      margin: {
        "pad": 0,
        "t": 40, 
        "r": 50, 
        "l":65, 
        "b":30
      },
      plot_bgcolor:"darkblue",
      paper_bgcolor:"#6A7CCA"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // Deliverable 2: Bubble Chart //

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Bluered",
          type: 'heatmap'
        }   
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: {
          text: "Bacteria Cultures Per Sample",
          font: {color: "black", size: 20}
        },
        height: 500,
        width: 1300,
        margin: {
          "pad": 0,
          "t": 0, 
          "r": 50, 
          "l":50, 
          "b":0
        },
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        margin: {t: 70},
        plot_bgcolor:"black",
        paper_bgcolor:"#FFF3"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: Gauge Chart //
    // Create a variable that holds the samples array. 
    // Create a variable that filters the samples for the 
    // object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaSample = filteredMeta[0];

    // 3. Create a variable that holds the washing frequency.
    washingFrequency = firstMetaSample.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      title: {
        text:"Belly Button Washing Frequency",
        font: {color: "black", size: 20}
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10]},
        bar: {color: "green"},
        steps: [
          {range: [0,2], color: "rgb(255, 0, 0)"},
          {range: [2,4], color: "rgb(252, 100, 4)"},
          {range: [4,6], color: "rgb(140, 196, 60)"},
          {range: [6,8], color: "rgb(26, 188, 156)"},
          {range: [8,10], color: "rgb(100, 84, 172)"},
        ] 
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      height: 450,
      width: 550,
      margin: {
        "pad": 0,
        "t": 0, 
        "r": 50, 
        "l":50, 
        "b":0
      },
      paper_bgcolor: "lightblue",
      font: {color: "black"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}