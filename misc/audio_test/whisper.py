# Note: you need to be using OpenAI Python v0.27.0 for the code below to work
import openai

openai.api_key_path = "./open_ai_key.txt"

audio_file= open("./lecture_20_min_chunk_0.mp3", "rb")
print("Starting transcription")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
print("Finished")

with open("output.txt", "w") as f:
    f.write(transcript["text"])
