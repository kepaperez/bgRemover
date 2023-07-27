import { useState } from "react";

const Tool = () => {
    const [url, setUrl] = useState('')
    const [processedImage, setProcessedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const removeBg = async () => {
        setIsLoading(true)
        const response = await fetch('http://localhost:3000/remove-background', {
            // const response = await fetch('http://127.0.0.1:8000/removeBg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })
        const jsonResponse = await response.json();
        if (response.ok) {

            setProcessedImage(jsonResponse.processedImage)
            setIsLoading(false)
        } else {
            console.log("Error" + JSON.stringify(jsonResponse.error))
            setIsLoading(false)
        }
    }

    const handleDownload = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = `data:image/png;base64,${processedImage}`;
        downloadLink.download = 'processed_image.png';
        downloadLink.click();
    };
    return (
        <>
            <h1>Remove Background</h1>

            <div className="topHeader">
                <input type='text'
                placeholder="Image Url"
                onChange={(e) => {
                    setProcessedImage('')
                    setUrl(e.currentTarget.value)
                }} />
                <button
                className="button1"
                onClick={removeBg}>
                    Remove Background
                </button>
            </div>
            <h2>Preview</h2>
            <div className='previewInputImg'>
                <img className='imgPreview' src={url} />
            </div>
            {processedImage || isLoading ?

                <div className='previewInputImg'>
                    <h2>Processed</h2>
                    <div className='processedImageContainer'>
                        {!isLoading ?
                            <>
                                <img className='imgPreview'
                                    src={`data:image/png;base64,${processedImage}`}
                                    alt="Processed Image"
                                />
                                <button onClick={handleDownload}>
                                    Download
                                </button>
                            </>

                            :
                            <div>Loading ...</div>
                        }
                    </div>


                </div> : <></>

            }



        </>
    )
}

export default Tool