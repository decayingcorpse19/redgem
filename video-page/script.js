console.log("Script loaded");

// Stock Chart
const ctx = document.getElementById('stockChart').getContext('2d');
if (!ctx) {
    console.error("Stock chart canvas not found");
} else {
    const stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Value ($)',
                data: [1.5, 1.8, 2.0, 2.3, 2.45],
                borderColor: '#80a0a0',
                backgroundColor: 'rgba(128, 160, 160, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                y: { display: false },
                x: { display: false }
            },
            plugins: {
                legend: { display: false }
            },
            maintainAspectRatio: false
        }
    });

    // Invest Button Interaction
    document.querySelector('.invest-btn').addEventListener('click', () => {
        alert("Investing 50 points in Sample Video!");
    });
}