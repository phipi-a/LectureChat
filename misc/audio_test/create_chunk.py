from pydub import AudioSegment

song = AudioSegment.from_mp3("./output_audio.mp3")

# PyDub handles time in milliseconds
min = 20
ten_minutes = min * 60 * 1000

first_10_minutes = song[:ten_minutes]

first_10_minutes.export(f"lecture_{min}_min_chunk_0.mp3", format="mp3")