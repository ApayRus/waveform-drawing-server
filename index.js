import express from 'express'
import fs from 'fs'
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
		console.time('time')
		createWaveform(materialId)
		console.timeEnd('time')
		// it is expensive to save audio files, so we remove them
		removeAudioFiles(folderName)
		responseWithJsonFile(filePath, res)
	}
})

const responseWithJsonFile = (filePath, res) => {
	const jsonContent = fs.readFileSync(filePath, 'utf-8')
	res.header('Content-Type', 'application/json')
	res.send(jsonContent)
}

const removeAudioFiles = folderName => {
	removeFile(`${folderName}/audio.m4a`)
	removeFile(`${folderName}/audio.wav`)
}

const removeFile = filePath => {
	fs.unlink(filePath, err => {
		if (err) throw err
		console.log(`${filePath} was deleted`)
	})
}

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
