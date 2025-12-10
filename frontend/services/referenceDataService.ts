import { TopicSelection } from "@/models/topicSelection";

export async function getAvailableTopics(): Promise<TopicSelection[]> {
  /*
  const reponse = await fetch('https://opentdb.com/api_category.php');
  if(reponse.ok) {
    const data = await reponse.json();
    return data;
  }
  else {
    throw new Error('Failed to fetch topics');
  }
  */
  return [
    {name: "Science", isFavorite: false},
    {name: "History", isFavorite: false},
    {name: "Sport", isFavorite: false},
    {name: "Movie", isFavorite: false},
  ];
}