const { createCanvas } = require('canvas');
const { Chart, registerables } = require('chart.js');

// Register necessary Chart.js components
Chart.register(...registerables);

async function createPointsChart(pointsData) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pointsData.map((_, index) => `User ${index + 1}`),
            datasets: [{
                label: 'Points',
                data: pointsData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    return canvas.toBuffer();
}

module.exports = { createPointsChart };
