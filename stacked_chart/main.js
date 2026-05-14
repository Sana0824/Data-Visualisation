    const width = 1200;
    const height = 700;

    const margin = {
        top: 50,
        right: 50,
        bottom: 80,
        left: 100
    };

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#ffffff");

        const chartGroup = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;


    d3.csv("data/cleaned_data.csv").then(data => {

        data.forEach(d => {
        d["Sum(hospitalisations)"] = +d["Sum(hospitalisations)"];
    });

    data = data.filter(d => d.age_group !== "Missing");
        console.log(data);
        
        const roadUsers = [...new Set(data.map(d => d.road_user))]; 

    console.log(roadUsers);

        const groupedData = d3.rollup(
        data,
        v => {

            return {
                "Driver": d3.sum(v.filter(d => d.road_user === "Car driver"), d => d["Sum(hospitalisations)"]),

                "Passenger": d3.sum(v.filter(d => d.road_user === "Car passenger"), d => d["Sum(hospitalisations)"]),

                "Motorcyclist": d3.sum(v.filter(d => d.road_user === "Motorcyclist"), d => d["Sum(hospitalisations)"]),

                "Pedal cyclist": d3.sum(v.filter(d => d.road_user === "Pedal cyclist"), d => d["Sum(hospitalisations)"]),

                "Pedestrian": d3.sum(v.filter(d => d.road_user === "Pedestrian"), d => d["Sum(hospitalisations)"]),

                "Driver/passenger": d3.sum(v.filter(d =>
                    d.road_user === "Heavy transport driver" ||
                    d.road_user === "Heavy transport passenger"
                ), d => d["Sum(hospitalisations)"]),

                "Other/unknown": d3.sum(v.filter(d =>
                    d.road_user === "Other or unknown"
                ), d => d["Sum(hospitalisations)"])
            };

        },
        d => d.age_group
    );

        console.log(groupedData);
    const stackedData = Array.from(groupedData, ([age_group, values]) => ({
        age_group,
        ...values
    }));

    console.log(stackedData);
    const keys = [
        "Driver",
        "Passenger",
        "Motorcyclist",
        "Pedal cyclist",
        "Pedestrian",
        "Driver/passenger",
        "Other/unknown"
    ];

    const stack = d3.stack()
        .keys(keys);

    const series = stack(stackedData);

    console.log(series);

    const xScale = d3.scaleBand()
        .domain([
            "0-7",
            "8-16",
            "17-25",
            "26-39",
            "40-64",
            "65-74",
            "75+"
        ])
        .range([0, innerWidth])
        .padding(0.2);

        

    console.log(xScale.domain());

    const yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(stackedData, d =>
                d.Driver +
                d.Passenger +
                d.Motorcyclist +
                d["Pedal cyclist"] +
                d.Pedestrian +
                d["Driver/passenger"] +
                d["Other/unknown"]
            )
        ])
        .range([innerHeight, 0]);

    console.log(yScale.domain());

    chartGroup.append("g")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(d3.axisBottom(xScale));

    chartGroup.append("g")
        .call(d3.axisLeft(yScale));

        const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range([
            "#1f77b4",
            "#2ca02c",
            "#ff7f0e",
            "#bcbd22",
            "#d62728",
            "#9467bd",
            "#7f7f7f"
        ]);

    chartGroup.selectAll(".series")
        .data(series)
        .join("g")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d.data.age_group))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth());


    const legendData = [
        { label: "Driver", color: "#1f77b4" },
        { label: "Passenger", color: "#2ca02c" },
        { label: "Motorcyclist", color: "#ff7f0e" },
        { label: "Pedal cyclist", color: "#bcbd22" },
        { label: "Pedestrian", color: "#d62728" },
        { label: "Driver/passenger", color: "#9467bd" },
        { label: "Other/unknown", color: "#7f7f7f" }
    ];

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 220}, 40)`);

    legendData.forEach((d, i) => {

        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 25)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d.color);

        legend.append("text")
            .attr("x", 28)
            .attr("y", i * 25 + 14)
            .text(d.label);

    });

    });

