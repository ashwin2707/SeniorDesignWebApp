import { GraphManager } from './GraphManager.js'

let data1 = []
let data2 = []
let data3 = []

fetch('/csv-data')
	.then((res) => res.json())
	.then((data) => {
		data['csv-data1'].map((item) => item)
		const data1 = data['csv-data1'].map(({ time, voltage }) => {
			return { time: parseFloat(time), voltage: parseFloat(voltage) }
		})
		const data2 = data['csv-data2'].map(({ time, voltage }) => {
			return { time: parseFloat(time), voltage: parseFloat(voltage) }
		})
		const data3 = data['csv-data3'].map(({ time, voltage }) => {
			return { time: parseFloat(time), voltage: parseFloat(voltage) }
		})

		const graphManager = new GraphManager(data1, data2, data3)
	})
