const userData = {
  name: "Hjalmar",
  age: 5,
  hobbies: ["football", "programming", "gaming"],
  favorite_topcs: ["javascript", "react", "nodejs"],
  language: "german",
  subject_difficulty: "Computer Science, Mathematics",
  difficulty: "Inattentive ADHD",
  emojis: true,
  person: "Shakespeare",
};

function createPersonalisationPrompt(userData) {
  let personalized_prompt = "My Profile:\n";
  if (userData.name) {
    personalized_prompt += `Name: ${userData.name}\n`;
  }
  if (userData.age) {
    personalized_prompt += `Age: ${userData.age}\n`;
  }
  if (userData.hobbies) {
    personalized_prompt += `Hobbies: ${userData.hobbies}\n`;
  }
  if (userData.favorite_tobics) {
    personalized_prompt += `Favorite Topics: ${userData.favorite_tobics.join(
      ", "
    )}\n`;
  }
  if (userData.subject_difficulty) {
    personalized_prompt += `Subject Difficulty: ${userData.subject_difficulty}\n`;
  }
  if (userData.difficulty) {
    personalized_prompt += `Learning Difficulty: ${userData.difficulty}\n`;
  }

  personalized_prompt += `\n`;

  console.log(userData.language);
  if (userData.language.toLowerCase() !== "english") {
    personalized_prompt += `You have to generate the bullet points and the longer explanation in the language ${userData.language}, translate if the text is not in ${userData.language}.\n`;
  }

  if (userData.age < 14) {
    personalized_prompt += ` Explain it to me like I am ${userData.age}.`;
  }

  if (userData.hobbies) {
    personalized_prompt += ` Include my hobbies in the explanation: ${userData.hobbies.join(
      " or "
    )}.`;
  }

  if (userData.difficulty) {
    personalized_prompt += ` Consider that I have the learning difficulty ${userData.difficulty} in the bullet points\n`;
  }

  if (userData.subject_difficulty) {
    personalized_prompt += ` Consider if have problems with ${userData.subject_difficulty} in the bullet points\n`;
  }

  if (userData.emojis) {
    personalized_prompt += `You have to use a one emoji at the beginning of each bullet point that fits the bullet points! Also use emojis in the explanation.`;
  }

  return personalized_prompt;
}

const p = createPersonalisationPrompt(userData);
console.log(p);
