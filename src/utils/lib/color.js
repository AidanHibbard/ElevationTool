function Color(grade) {
    if (Math.round(grade) < 1) {
        return '#b2c4b9';
    } else if (Math.round(grade) < 3) {
        return '#12b5cb';
    } else if (Math.round(grade) < 6) {
        return '#34a853';
    } else if (Math.round(grade) < 9) {
        return '#ea4335';
    } else {
        return '#000000';
    }
};
export default Color;