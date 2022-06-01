import express from 'express'
import fs from 'fs'
import path from 'path'
import { getYoutubeId } from './utils.js'
import { createWaveform } from './terminalCommands.js'

const app = express()
const port = 3001

app.get('/waveform', (req, res) => {
	const { id, link } = req.query
	const materialId = getYoutubeId(link) || id
	const folderName = `./waveforms/${materialId}`
	const filePath = `${folderName}/peaks.json`
	if (fs.existsSync(filePath)) {
		responseWithJsonFile(filePath, res)
		// res.send(`waveform for <b>${folderName}</b> exists`)
	} else {
		console.time('x')
		createWaveform(materialId)
		console.timeEnd('x')
		responseWithJsonFile(filePath, res)
	}
})

const responseWithJsonFile = (filePath, res) => {
	const jsonContent = fs.readFileSync(filePath, 'utf-8')
	res.header('Content-Type', 'application/json')
	res.send(jsonContent)
}

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
