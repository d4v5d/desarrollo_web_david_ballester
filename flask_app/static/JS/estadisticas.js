const API_URL = '/api/estadisticas';

// --- Funciones de Dibujo de Gráficos (Usando Chart.js) ---

function drawLineaChart(data) {
    const ctx = document.getElementById('chart-linea').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.dia),
            datasets: [{
                label: 'Avisos agregados por día',
                data: data.map(item => item.count),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Avisos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Día'
                    }
                }
            }
        }
    });
}

function drawTortaChart(data) {
    const ctx = document.getElementById('chart-torta').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)), // Capitalizar (Gato, Perro)
            datasets: [{
                data: data.map(item => item.total),
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total de Mascotas por Tipo'
                }
            }
        }
    });
}

function drawBarrasChart(data) {
    const ctx = document.getElementById('chart-barras').getContext('2d');
    
    // Preparar los datos para Chart.js
    const labels = data.map(item => item.month_label);
    const perros = data.map(item => item.perros);
    const gatos = data.map(item => item.gatos);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Perros',
                    data: perros,
                    backgroundColor: 'rgba(255, 159, 64, 0.8)',
                },
                {
                    label: 'Gatos',
                    data: gatos,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: false, // Barras lado a lado
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Avisos'
                    }
                }
            }
        }
    });
}


// --- Lógica Principal de Carga de Datos ---

async function loadStatsAndDrawCharts() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Llamar a las funciones de dibujo con los datos obtenidos
        drawLineaChart(data.by_day); 
        drawTortaChart(data.by_type);
        drawBarrasChart(data.by_month_and_type);
        
    } catch (error) {
        console.error("Error al cargar las estadísticas:", error);
        // Opcional: Mostrar un mensaje de error en el DOM
    }
}

loadStatsAndDrawCharts();