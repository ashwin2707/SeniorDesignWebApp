// Graph
export function Graph() {
	this.createGraph()
}
Chart.defaults.font.size = 20
Chart.defaults.color = '#fff'

Graph.prototype.createGraph = function () {
	this.canvas = document.createElement('canvas')
	this.canvas.classList.add('graph')

	const data1Config = {
		label: 'Dataset 1',
		borderColor: 'rgba(0, 128, 128, 1)',
		backgroundColor: 'rgba(0, 128, 128, 0.2)',
		tension: 0.1,
		borderWidth: 2,
		fill: false,
		hidden: true,
	}
	const data2Config = {
		label: 'Dataset 2',
		borderColor: 'rgba(0, 204, 204, 1)',
		backgroundColor: 'rgba(0, 204, 204, 0.2)',
		tension: 0.1,
		borderWidth: 2,
		fill: false,
		hidden: true,
	}
	const data3Config = {
		label: 'Dataset 3',
		borderColor: 'rgba(123, 224, 173, 1)',
		backgroundColor: 'rgba(123, 224, 173 0.2)',
		tension: 0.1,
		borderWidth: 2,
		fill: false,
		hidden: true,
	}
	const config = {
		type: 'line',
		data: {
			datasets: [data1Config, data2Config, data3Config],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'Voltage over Time',
				},
				legend: {
					display: false,
				},
			},

			scales: {
				x: {
					type: 'linear',
					position: 'bottom',
					title: {
						display: true,
						text: 'Relative Milliseconds (ms)',
					},
					border: {
						display: false,
					},
					grid: {
						color: 'rgba(48, 48, 48, 1)',
					},
				},
				y: {
					title: {
						display: true,
						text: 'Voltage (V)',
					},
					border: {
						display: false,
					},
					grid: {
						color: 'rgba(48, 48, 48, 1)',
					},
				},
			},
		},
	}
	const ctx = this.canvas.getContext('2d')
	this.chart = new Chart(ctx, config)
}

Graph.prototype.update = function (dataMap) {
	for (const [key, val] of Object.entries(dataMap)) {
		this.chart['data']['datasets'][key]['data'] = val
	}
	this.chart.update()
}

Graph.prototype.toggleChart = function (index) {
	const hidden = this.chart.data.datasets[index].hidden
	this.chart.data.datasets[index].hidden = !hidden
	this.chart.update()
}

Graph.prototype.showChart = function (index) {
	this.chart['data']['datasets'][index]['display'] = true
}
Graph.prototype.hideChart = function (index) {
	this.chart['data']['datasets'][index]['display'] = false
}
