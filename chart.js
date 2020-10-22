async function drawHeatMap(){
    //1)Acces Data

    //Fetching data

    const {monthlyVariance: dataset , baseTemperature} = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");

    console.log(dataset[2500])

    //Seeting accesors functions 

     
    const yAccessor = d => new Date(0,d.month -1,0)
    const xAccessor = d => d.year
    const colorMetricAccessor = d => Math.round( (baseTemperature + d.variance) * 100)/100

    console.log(xAccessor(dataset[2500]))
    console.log(yAccessor(dataset[2500]))
    console.log(colorMetricAccessor(dataset[2500]))
    console.log(typeof dataset[2500].variance)

    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 1200,
        height: 400,
        margin: {
            top: 30,
            right: 30,
            bottom: 60,
            left: 60,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left  - dimensions.margin.right ;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom ;

    //3) Draw Canvas 

    //adding main svg 

    const wrapper = d3.select("#wrapper")
                        .append('svg')
                        .attr('width',dimensions.width)
                        .attr('height',dimensions.height)

    //adding bound(framework or whiteboard)

    const bounds = wrapper.append('g')
                            .style('transform', `translate(${
                                dimensions.margin.left
                            }px, ${
                                dimensions.margin.top
                            }px)`);

    //4) Create Scales

    //Setting scales

    const yScale = d3.scaleTime()
                        .domain([new Date(0,0,0),new Date(0,12,0)])
                        .range([0,dimensions.boundedHeight])
                        
    

    const xScale = d3.scaleLinear()
                        .domain(d3.extent(dataset,xAccessor)) 
                        .range([0,dimensions.boundedWidth])


    const colorScale = (d) => {
        const temperature = colorMetricAccessor(d);
        const domain = (d3.extent(dataset,colorMetricAccessor)[1]) - (d3.extent(dataset,colorMetricAccessor)[0]);
        const q1 = domain*.25 + 1.68;
        const q2 = domain*.50 + 1.68;
        const q3 = domain*.75 + 1.68;
        const q4 = domain*1 + 1.68;

        if(temperature <= q1) return "SteelBlue"
        if(temperature <= q2) return "LightSteelBlue"
        if(temperature <= q3) return  "Orange"
        if(temperature <= q4) return  'Crimson'
    }
                          

    

    console.log(colorScale(dataset[3000]))
    console.log(colorScale(0))
    console.log((d3.extent(dataset,colorMetricAccessor)))

     //5) Draw Data

    //selecting tooltip 
//
    //const tooltip = d3.select('#tooltip');
//
    ////setting transition 
//
    //const updateTransition = d3.transition().duration(1000);
//
//
    ////drawing circles 
    const cellHeight = dimensions.boundedHeight/12
    const cellWidth = dimensions.boundedWidth/(xScale.domain()[1] - xScale.domain()[0]) 

    const cells  =  bounds.selectAll('rect')
                            .data(dataset)
                            .enter()
                            .append("rect")
                            .attr('class','cell')
                            .attr('data-month',d => d.month - 1)
                            .attr('data-year',d => xAccessor(d))
                            .attr('data-temp',d=> Math.round((8.66 + d.variance)*100)/100)
                            .attr('fill', d => colorScale(d))
                            .attr("height",cellHeight)
                            .attr("width",cellWidth)
                            .attr("x",d => xScale(xAccessor(d)))
                            .attr("y",d => yScale(yAccessor(d)))
                            //.attr("data-xvalue",d => xAccessor(d) )
                            //.attr("data-yvalue",d => yAccessor(d) )
                            //.attr("fill", "#3c1d3a")
    ////adding transition to dots
//
    //dots.transition(updateTransition)
    //    .attr('cy',(d)=>yScale(yAccessor(d)))
    //    .attr('r',5)
    //    .attr("fill", d => colorScale(colorAccessor(d)))
//
    // //6)Draw Peripherals
    ////Setting axis 
    
    const xAxisGenerator = d3.axisBottom()
                                .scale(xScale)
                                .tickFormat(d3.format("d"))

    const yAxisGenerator = d3.axisLeft()
                                .scale(yScale)
                                .tickFormat(d3.timeFormat("%B"))
    //Adding X axis 
    const xAxis = bounds.append("g")
                        .attr("id","x-axis")
                        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
                        .call(xAxisGenerator)

    //const xAxisLabel = xAxis.append("text")
    //                        .attr("x", dimensions.boundedWidth)
    //                        .attr("y", dimensions.margin.bottom - 10)
    //                        .attr("fill", "black")
    //                        .style("font-size", "1.4em")
    //                        .style("font-style", "italic")
    //                        .html("Year");

    //Adding Y axis 
    const yAxis = bounds.append("g")
                        .attr("id","y-axis")
                        .call(yAxisGenerator)

    //const yAxisLabel = yAxis.append("text")
    //                        .attr("x", -dimensions.boundedHeight / 2)
    //                        .attr("y", -dimensions.margin.left + 20)
    //                        .attr("fill", "black")
    //                        .style("font-size", "1.4em")
    //                        .text("Time in minutes")
    //                        .style("font-style", "italic")
    //                        .style("transform", "rotate(-90deg)")
    //                        .style("text-anchor", "middle");


}
drawHeatMap()