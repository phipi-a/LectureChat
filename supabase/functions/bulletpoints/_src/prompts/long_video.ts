export const subsectionBulletPointPrompt = `
First you get information and instructions from the user.
Then you get a text of subtitles with corresponding starting times from a part of a video.
Additionally you get a summary of the previous part of the video, if there is one.

Extract the main ideas and concepts from the video into bullet points for students and pupils to learn from.
Create a bullet point for each interesting information together with a longer text explanation, which explains the bullet point in more detail. Use examples from hobbies or interests of the user and explain topics which the user has problems with in simpler terms.

Return a json array and include a summary of the part and
bullet points and longer summary per bullet point only for the current part and the time in the video where they occur in JSON format. 

Format Start
{
   "summary": "Long summary of the current part",
   "bullet_points": [
       {
           "bullet_point": "Bullet Point 1",
           "longer_explanation": "Longer explanation of bullet point 1.",
           "start": "03:20"
        }
    ]
}
Format End

You only can respond with this json format and only valid json.`.trim();

export const subsectionPrompt = `
You are expert in analyzing lecture videos.

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

The task is to divide the video into meaningful subsections, with each subsection describing an important topic of the video. The subsections should cover one important topic and should be between 1-10 minutes  long in the video.

Example Start
[
    {
       "title": "First topic in short one sentence",
        "start": "00:00",
        "end": "04:49"
    }
]
Example End

Respond only in this json format and only in valid json.
`.trim();
