import { Datapoint } from './DataPoint.js'

export function DatasetManager(graphManager, data1, data2, data3) {
	this.graphManager = graphManager
	// Initialize datasets
	this.datasets = []
	this.datasetContainers = [
		document.querySelector('#data-container1'),
		document.querySelector('#data-container2'),
		document.querySelector('#data-container3'),
	]
	this.graphStatTexts = {
		mean: document.getElementById('mean-text'),
		median: document.getElementById('median-text'),
		range: document.getElementById('range-text'),
		standardDeviation: document.getElementById('standard-deviation-text'),
		p25: document.getElementById('25th-percentile-text'),
		p75: document.getElementById('75th-percentile-text'),
		kurtosis: document.getElementById('kurtosis-text'),
		variance: document.getElementById('variance-text'),
		rootMeanSquare: document.getElementById('root-mean-square-text'),
	}
	this.datasetTitle = document.querySelector('#dataset-title')

	this.sortedBy = {}
	this.createDataset(data1, this.datasets.length)
	this.createDataset(data2, this.datasets.length)
	this.createDataset(data3, this.datasets.length)
	this.currentDataset = 0
	this.showDataset(0)
	for (let i = 1; i < this.datasetContainers.length; i++) {
		this.hideDataset(i)
	}
	this.updateStats()

	this.minVoltage = Number.MIN_VALUE
	this.maxVoltage = Number.MAX_VALUE

	// Initialize onclicks
	document.querySelector('#prev-dataset-btn').addEventListener('click', () => this.switchDataset(-1))
	document.querySelector('#next-dataset-btn').addEventListener('click', () => this.switchDataset(1))
	document.querySelector('#enable-all-btn').addEventListener('click', () => this.disableDataset(this.currentDataset))
	document.querySelector('#min-voltage-input').addEventListener('input', (evt) => {
		evt.target.value = evt.target.value.replace(/[^0-9]/g, '')
		if (evt.target.value == '') {
			this.minVoltage = Number.MIN_VALUE
		} else {
			this.minVoltage = parseFloat(evt.target.value)
		}
		this.updateVoltageBounds()
	})
	document.querySelector('#max-voltage-input').addEventListener('input', (evt) => {
		evt.target.value = evt.target.value.replace(/[^0-9]/g, '')
		if (evt.target.value == '') {
			this.maxVoltage = Number.MAX_VALUE
		} else {
			this.maxVoltage = parseFloat(evt.target.value)
		}
		this.updateVoltageBounds()
	})
	this.sortBtn = document.querySelector('#sort-btn')
	this.sortBtn.addEventListener('click', () => {
		this.sort()
		if (this.sortedBy[this.currentDataset] == 'Time') {
			this.sortBtn.innerText = 'Sort by Voltage'
		} else {
			this.sortBtn.innerText = 'Sort by Time'
		}
	})

	document.querySelector('#export-btn').addEventListener('click', () => this.exportData())
	this.csvFileInput = document.querySelector('#csv-file-input')
	document.querySelector('#import-btn').addEventListener('click', () => this.csvFileInput.click())
	this.csvFileInput.addEventListener('change', (evt) => this.importData(evt.target.files[0]))
}

DatasetManager.prototype.createDataset = function (data, index) {
	const dataset = []
	const container = this.datasetContainers[index]
	data.forEach(({ time, voltage }) => {
		const datapoint = new Datapoint(time, voltage)
		datapoint.enableDiv.addEventListener('click', () => {
			this.toggleDatapoint(datapoint, index)
		})
		container.append(datapoint.div)
		dataset.push(datapoint)
	})
	this.datasets.push(dataset)
	this.sortedBy[index] = 'Time'
}

DatasetManager.prototype.showDataset = function (index) {
	this.datasetContainers[index].style.display = ''
}

DatasetManager.prototype.hideDataset = function (index) {
	this.datasetContainers[index].style.display = 'none'
}

DatasetManager.prototype.switchDataset = function (direction) {
	this.hideDataset(this.currentDataset)
	this.currentDataset =
		(((this.currentDataset + direction) % this.datasetContainers.length) + this.datasetContainers.length) %
		this.datasetContainers.length
	this.showDataset(this.currentDataset)
	this.datasetTitle.innerHTML = `Dataset ${this.currentDataset + 1}`
	if (this.sortedBy[this.currentDataset] == 'Time') {
		this.sortBtn.innerText = 'Sort by Voltage'
	} else {
		this.sortBtn.innerText = 'Sort by Time'
	}
	this.updateStats()
}

DatasetManager.prototype.toggleDatapoint = function (datapoint, datasetIndex) {
	if (datapoint.enabled) {
		this.graphManager.data[datasetIndex].remove({ x: datapoint.time, y: datapoint.voltage })
	} else {
		this.graphManager.data[datasetIndex].insert({ x: datapoint.time, y: datapoint.voltage })
	}
	this.graphManager.update(datasetIndex)
	datapoint.toggleEnabled()

	this.updateStats()
}

DatasetManager.prototype.updateStats = function () {
	const { mean, median, range, standardDeviation, variance, kurtosis, p25, p75, rootMeanSquare } =
		this.graphManager.data[this.currentDataset].calcStats()
	this.graphStatTexts.mean.innerText = `Mean: ${this.formatStat(mean)}`
	this.graphStatTexts.median.innerText = `Median: ${this.formatStat(median)}`
	this.graphStatTexts.range.innerText = `Range: ${this.formatStat(range)}`
	this.graphStatTexts.standardDeviation.innerText = `Standard Deviation: ${this.formatStat(standardDeviation)}`
	this.graphStatTexts.variance.innerText = `Variance: ${this.formatStat(variance)}`
	this.graphStatTexts.kurtosis.innerText = `Kurtosis: ${this.formatStat(kurtosis)}`
	this.graphStatTexts.p25.innerText = `25th Percentile (Q1): ${this.formatStat(p25)}`
	this.graphStatTexts.p75.innerText = `75th Percentile (Q3): ${this.formatStat(p75)}`
	this.graphStatTexts.rootMeanSquare.innerText = `Root Mean Square (RMS): ${this.formatStat(rootMeanSquare)}`
}

DatasetManager.prototype.formatStat = function (val) {
	let output = parseFloat(val.toFixed(2))
	if (isNaN(output)) {
		output = 0
	}
	return output
}

DatasetManager.prototype.disableDataset = function (datasetIndex) {
	for (const datapoint of this.datasets[datasetIndex]) {
		this.graphManager.data[datasetIndex].remove({ x: datapoint.time, y: datapoint.voltage })
		datapoint.disable()
	}
	this.graphManager.update(datasetIndex)
	this.updateStats()
}

DatasetManager.prototype.toggleDatapoint = function (datapoint, datasetIndex) {
	if (datapoint.enabled) {
		this.graphManager.data[datasetIndex].remove({ x: datapoint.time, y: datapoint.voltage })
	} else {
		this.graphManager.data[datasetIndex].insert({ x: datapoint.time, y: datapoint.voltage })
	}
	this.graphManager.update(datasetIndex)
	datapoint.toggleEnabled()

	this.updateStats()
}

DatasetManager.prototype.updateVoltageBounds = function () {
	for (let i = 0; i < this.datasetContainers.length; i++) {
		this.disableDataset(i)
		for (const datapoint of this.datasets[i]) {
			if (datapoint.voltage >= this.minVoltage && datapoint.voltage <= this.maxVoltage) {
				this.graphManager.data[i].insert({ x: datapoint.time, y: datapoint.voltage })
				datapoint.enable()
			}
		}
		this.graphManager.update(i)
	}
	this.updateStats()
}

DatasetManager.prototype.sort = function () {
	if (this.sortedBy[this.currentDataset] == 'Time') {
		this.sortByVoltage()
	} else {
		this.sortByTime()
	}
}

DatasetManager.prototype.sortByTime = function () {
	const currentOrder = Array.from(this.datasetContainers[this.currentDataset].children)
	currentOrder.sort((a, b) => parseFloat(a.getAttribute('data-time')) - parseFloat(b.getAttribute('data-time')))
	this.datasetContainers[this.currentDataset].innerHTML = ''
	this.datasetContainers[this.currentDataset].append(...currentOrder)
	this.sortedBy[this.currentDataset] = 'Time'
}

DatasetManager.prototype.sortByVoltage = function () {
	const currentOrder = Array.from(this.datasetContainers[this.currentDataset].children)
	currentOrder.sort((a, b) => parseFloat(a.getAttribute('data-voltage')) - parseFloat(b.getAttribute('data-voltage')))
	this.datasetContainers[this.currentDataset].innerHTML = ''
	this.datasetContainers[this.currentDataset].append(...currentOrder)
	this.sortedBy[this.currentDataset] = 'Voltage'
}

DatasetManager.prototype.exportData = function () {
	let csvContent = 'data:text/csv;charset=utf-8,'
	csvContent += 'Time,Voltage\r\n'
	this.datasets[this.currentDataset].forEach(({ time, voltage, enabled }) => {
		if (enabled) {
			csvContent += `${time},${voltage}\r\n`
		}
	})
	var encodedUri = encodeURI(csvContent)
	var link = document.createElement('a')
	link.setAttribute('href', encodedUri)
	link.setAttribute('download', `Dataset ${this.currentDataset + 1}`)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

// Revised to handle asynchronous operations with Promises
DatasetManager.prototype.importCSV = function (file) {
	return new Promise((resolve, reject) => {
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				const text = e.target.result
				resolve(this.csvToArray(text))
			}
			reader.onerror = (error) => reject(error)
			reader.readAsText(file)
		} else {
			reject('No file provided')
		}
	})
}

DatasetManager.prototype.importData = function (file) {
	this.importCSV(file)
		.then((importedData) => {
			for (const { Time, Voltage } of importedData) {
				const datapoint = new Datapoint(Time, Voltage)
				const index = this.currentDataset
				datapoint.enableDiv.addEventListener('click', () => {
					this.toggleDatapoint(datapoint, index)
				})
				datapoint.enabled = false
				this.datasetContainers[index].append(datapoint.div)
				this.datasets[index].push(datapoint)
				this.toggleDatapoint(datapoint, index)
			}
		})
		.catch((error) => {
			console.error('Failed to import data:', error)
		})
}

DatasetManager.prototype.csvToArray = function (str, delimiter = ',') {
	if (!str || str.trim() === '') {
		console.error('Empty or invalid CSV string provided')
		return []
	}

	// Normalize new line characters and split the input into lines
	const lines = str.replace(/\r\n/g, '\n').split('\n')

	// Extract headers
	const headers = lines[0].split(delimiter).map((header) => header.trim())
	if (headers.length === 0 || headers.some((header) => !header)) {
		console.error('CSV headers are missing or invalid')
		return []
	}

	// Process each subsequent line
	const arr = lines
		.slice(1)
		.filter((line) => line)
		.map((line) => {
			const values = line.split(delimiter)
			const el = headers.reduce((object, header, index) => {
				object[header] = values[index] && values[index].trim()
				return object
			}, {})
			return el
		})

	return arr
}
