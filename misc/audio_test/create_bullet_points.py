import openai

openai.api_key_path = "./open_ai_key.txt"

system = """
You are expert text summarizer. You use bullet points and create short summaries of each bullet point. You are given the raw transcript of a lecture from the user.
""".strip()

with open("output.txt", "r") as f:
    transcript = f.read()

print("Calling chatgpt")
response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": system},
        {"role": "user", "content": transcript},
    ]
)

print("Response")
print(response['choices'][0]['message']['content'])