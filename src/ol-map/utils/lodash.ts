class _ {
    static isEqual = (...objects: any) => objects.every((obj: any) => JSON.stringify(obj) === JSON.stringify(objects[0]));

    static getMaxValue = (data, key) => {
        const max = data.reduce((maxValue, currentItem) => {
            if (currentItem[key] > maxValue) {
                return currentItem[key];
            }
            return maxValue;
        }, -Infinity);
        return max;
    }
    static groupBy = (arr, key) => {
        return arr.reduce((result, currentItem) => {
            const keyValue = currentItem[key];

            if (!result[keyValue]) {
                result[keyValue] = [];
            }

            result[keyValue].push(currentItem);

            return result;
        }, {});
    }
    static randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)

    static linearInterpolation = (x: number, p1: [number, number], p2: [number, number]): number => {
        const m = (p2[1] - p1[1]) / (p2[0] - p1[0])
        const c = p1[1] - m * p1[0]
        return m * x + c
    }


    static hex2rgba = (hex: string) => {
        if (/^#([A-Fa-f0-9]*){1,2}$/.test(hex)) {
            let c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2], 'f', 'f'];
            } else if (c.length == 4) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2], c[3], c[3]];
            } else if (c.length == 6) {
                c = [...c, 'f', 'f']
            }
            return {
                r: parseInt(c[0] + c[1], 16),  //(st >> 32) & 255,
                g: parseInt(c[2] + c[3], 16), //(st >> 16) & 255,
                b: parseInt(c[4] + c[5], 16), //(st >> 8) & 255,
                a: parseInt(c[6] + c[7], 16)  // st & 255
            }
        }

        return null
    }
}

export default _
