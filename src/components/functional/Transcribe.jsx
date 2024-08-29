import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { MessageTypes } from '@/utils/presets'
import { Card, CardDescription, CardHeader } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

const Transcribe = () => {

    const [audioFile, setAudioFile] = useState()
    const [reset, setReset] = useState(false)
    const worker = useRef(null)
    const [result, setResult] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [finished, setFinished] = useState(false)
    const [inProgress, setInProgress] = useState(false)

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../../utils/whisper.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.type) {
                case 'DOWNLOADING':
                    setDownloading(true)
                    console.log('DOWNLOADING')
                    break;
                case 'LOADING':
                    setLoading(true)
                    console.log('LOADING')
                    break;
                case 'RESULT':
                    setResult(e.data.results)
                    console.log(e.data.results)
                    break;
                case 'INFERENCE_DONE':
                    setFinished(true)
                    console.log("DONE")
                    setInProgress(false)
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    })

    const getFile = (e) => {
        setInProgress(false)
        setResult(null);
        setAudioFile(e.target.files[0])
        setReset(true)
    }

    const handleReset = () => {
        setAudioFile(null);
        setReset(false);
    }

    const handleTranscribe = async () => {
        if (!audioFile) {
            return;
        }

        setInProgress(true)
        setReset(false)
        let audio = await readAudioFrom(audioFile);
        const model_name = `openai/whisper-tiny.en`;

        worker.current.postMessage({
            type: MessageTypes.INFERENCE_REQUEST,
            audio,
            model_name
        });
    }

    async function readAudioFrom(file) {
        const sampling_rate = 16000
        const audioCTX = new AudioContext({ sampleRate: sampling_rate })
        const response = await file.arrayBuffer()
        const decoded = await audioCTX.decodeAudioData(response)
        const audio = decoded.getChannelData(0)
        return audio
    }

    return (
        <div className='flex flex-col justify-center items-center gap-10'>
            {
                reset && !inProgress && !result ?
                    <div className='flex flex-row gap-5 items-center bg-gray-600 rounded-2xl p-5'>
                        <div className='flex flex-col gap-4'>
                            File Details
                            <p>
                                Name : {audioFile.name}
                            </p>
                            <p>
                                Size : {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        <div className='flex flex-row gap-5'>
                            <Button className='hover:bg-blue-300' onClick={handleTranscribe}>
                                Transcribe
                            </Button>
                            <Button className={'hover:bg-red-300 hidden' + (reset ? ' flex' : '')} onClick={handleReset}>
                                Reset
                            </Button>
                        </div>

                    </div>
                    :
                    !result && !inProgress && <p className='text-base'>
                        <label className='text-xl font-semibold hover:text-blue-700 hover:cursor-pointer '>
                            Upload
                            <input className='hidden' type="file" onChange={getFile} /> audio file
                        </label>
                    </p>
            }

            {
                inProgress &&
                <div className='status flex flex-col gap-10'>
                    <p className='font-semibold text-2xl'>
                        Started transcribing, Please wait...
                    </p>
                    {/* <p className={'font-semibold text-2xl flex' + (result ? ' hidden' : '')}>
                        {downloading && 'Downloading'}...
                        {loading && 'Loading'}...
                    </p> */}
                </div>
            }

            {
                result &&
                <div className='flex flex-col gap-5 p-4'>
                    <div className='flex'>
                        <Button className='text-base'>
                            <label className='font-semibold hover:text-blue-700 hover:cursor-pointer '>
                                Upload
                                <input className='hidden' type="file" onChange={getFile} /> another file
                            </label>
                        </Button>
                    </div>
                    <p>Below is the transcription result : </p>
                    <ScrollArea className="flex flex-col gap-5 h-72 rounded-md border p-4">
                        {
                            result?.map((chunk, index) => {
                                return (
                                    <div key={index}>
                                        <Card className="w-[500px]">
                                            <CardHeader>
                                                <CardDescription>{chunk?.text}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                        <Separator className="my-2" />
                                    </div>

                                )
                            })
                        }
                    </ScrollArea>
                </div>
            }
        </div>
    )
}

export default Transcribe