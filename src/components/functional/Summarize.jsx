import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea';

const Summarize = () => {

    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const handleSummarize = (e) => {
        e.preventDefault();
        query({"inputs": text})
    }

    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                headers: {
                    Authorization: "Bearer xxxx",
				    "Content-Type": "application/json",
                }, 
                
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        console.log(JSON.stringify(result));
        setSummary(JSON.stringify(result))
    }


    return (
        <div className='flex flex-col justify-center items-center gap-10 w-full'>
            <form onSubmit={handleSummarize} className='flex flex-col gap-10 w-[90%] justify-center items-center'>
                <Textarea placeholder='Text here...' className='h-[200px] w-full' value={text} onChange={(e) => setText(e.target.value)} />
                <Button type='submit' className='w-20 p-2'>Summarize</Button>
            </form>

            <div>Result :</div>
            <div>{summary}</div>
        </div>
    )
}

export default Summarize;