import moviepy.editor as mp

def extract_audio(video_path, audio_path):
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path)

# Example usage
video_path = "./Lecture 5 (video) - SoSe 2021.mp4"
audio_path = "./output_audio.mp3"

extract_audio(video_path, audio_path)
