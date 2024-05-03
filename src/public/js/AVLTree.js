class Node {
	constructor(data) {
		this.data = data
		this.left = null
		this.right = null
		this.height = 1
	}
}

export class AVLTree {
	constructor() {
		this.root = null
	}

	insert(data) {
		this.root = this._insert(this.root, data)
	}

	_insert(node, data) {
		if (!node) {
			return new Node(data)
		}

		if (data.x < node.data.x) {
			node.left = this._insert(node.left, data)
		} else if (data.x > node.data.x) {
			node.right = this._insert(node.right, data)
		} else {
			return node // Duplicates not allowed
		}

		return this.balanceNode(node)
	}

	remove(data) {
		this.root = this._remove(this.root, data)
	}

	_remove(node, data) {
		if (!node) {
			return node
		}

		if (data.x < node.data.x) {
			node.left = this._remove(node.left, data)
		} else if (data.x > node.data.x) {
			node.right = this._remove(node.right, data)
		} else {
			if (node.left === null || node.right === null) {
				let temp = node.left ? node.left : node.right
				if (temp === null) {
					temp = node
					node = null
				} else {
					node = temp
				}
			} else {
				let temp = this.getMinValueNode(node.right)
				node.data = temp.data
				node.right = this._remove(node.right, temp.data)
			}
		}

		if (node === null) {
			return node
		}

		return this.balanceNode(node)
	}

	balanceNode(node) {
		node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
		let balance = this.getBalance(node)

		if (balance > 1 && this.getBalance(node.left) >= 0) {
			return this.rotateRight(node)
		}

		if (balance > 1 && this.getBalance(node.left) < 0) {
			node.left = this.rotateLeft(node.left)
			return this.rotateRight(node)
		}

		if (balance < -1 && this.getBalance(node.right) <= 0) {
			return this.rotateLeft(node)
		}

		if (balance < -1 && this.getBalance(node.right) > 0) {
			node.right = this.rotateRight(node.right)
			return this.rotateLeft(node)
		}

		return node
	}

	rotateRight(y) {
		let x = y.left
		let T2 = x.right
		x.right = y
		y.left = T2
		y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right))
		x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right))
		return x
	}

	rotateLeft(x) {
		let y = x.right
		let T2 = y.left
		y.left = x
		x.right = T2
		x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right))
		y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right))
		return y
	}

	getHeight(node) {
		if (!node) return 0
		return node.height
	}

	getBalance(node) {
		if (!node) return 0
		return this.getHeight(node.left) - this.getHeight(node.right)
	}

	getMinValueNode(node) {
		let current = node
		while (current.left !== null) {
			current = current.left
		}
		return current
	}

	printInOrder(node = this.root) {
		if (node !== null) {
			this.printInOrder(node.left)
			this.printInOrder(node.right)
		}
	}

	toArray() {
		const result = []
		this._toArray(this.root, result)
		return result
	}

	_toArray(node, result) {
		if (node !== null) {
			this._toArray(node.left, result) // Traverse left subtree
			result.push(node.data) // Visit node itself
			this._toArray(node.right, result) // Traverse right subtree
		}
	}

	calcStats() {
		const voltages = this.toArray()
			.map(({ x, y }) => y)
			.filter((y) => y !== null && !isNaN(y))
		if (voltages.length === 0) {
			// Return default values when data is empty or all are NaN/null
			return {
				mean: 0,
				median: 0,
				range: 0,
				standardDeviation: 0,
				p25: 0,
				p75: 0,
				kurtosis: 0,
				variance: 0,
				rootMeanSquare: 0,
			}
		}

		const sortedVoltages = [...voltages].sort((a, b) => a - b)
		const mean = voltages.reduce((acc, val) => acc + val, 0) / voltages.length
		const mid = Math.floor(sortedVoltages.length / 2)
		const median =
			sortedVoltages.length % 2 !== 0 ? sortedVoltages[mid] : (sortedVoltages[mid - 1] + sortedVoltages[mid]) / 2
		const variance = voltages.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / voltages.length
		const standardDeviation = Math.sqrt(variance)
		const p25 = sortedVoltages[Math.floor(0.25 * sortedVoltages.length)]
		const p75 = sortedVoltages[Math.floor(0.75 * sortedVoltages.length)]
		const kurtosis =
			voltages.reduce((acc, val) => {
				const z = (val - mean) / standardDeviation
				return acc + Math.pow(z, 4)
			}, 0) /
				voltages.length -
			3
		const rootMeanSquare = Math.sqrt(voltages.reduce((acc, val) => acc + val * val, 0) / voltages.length)
		const range = sortedVoltages[sortedVoltages.length - 1] - sortedVoltages[0]

		return { mean, median, range, standardDeviation, p25, p75, kurtosis, variance, rootMeanSquare }
	}
}
