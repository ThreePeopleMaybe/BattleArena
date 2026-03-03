import { Question } from "../types";

// Science
const science: Question[] = [
  { id: 's1', topicId: 'science', question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
  { id: 's2', topicId: 'science', question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
  { id: 's3', topicId: 'science', question: 'What is the speed of light in vacuum (approximately)?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correctIndex: 0 },
  { id: 's4', topicId: 'science', question: 'What is H2O commonly known as?', options: ['Hydrogen peroxide', 'Water', 'Heavy water', 'Ozone'], correctIndex: 1 },
  { id: 's5', topicId: 'science', question: 'Who developed the theory of general relativity?', options: ['Newton', 'Einstein', 'Hawking', 'Bohr'], correctIndex: 1 },
  { id: 's6', topicId: 'science', question: 'What is the atomic number of carbon?', options: ['4', '6', '8', '12'], correctIndex: 1 },
  { id: 's7', topicId: 'science', question: 'Which gas do plants absorb from the air for photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correctIndex: 2 },
  { id: 's8', topicId: 'science', question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctIndex: 2 },
  { id: 's9', topicId: 'science', question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1 },
  { id: 's10', topicId: 'science', question: 'What type of wave is sound?', options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Standing'], correctIndex: 1 },
];

// Music
const music: Question[] = [
  { id: 'm1', topicId: 'music', question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], correctIndex: 2 },
  { id: 'm2', topicId: 'music', question: "What is the name of the Beatles' first album?", options: ['Help!', 'Please Please Me', 'Revolver', 'Abbey Road'], correctIndex: 1 },
  { id: 'm3', topicId: 'music', question: 'Which instrument is known as the "king of instruments"?', options: ['Piano', 'Organ', 'Violin', 'Guitar'], correctIndex: 1 },
  { id: 'm4', topicId: 'music', question: 'In what decade did hip hop music emerge?', options: ["1960s", "1970s", "1980s", "1990s"], correctIndex: 1 },
  { id: 'm5', topicId: 'music', question: 'What note is a perfect fifth above C?', options: ['D', 'E', 'F', 'G'], correctIndex: 3 },
  { id: 'm6', topicId: 'music', question: 'Who is known as the "King of Pop"?', options: ['Elvis Presley', 'Michael Jackson', 'Prince', 'Freddie Mercury'], correctIndex: 1 },
  { id: 'm7', topicId: 'music', question: 'How many keys does a standard piano have?', options: ['66', '78', '88', '96'], correctIndex: 2 },
  { id: 'm8', topicId: 'music', question: 'Which band sang "Bohemian Rhapsody"?', options: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'], correctIndex: 1 },
  { id: 'm9', topicId: 'music', question: "What is the name of the main theme in Beethoven's 5th Symphony?", options: ['Ode to Joy', 'Fate motif', 'Moonlight', 'Eroica'], correctIndex: 1 },
  { id: 'm10', topicId: 'music', question: 'Which genre is Taylor Swift primarily known for?', options: ['Rock', 'Country/Pop', 'R&B', 'Electronic'], correctIndex: 1 },
];

// Biology
const biology: Question[] = [
  { id: 'b1', topicId: 'biology', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correctIndex: 2 },
  { id: 'b2', topicId: 'biology', question: 'How many chromosomes do humans have?', options: ['23', '46', '48', '44'], correctIndex: 1 },
  { id: 'b3', topicId: 'biology', question: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], correctIndex: 2 },
  { id: 'b4', topicId: 'biology', question: 'Which blood type is the universal donor?', options: ['A', 'B', 'AB', 'O'], correctIndex: 3 },
  { id: 'b5', topicId: 'biology', question: 'What process do plants use to make food from sunlight?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correctIndex: 1 },
  { id: 'b6', topicId: 'biology', question: 'What is the smallest bone in the human body?', options: ['Femur', 'Stapes', 'Patella', 'Tibia'], correctIndex: 1 },
  { id: 'b7', topicId: 'biology', question: 'Which vitamin is produced when skin is exposed to sunlight?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correctIndex: 2 },
  { id: 'b8', topicId: 'biology', question: 'What is the scientific name for the study of fungi?', options: ['Botany', 'Mycology', 'Zoology', 'Virology'], correctIndex: 1 },
  { id: 'b9', topicId: 'biology', question: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correctIndex: 2 },
  { id: 'b10', topicId: 'biology', question: 'Which gas do humans primarily exhale?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correctIndex: 2 },
];

// History
const history: Question[] = [
  { id: 'h1', topicId: 'history', question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
  { id: 'h2', topicId: 'history', question: 'Who was the first president of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctIndex: 2 },
  { id: 'h3', topicId: 'history', question: 'The Great Wall of China was built primarily to protect against invasions from which group?', options: ['Mongols', 'Japanese', 'Romans', 'Persians'], correctIndex: 0 },
  { id: 'h4', topicId: 'history', question: 'In what year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], correctIndex: 2 },
  { id: 'h5', topicId: 'history', question: 'Who wrote the Declaration of Independence?', options: ['George Washington', 'Thomas Jefferson', 'John Adams', 'James Madison'], correctIndex: 1 },
  { id: 'h6', topicId: 'history', question: 'When did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correctIndex: 2 },
  { id: 'h7', topicId: 'history', question: 'Which empire built the Machu Picchu citadel?', options: ['Aztec', 'Maya', 'Inca', 'Olmec'], correctIndex: 2 },
  { id: 'h8', topicId: 'history', question: 'In what year did Columbus reach the Americas?', options: ['1490', '1492', '1494', '1500'], correctIndex: 1 },
  { id: 'h9', topicId: 'history', question: 'Who was the British Prime Minister during most of World War II?', options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'], correctIndex: 1 },
  { id: 'h10', topicId: 'history', question: 'Which ancient wonder was in Babylon?', options: ['Pyramids', 'Colossus', 'Hanging Gardens', 'Lighthouse'], correctIndex: 2 },
];

// Geography
const geography: Question[] = [
  { id: 'g1', topicId: 'geography', question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctIndex: 2 },
  { id: 'g2', topicId: 'geography', question: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctIndex: 1 },
  { id: 'g3', topicId: 'geography', question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'g4', topicId: 'geography', question: 'What is the largest country by area?', options: ['China', 'USA', 'Canada', 'Russia'], correctIndex: 3 },
  { id: 'g5', topicId: 'geography', question: 'Which desert is the largest in the world?', options: ['Sahara', 'Arabian', 'Antarctic', 'Gobi'], correctIndex: 2 },
  { id: 'g6', topicId: 'geography', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctIndex: 2 },
  { id: 'g7', topicId: 'geography', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
  { id: 'g8', topicId: 'geography', question: 'Mount Everest is located in which mountain range?', options: ['Alps', 'Andes', 'Himalayas', 'Rockies'], correctIndex: 2 },
  { id: 'g9', topicId: 'geography', question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correctIndex: 1 },
  { id: 'g10', topicId: 'geography', question: 'Which country has the most population?', options: ['India', 'China', 'USA', 'Indonesia'], correctIndex: 0 },
];

// Sports
const sports: Question[] = [
  { id: 'sp1', topicId: 'sports', question: 'How many players are on a soccer team on the field?', options: ['9', '10', '11', '12'], correctIndex: 2 },
  { id: 'sp2', topicId: 'sports', question: 'In which sport would you perform a "slam dunk"?', options: ['Volleyball', 'Basketball', 'Tennis', 'Badminton'], correctIndex: 1 },
  { id: 'sp3', topicId: 'sports', question: 'What color is the center of the Olympic flag?', options: ['Blue', 'Red', 'White', 'Yellow'], correctIndex: 2 },
  { id: 'sp4', topicId: 'sports', question: 'How many Grand Slam tournaments are there in tennis per year?', options: ['2', '3', '4', '5'], correctIndex: 2 },
  { id: 'sp5', topicId: 'sports', question: 'Which country has won the most FIFA World Cups?', options: ['Germany', 'Italy', 'Brazil', 'Argentina'], correctIndex: 2 },
  { id: 'sp6', topicId: 'sports', question: 'How many points is a touchdown worth in American football?', options: ['5', '6', '7', '8'], correctIndex: 1 },
  { id: 'sp7', topicId: 'sports', question: 'In which country did the modern Olympic Games begin in 1896?', options: ['France', 'Greece', 'UK', 'USA'], correctIndex: 1 },
  { id: 'sp8', topicId: 'sports', question: 'How many players are on a baseball team on the field?', options: ['8', '9', '10', '11'], correctIndex: 1 },
  { id: 'sp9', topicId: 'sports', question: 'Which sport uses a shuttlecock?', options: ['Tennis', 'Badminton', 'Squash', 'Table tennis'], correctIndex: 1 },
  { id: 'sp10', topicId: 'sports', question: 'What is the maximum break in snooker?', options: ['147', '155', '167', '180'], correctIndex: 0 },
];

// Movies
const movies: Question[] = [
  { id: 'mv1', topicId: 'movies', question: 'Who directed "Inception"?', options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Ridley Scott'], correctIndex: 1 },
  { id: 'mv2', topicId: 'movies', question: 'What year was the first "Star Wars" film released?', options: ['1975', '1976', '1977', '1978'], correctIndex: 2 },
  { id: 'mv3', topicId: 'movies', question: 'Which actor played Jack in "Titanic"?', options: ['Brad Pitt', 'Leonardo DiCaprio', 'Tom Cruise', 'Johnny Depp'], correctIndex: 1 },
  { id: 'mv4', topicId: 'movies', question: 'What is the highest-grossing film of all time (unadjusted)?', options: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Avatar: The Way of Water'], correctIndex: 3 },
  { id: 'mv5', topicId: 'movies', question: 'Which studio made "Frozen"?', options: ['DreamWorks', 'Pixar', 'Disney', 'Illumination'], correctIndex: 2 },
  { id: 'mv6', topicId: 'movies', question: 'Who played the Joker in "The Dark Knight"?', options: ['Jack Nicholson', 'Heath Ledger', 'Joaquin Phoenix', 'Jared Leto'], correctIndex: 1 },
  { id: 'mv7', topicId: 'movies', question: 'Which film won Best Picture at the 2020 Oscars?', options: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'], correctIndex: 1 },
  { id: 'mv8', topicId: 'movies', question: 'In "The Matrix", what color pill does Neo take?', options: ['Blue', 'Red', 'Green', 'Purple'], correctIndex: 1 },
  { id: 'mv9', topicId: 'movies', question: 'Which actor played Iron Man in the MCU?', options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'], correctIndex: 1 },
  { id: 'mv10', topicId: 'movies', question: 'What year was "Jurassic Park" released?', options: ['1991', '1992', '1993', '1994'], correctIndex: 2 },
];

// General
const general: Question[] = [
  { id: 'gen1', topicId: 'general', question: 'What is the largest mammal in the world?', options: ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], correctIndex: 1 },
  { id: 'gen2', topicId: 'general', question: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correctIndex: 2 },
  { id: 'gen3', topicId: 'general', question: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], correctIndex: 2 },
  { id: 'gen4', topicId: 'general', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2 },
  { id: 'gen5', topicId: 'general', question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Onion', 'Lime'], correctIndex: 1 },
  { id: 'gen6', topicId: 'general', question: 'How many sides does a hexagon have?', options: ['4', '5', '6', '7'], correctIndex: 2 },
  { id: 'gen7', topicId: 'general', question: 'What is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 1 },
  { id: 'gen8', topicId: 'general', question: 'In what unit is electric current measured?', options: ['Volts', 'Amperes', 'Ohms', 'Watts'], correctIndex: 1 },
  { id: 'gen9', topicId: 'general', question: 'How many continents does the equator pass through?', options: ['2', '3', '4', '5'], correctIndex: 1 },
  { id: 'gen10', topicId: 'general', question: 'What is the chemical symbol for silver?', options: ['Si', 'Sv', 'Ag', 'Sr'], correctIndex: 2 },
];

const allQuestions: Record<string, Question[]> = {
  science,
  music,
  biology,
  history,
  geography,
  sports,
  movies,
  general,
};

export function getQuestionsForTopic(topicId: string, count: number = 10): Question[] {
  const pool = allQuestions[topicId] ?? [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionsFromTopics(topicId1: string, topicId2: string, count: number = 10): Question[] {
  const pool1 = allQuestions[topicId1] ?? [];
  const pool2 = allQuestions[topicId2] ?? [];
  const seen = new Set<string>();
  
  const combined = [...pool1, ...pool2].filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  const shuffled = [...combined].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}