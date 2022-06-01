import { getYoutubeId } from './utils.js'
import { execSync } from 'child_process'

export const execSyncMy = (commandString, options) =>
	execSync(commandString, options, (e, stdout, stderr) => {
		if (e) {
			console.error(e)
		}
		console.log('stdout', stdout)
		console.log('stderr', stderr)
	})
// smallest audio with predictable extension
const commandDownloadAudio = (link, outputFileName) => {
	return `yt-dlp -f wa[ext=m4a] ${link} -o ${outputFileName}`
}

// wav file takes lot of disk space, but it will be fast converted to waveform
const commandConvertAudioToWav = (inputFileName, outputFileName) => {
	return `ffmpeg -i ${inputFileName} ${outputFileName}`
}

const commandCalculateAudioPeaks = (inputFileName, outputFileName) => {
	return `audiowaveform --pixels-per-second 10 -i ${inputFileName} -o ${outputFileName} -b 8`
}

export const createWaveform = materialId => {
	const folderName = `waveforms/${materialId}`
	execSyncMy(`mkdir -p ${folderName}`)
	execSyncMy(
		`cd ${folderName} && ` +
			commandDownloadAudio(/* req.query. */ materialId, 'audio.m4a')
	)
	execSyncMy(
		`cd ${folderName}  && ` + commandConvertAudioToWav('audio.m4a', 'audio.wav')
	)
	execSyncMy(
		`cd ${folderName}  && ` +
			commandCalculateAudioPeaks('audio.wav', 'peaks.json')
	)
}
