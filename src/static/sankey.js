import * as Plotly from 'plotly.js-dist';

export function drawSankey(containerId, data) {
    const layout = {
        title: 'Sankey Diagram',
        font: {
            size: 10
        },
        height: 600,
        width: 1000
    };

    Plotly.newPlot(containerId, [data], layout);
}
