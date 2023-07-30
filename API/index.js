// app.js
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');
const { exit } = require('process');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to perform background removal
app.post('/remove-background', async (req, res) => {
    try {
        const imageUrl = req.body.url;

        // Fetch the image from the URL using 'fetch'
        const response = await fetch(imageUrl);
        if (!response.ok) {
            res.status(500).send({ error: 'UrlNotValid' });
            throw new Error('Failed to fetch the image');
           
        }
        const imageData = await response.buffer();

        // Write the image data to a temporary file (input.jpg)
        const inputPath = 'input.jpg';
        const outputPath = 'output.png';

        fs.writeFileSync(inputPath, imageData);

        const pythonProcess = spawn('python', ['python/index.py']);

        // Listen for standard output from the Python script (processed image)
        let processedImageData = '';
        pythonProcess.stdout.on('data', (data) => {
            processedImageData += data.toString();
        });

        // Handle error output from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python script:', data.toString());
            res.status(500).send({ error: 'Background removal failed' });
        });

        // Handle completion of the Python script execution
        pythonProcess.on('close', (code) => {
            //res.status(200).send({ error: 'Background removal okey' });
            if (code === 0) {
                // The Python script executed successfully
                // Read the processed image from the output file (output.png)

                /*const processedImage = fs.readFileSync(outputPath, 'base64');
                const processedImageFile = fs.readFileSync(outputPath);
                // res.send({ processedImage });
                    */

                const imagePath = path.join(__dirname, outputPath);

                try {
                    // Send the image as a response
                    const imageContent = fs.readFileSync(imagePath);
                    res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type as needed
                    res.send(imageContent);
                } catch (err) {
                    console.error('Error sending image:', err);
                    res.status(500).send('Error sending image');
                }

                // Synchronously unlink the files
                try {
                    fs.unlinkSync(outputPath);
                    fs.unlinkSync(inputPath);
                } catch (err) {
                    console.error('Error deleting files:', err);
                }

            } else {
                console.error('Python script exited with code:', code);
                res.status(500).send({ error: 'Background removal failed' });
            }


            // fs.unlinkSync(inputPath);
            // fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error during background removal:', error);
        res.status(500).send({ error: 'Background removal failed' });
    }
});
app.get('/', (req, res) => {
    res.send("<h1>hello</h1>")
})
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
