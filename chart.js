async function drawHeatMap(){
    //1)Acces Data

    //Fetching data

    const {monthlyVariance: dataset , baseTemperature} = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");

    const colorData = ["#e2f4ff","#bbe1fa","#3282b8","#0f4c75","#651441","#942246","#d54153","#f45d51"]

    //Seeting accesors functions 

     
    const yAccessor = d => new Date(0,d.month -1,0)
    const xAccessor = d => d.year
    const colorMetricAccessor = d => Math.round( (baseTemperature + d.variance) * 100)/100
    const monthFormat = d3.timeFormat("%B");

    console.log(xAccessor(dataset[2500]))
    console.log(yAccessor(dataset[2500]))
    console.log(colorMetricAccessor(dataset[2500]))
    console.log(typeof dataset[2500].variance)

    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 1100,
        height: 500,
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
                        .domain([d3.min(dataset,xAccessor), d3.max(dataset,xAccessor) + 1]) 
                        .range([0,dimensions.boundedWidth])


    const colorScale = (d) => {
        const temperature = colorMetricAccessor(d);
        const domain = (d3.extent(dataset,colorMetricAccessor)[1]) - (d3.extent(dataset,colorMetricAccessor)[0]);
        const q1 = domain*.125 + 1.68;
        const q2 = domain*.25 + 1.68;
        const q3 = domain*.375 + 1.68;
        const q4 = domain*.5 + 1.68;
        const q5 = domain*.625 + 1.68;
        const q6 = domain*.75 + 1.68;
        const q7 = domain*.875 + 1.68;
        const q8 = domain*1 + 1.68;
 
        if(temperature <= q1) return "#e2f4ff" 
        if(temperature <= q2) return "#bbe1fa"
        if(temperature <= q3) return "#3282b8" 
        if(temperature <= q4) return "#0f4c75" 
        if(temperature <= q5) return "#651441" 
        if(temperature <= q6) return "#942246" 
        if(temperature <= q7) return "#d54153" 
        if(temperature <= q8) return "#f45d51" 
    }
                          

    

    console.log(colorScale(dataset[3000]))
    console.log(colorScale(0))
    console.log(((d3.extent(dataset,colorMetricAccessor)[1]) - (d3.extent(dataset,colorMetricAccessor)[0])+1.68))

     //5) Draw Data

    //selecting tooltip 
//
    const tooltip = d3.select('#tooltip');
//
    //setting transition 

    const updateTransition = d3.transition().duration(2000);


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
                            .attr('fill', "#fff")
                            .attr("height",cellHeight)
                            .attr("width",cellWidth)
                            .attr("x", 0)
                            .attr("y",d => yScale(yAccessor(d)))
                            //.attr("data-xvalue",d => xAccessor(d) )
                            //.attr("data-yvalue",d => yAccessor(d) )
                            //.attr("fill", "#3c1d3a")
    //adding transition to cells

    cells.transition(updateTransition)
        .attr('x',d => xScale(xAccessor(d)))
        .attr("fill",d => colorScale(d))

    //6)Draw Peripherals
    //Setting axis 
    const xAxisGenerator = d3.axisBottom()
                                .scale(xScale)
                                .tickFormat(d3.format("d"))

    const yAxisGenerator = d3.axisLeft()
                                .scale(yScale)
                                .tickFormat(monthFormat)
    //Adding X axis 
    const xAxis = bounds.append("g")
                        .attr("id","x-axis")
                        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
                        .call(xAxisGenerator)

    const xAxisLabel = xAxis.append("text")
                            .attr("x", dimensions.boundedWidth/2)
                            .attr("y", dimensions.margin.bottom - 20)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .style("font-style", "italic")
                            .html("Year");

    //Adding Y axis 
    const yAxis = bounds.append("g")
                        .attr("id","y-axis")
                        .call(yAxisGenerator)


    const yAxisLabel = yAxis.append("text")
                            .attr("x", -dimensions.boundedHeight / 2)
                            .attr("y", -dimensions.margin.left + 20)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .text("Months")
                            .style("font-style", "italic")
                            .style("transform", "rotate(-90deg)")
                            .style("text-anchor", "middle");

    yAxis.selectAll('.tick')
    .style("transform", (d,i) => `translateY(${i * cellHeight + cellHeight/2}px)`);

    //settup legend

    const legend = d3.select("#legend")
                            .append("svg")
                            .attr('width',dimensions.width *.5 )
                            .attr('height',dimensions.height *.1)
                            .style('display','block')



    const legendCells = legend.selectAll('rect')
                                .data(colorData)
                                .enter()
                                .append("rect")
                                .attr('fill' ,d => d)
                                .attr('width', 20)
                                .attr('height', 20)
                                .attr('x', (d,i) => i*20)
                                .attr('y', 0)
                                

    //7) Set up Interactions

    cells.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    function onMouseEnter(datum,index){
        const x = xScale(xAccessor(index)) + dimensions.margin.left;
        const y = yScale(yAccessor(index)) + dimensions.margin.top;
        
        //Updating tooltip styles
        tooltip.attr("data-year",index.year)
                .style('opacity',1)
                .style("transform",`translate(calc(-50% + ${x}px) , calc(-118% + ${y}px) )`)

        //Updating tooltip information
        tooltip.select("#data").text(`Year: ${index.year} - Month : ${monthFormat(index.month)}`);
        tooltip.select("#temperature").text(`Temperature: ${colorMetricAccessor(index)}`);
    }

    function onMouseLeave(datum,index){
        tooltip.style('opacity',0)
    }
}
drawHeatMap()