const CHECKMARK_ASCII = '&#x2713'
const CLASS_ENABLE = 'data-point-enabled'

export function Datapoint(time, voltage, enabled = true) {
	this.time = parseFloat(time)
	this.voltage = parseFloat(voltage)
	this.enabled = enabled
	this.createUI()
}

Datapoint.prototype.createUI = function () {
	// Create row item
	this.div = document.createElement('div')
	this.div.classList.add('data-row')
	// Enable button
	this.enableDiv = document.createElement('div')
	this.enableDiv.classList.add('data-point', 'enable-box', CLASS_ENABLE)
	this.enableDiv.innerHTML = CHECKMARK_ASCII
	// Milliseconds div
	const timeDiv = document.createElement('div')
	timeDiv.classList.add('data-point')
	timeDiv.innerText = `${this.time.toFixed(2)} ms`
	// Voltage div
	const voltageDiv = document.createElement('div')
	voltageDiv.classList.add('data-point')
	voltageDiv.innerText = `${this.voltage.toFixed(2)} V`

	this.div.setAttribute('data-time', this.time)
	this.div.setAttribute('data-voltage', this.voltage)
	this.div.append(this.enableDiv)
	this.div.append(timeDiv)
	this.div.append(voltageDiv)
}

Datapoint.prototype.toggleEnabled = function () {
	if (this.enabled) {
		this.disable()
	} else {
		this.enable()
	}
}

Datapoint.prototype.enable = function () {
	if (!this.enableDiv.classList.contains(CLASS_ENABLE)) {
		this.enableDiv.classList.add(CLASS_ENABLE)
	}
	this.enableDiv.innerHTML = CHECKMARK_ASCII
	this.enabled = true
}

Datapoint.prototype.disable = function () {
	if (this.enableDiv.classList.contains(CLASS_ENABLE)) {
		this.enableDiv.classList.remove(CLASS_ENABLE)
	}
	this.enableDiv.innerText = ''
	this.enabled = false
}
