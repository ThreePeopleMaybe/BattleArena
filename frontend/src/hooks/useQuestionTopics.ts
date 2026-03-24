import { useCallback, useState } from 'react';
import { getQuestionTopics, type QuestionTopicDto } from '../api/questionTopics';

export function useQuestionTopics() {
  const [topics, setTopics] = useState<QuestionTopicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const list = await getQuestionTopics();
      setTopics(list);
    } catch {
      setTopics([]);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { topics, loading, loadFailed, reload };
}