/** Per-topic progress used by the home "continue" card and the vocabulary topic grid. */
export function topicStats(topics, items, learned) {
  const byTopic = new Map();
  for (const it of items) {
    const key = it.topic_key || it.topic;
    if (!byTopic.has(key)) byTopic.set(key, []);
    byTopic.get(key).push(it);
  }
  return topics
    .map((topic) => {
      const list = byTopic.get(topic.key) || [];
      const done = list.filter((i) => learned.has(i.id)).length;
      return {
        topic,
        total: list.length,
        done,
        pct: list.length ? Math.round((done / list.length) * 100) : 0,
        samples: list.slice(0, 3).map((i) => i.word)
      };
    })
    .filter((s) => s.total > 0);
}

/** "3. Gia đình" -> "Gia đình". */
export const cleanTopicName = (name = '') => name.replace(/^\s*\d+\s*[.、]\s*/, '');
