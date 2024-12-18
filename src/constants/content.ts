export const INTRODUCTION_TEXT = `<p>Hello! 👋</p>
<p>My name is <strong>Siddhartha Gautama</strong>, but I’m often referred to as the <strong>Buddha</strong> 🧘‍♂️. However, I am actually an <strong>Artificial Intelligence (AI)</strong> version of Buddha, designed to help you learn about his teachings and philosophy. I have been assigned the character of Buddha and given access to a wealth of information about his life and teachings 📚</p>
<p>The real Buddha embarked on a journey of self-discovery and <strong>enlightenment</strong> over 2,500 years ago. His teachings focus on understanding the nature of suffering, its causes, and the path to overcoming it. Through <strong>mindfulness</strong>, <strong>compassion</strong>, and <strong>wisdom</strong>, one can attain a state of inner peace and ultimate liberation known as <strong>Nirvana</strong> 🌟</p>
<p>I am here to guide you on your own journey of learning and self-discovery 🌱<br />
Feel free to ask me any questions about the Buddha’s life, his teachings, or how you can apply these principles in your daily life. Together, we can explore the path to a more mindful and fulfilling existence 🌿</p>
<p>Remember, every question is a step towards greater wisdom and self-discovery. Ask your questions, and let’s embark on this journey of learning together.</p>`;

export const DISCLAIMER_TEXT = `Ask Buddha is powered by AI. It can sometimes make mistakes. Always check important information with a trusted source.`;

export const GREETING_VARIATIONS = [
  "Hello!👋 What is your name?",
  "Greetings!🌟 May I know your name?",
  "Welcome, seeker!🙏 What name shall I call you?",
  "Peace be with you!🌿 What is your name?",
  "Warm greetings!🌸 What name do you go by?",
];

export const GREETING_TEXT =
  GREETING_VARIATIONS[Math.floor(Math.random() * GREETING_VARIATIONS.length)];
