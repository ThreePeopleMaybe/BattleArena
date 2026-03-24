import type { QuestionTopicDto } from '../../../api/questionTopics';

export interface TopicListItem {
  id: number;
  name: string;
  color: string;
}

export function topicListItemFromTopic(topic: QuestionTopicDto): TopicListItem {
  return {
    id: topic.id,
    name: topic.name,
    color: topicAccentColorForId(String(topic.id)),
  };
}

export function topicAccentColorForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = id.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}