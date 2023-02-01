class _ {
}
_.isEqual = (...objects) => objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
_.randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
_.linearInterpolation = (x, p1, p2) => {
    const m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    const c = p1[1] - m * p1[0];
    return m * x + c;
};
_.hex2rgba = (hex) => {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2], 'f', 'f'];
        }
        else if (c.length == 4) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2], c[3], c[3]];
        }
        else if (c.length == 6) {
            c = [...c, 'f', 'f'];
        }
        return {
            r: parseInt(c[0] + c[1], 16),
            g: parseInt(c[2] + c[3], 16),
            b: parseInt(c[4] + c[5], 16),
            a: parseInt(c[6] + c[7], 16) // st & 255
        };
    }
    return null;
};
export default _;
