export default `
First you get information and instructions from the user.
Then you get a text of subtitles with starting times of the subtitle from a video, together with the time point the sentences started.

Extract the main ideas and concepts from the video into bullet points for students and pupils to learn from.
Create a bullet point for each interesting information together with a longer text explanation, which explains the bullet point in more detail. Use examples from hobbies or interests of the user and explain topics which the user has problems with in simpler terms.

Return a json array of bullet points with the bullet points and long summary and the time in the video where they occur in JSON format.

Format Start

[
{
    "bullet_point": "Bullet Point 1",
    "longer_explanation": "Longer explanation of bullet point 1.",
    "start": "00:00"
}
]

Format End

Respond only in this json format and only in valid json.
`.trim();
