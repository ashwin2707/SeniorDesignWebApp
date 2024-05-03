import { AVLTree } from './AVLTree.js'
import { Datapoint } from './DataPoint.js'
import { DatasetManager } from './DatasetManager.js'
import { Graph } from './Graph.js'

// Graph Manager
export function GraphManager(data1, data2, data3) {
	this.data = [new AVLTree(), new AVLTree(), new AVLTree()]
	this.dpContainers = [
		document.querySelector('#data-container1'),
		document.querySelector('#data-container2'),
		document.querySelector('#data-container3'),
	]
	data1.forEach(({ time, voltage }) => this.data[0].insert({ x: time, y: voltage }))
	data2.forEach(({ time, voltage }) => this.data[1].insert({ x: time, y: voltage }))
	data3.forEach(({ time, voltage }) => this.data[2].insert({ x: time, y: voltage }))
	this.activeDataIndexes = new Set([0, 1, 2])
	this.createGraph()
	this.updateGraph()
	this.datasetManager = new DatasetManager(this, data1, data2, data3)
	this.toggleChart(1)

	document.querySelector('#toggle-graph1-btn').addEventListener('click', () => this.toggleChart(0))
	document.querySelector('#toggle-graph2-btn').addEventListener('click', () => this.toggleChart(1))
	document.querySelector('#toggle-graph3-btn').addEventListener('click', () => this.toggleChart(2))
	this.update(0)
}

GraphManager.prototype.createGraph = function () {
	this.graph = new Graph()
	document.querySelector('#graph-container').append(this.graph.canvas)
}

GraphManager.prototype.updateGraph = function () {
	const dataMap = {}
	for (const index of this.activeDataIndexes) {
		dataMap[index] = this.data[index].toArray()
	}
	this.graph.update(dataMap)
}

GraphManager.prototype.createDataPoints = function () {
	for (let i = 0; i < 3; i++) {
		this.data[i].toArray().forEach(({ x, y }) => {
			const dp = new Datapoint(x, y)
			this.dpContainers[i].append(dp.div)
		})
	}
}

GraphManager.prototype.update = function (index) {
	this.graph.update({ [index]: this.data[index].toArray() })
}

GraphManager.prototype.toggleChart = function (index) {
	this.graph.toggleChart(index)
}
