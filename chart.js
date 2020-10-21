async function drawHeatMap(){
    //1)Acces Data

    //Fetching data

    const {monthlyVariance: dataset} = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");

    console.log(dataset[0])

    //Seeting accesors functions 

     
    const yAccessor = d => d.month
    const xAccessor = d => d.year
    const colorMetricAccessor = d => d.variance

    console.log(xAccessor(dataset[0]))
    console.log(yAccessor(dataset[0]))
    console.log(colorMetricAccessor(dataset[0]))
}
drawHeatMap()