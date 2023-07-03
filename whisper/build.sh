export ASR_ENGINE=faster_whisper
export ASR_MODEL=base

docker build -f Dockerfile.gpu -t whisper-asr-webservice-gpu .