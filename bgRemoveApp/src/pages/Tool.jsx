import { useState } from "react";
import download from '../assets/download.svg'
import Spinner from "../components/Spinner.JSX";
const Tool = () => {
    const [url, setUrl] = useState('')
    const [processedImage, setProcessedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isValidUrl, setIsValidUrl] = useState(true);
    const removeBg = async () => {
        if (isValidUrl && url) {
            setIsLoading(true)
            //const response = await fetch('http://localhost:3000/remove-background', {
                 const response = await fetch('http://127.0.0.1:8000/removeBg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            })
            const blobResponse = await response.blob();
            if (response.ok) {
                console.log(blobResponse)
                const url = URL.createObjectURL(blobResponse);
                setProcessedImage(url)
                setIsLoading(false)
            } else {
                console.log("Error" + JSON.stringify(blobResponse.error))
                setIsLoading(false)
            }
        }

    }



    const handleDownload = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = `${processedImage}`;
        downloadLink.download = 'processed_image.png';
        downloadLink.click();
    };



    const handleInputChange = (event) => {
        const { value } = event.target;
        setIsValidUrl(true)
        setProcessedImage('')
        setUrl(value)
    };
    return (
        <>
            <h1>Remove Background</h1>
        

            <div className="topHeader">
                <input type='text'
                    placeholder="Image Url"
                    onChange={
                        handleInputChange
                    } />
                <button
                    className="button1"
                    onClick={removeBg}>
                    Remove Background

                </button>
            </div>

            {url ?
                isValidUrl && url ? (
                    <>
                        <h2 style={{ marginTop: '45px' }}>Your image</h2>
                        <div className='previewInputImg'>
                            <img className='imgPreview' src={url} alt="User Image" onError={() => setIsValidUrl(false)} />
                        </div>  </>) : (
                    <p style={{ marginTop: '45px' }}>Invalid image URL</p>
                )
                : <></>}



            {processedImage || isLoading ?
                <>
                    <h2 style={{ marginTop: '45px' }}>Processed</h2>
                    <div className='previewInputImg'>

                        <div className='processedImageContainer'>
                            {!isLoading ?
                                <>
                                    <img className='imgPreview'
                                        src={processedImage}
                                        alt="Processed Image"
                                    />
                                    <button className="button1" onClick={handleDownload}>
                                        Download
                                        <img
                                            style={{ color: 'white', width: '25px' }}
                                            src={download} />
                                    </button>
                                </>
                                :
                                <Spinner />
                            }
                        </div>


                    </div></> : <></>

            }



        </>
    )
}

export default Tool