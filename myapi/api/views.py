from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
import rembg
import base64
import requests

@api_view(['GET'])
def getData(request):
    person ={"name":"kepa","age":23}
    return Response(person)

@api_view(['POST'])
def removeBg(request):
       if request.method == 'POST':
        request_data = request.data  # Assuming the request contains a JSON object
        image_url = request_data.get('url')  # Assuming the URL is present as 'image_url' key

        if image_url:
            try:
                # Download the image from the provided URL
                response = requests.get(image_url)
                response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

                # Use rembg to remove the background
                image_bytes = rembg.remove(response.content)

                # Convert the processed image to base64
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')

                return Response({'processedImage': image_base64})

            except requests.exceptions.RequestException as e:
                return Response({'error': 'Error downloading image: ' + str(e)}, status=400)
            except rembg.RembgError as e:
                return Response({'error': 'Error removing background: ' + str(e)}, status=500)

        return Response({'error': 'Image URL not provided'}, status=400)
   