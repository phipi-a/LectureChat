import requests

# This is the URL of the server
url = "http://localhost:9000/asr?lang=en&output=json"

# This is the path to the audio file
path = "/home/hjal/uni/DesignEd/LectureChat/misc/audio_test/conv.mp4"

# This is the request
files = {'audio_file': open(path, 'rb')}

# This is the response
response = requests.post(url, files=files)

# This is the response text
print(response.text)