// app.js
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors')
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

                const processedImage = fs.readFileSync(outputPath, 'base64');

                // Send the processed image as a response
                res.send({ processedImage });
            } else {
                // There was an error during Python script execution
                console.error('Python script exited with code:', code);
                res.status(500).send({ error: 'Background removal failed' });
            }

            // Cleanup: remove temporary input and output files
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error during background removal:', error);
        res.status(500).send({ error: 'Background removal failed' });
    }
});
app.get('/')

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
