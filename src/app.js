const express = require('express')
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
const app = express()
const PORT = process.env.PORT || 3000
// const CSV_BASE_DIRECTORY = path.join(__dirname, '..', '..', 'Discrete')
const CSV_BASE_DIRECTORY = path.join(__dirname, '..', 'Discrete')
const CSV_DIRECTORIES = [
	path.join(CSV_BASE_DIRECTORY, 'Discrete1/'),
	path.join(CSV_BASE_DIRECTORY, 'Discrete2/'),
	path.join(CSV_BASE_DIRECTORY, 'Discrete3/'),
]
console.log('The base directories are:', CSV_DIRECTORIES)

console.log(path.join(__dirname, 'public'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/csv-data', async (req, res) => {
	try {
		const allCsvData = await readAllDirectories(CSV_DIRECTORIES)
		res.json(allCsvData)
	} catch (error) {
		console.error('Error occurred:', error)
		res.status(500).send('Internal Server Error')
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})

async function readAllDirectories(directories) {
	const dataObjects = {}

	for (const [index, directory] of directories.entries()) {
		const data = await readCSVFilesFromDirectory(directory)
		dataObjects[`csv-data${index + 1}`] = data
	}

	return dataObjects
}

const readCSVFilesFromDirectory = (directoryPath) => {
	return new Promise((resolve, reject) => {
		let results = []

		// Read the directory
		fs.readdir(directoryPath, (err, files) => {
			if (err) {
				return reject(err)
			}

			// Filter for CSV or TXT files if necessary
			files = files.filter((file) => file.endsWith('.csv') || file.endsWith('.txt'))
			let filesRead = 0

			files.forEach((file) => {
				fs.createReadStream(path.join(directoryPath, file))
					.pipe(
						csv({
							headers: ['voltage', 'time'], // Specify the headers since the files don't have them
							skipLines: 1, // Adjust this depending on whether the file contains a header line
						})
					)
					.on('data', (data) => {
						results.push({
							voltage: data.voltage,
							time: data.time,
						})
					})
					.on('end', () => {
						filesRead++
						// Resolve the promise once all files are read
						if (filesRead === files.length) {
							resolve(results)
						}
					})
			})

			// If no files to read
			if (files.length === 0) {
				resolve(results)
			}
		})
	})
}
