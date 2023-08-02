from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware

import rembg
import base64
import requests
from PIL import Image
import io

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/getData")
async def getData():
    person = {"name": "kepa", "age": 23}
    return person

@app.post("/removeBg")
async def removeBg(request_data: dict):
    image_url = request_data.get('url')

    if image_url:
        try:
            # Download the image from the provided URL
            response = requests.get(image_url)
            response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

            # Use rembg to remove the background
            image_bytes = rembg.remove(response.content)

            # Convert the processed image to base64
            # image_base64 = base64.b64encode(image_bytes).decode('utf-8')

            # Create a PIL image object from the processed image data
            processed_image = Image.open(io.BytesIO(image_bytes))

            # Save the processed image to a byte stream
            processed_image_stream = io.BytesIO()
            processed_image.save(processed_image_stream, format='PNG')

            # Return the processed image in the API response with content_type='image/jpeg'
            return Response(content=processed_image_stream.getvalue(), media_type='image/PNG')

        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=400, detail='Error downloading image: ' + str(e))
        except rembg.RembgError as e:
            raise HTTPException(status_code=500, detail='Error removing background: ' + str(e))

    raise HTTPException(status_code=400, detail='Image URL not provided')
