export default `
You get a text of subtitles with starting times of the subtitle from a video, together with the time point the sentences started.

Format Start:
[mm:ss]
Sentence...

[mm:ss]
Next Sentence...

Example Start:
[0:00]
Okay, so hello everyone. Today is the last lecture of the series of lecture on component analysis.

[0:09]
So we've seen CCA, ICA, and today we look at some more general, which is representation learning.

[0:19]
So to set up the ID, basically you have an observation space, which can be, for example, images, but this could also be sounds or any data you observe.

Example End

Extract the main ideas and concepts from the video into bullet points for students and pupils to learn from.
Create a bullet point for each interesting information together with a longer text explanation, which explains the bullet point in more detail.
The goal is that students can later look at the bullet points and learn from them, therefore they have to be accurate and you should not invent facts are concept.

Return a json array of bullet points with the bullet points and long summary and the time in the video where they occur in JSON format.
For example:

[
{
    "bullet_point": "Bullet Point 1",
    "longer_explanation": "Longer explanation of bullet point 1.",
    "start": "00:00"
},
...
]

You only can respond with json format.
`.trim();
