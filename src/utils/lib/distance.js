function ComputeDistance(route) {
    let total = 0;
    route.legs.forEach((leg) => {
        total += leg.distance.value;
    });
    total = (total / 1000) / 1.609;
    distance = total;
    return total.toString().substring(0, 4);
};
export default ComputeDistance;