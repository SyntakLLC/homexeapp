const Pie = require("paths-js/pie");

const PieFactory = {
    create: (data, height, rad, fill) => {
        return data.map((ring, idx) => {
            const pieData = fill || [ring.value, 1 - ring.value];
            const r =
                ((height / 2 - rad) / data.length) * (data.length - idx - 1) +
                rad;
            return Pie({
                r,
                R: r,
                data: pieData,
                center: [0, 0],
                accessor(x) {
                    return x;
                },
            });
        });
    },
};

export default PieFactory;
