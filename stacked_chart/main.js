const width = 1200;
const height = 700;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#07111f");

d3.csv("data/cleaned_data.csv").then(data => {

    data.forEach(d => {
    d["Sum(hospitalisations)"] = +d["Sum(hospitalisations)"];
});

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



});