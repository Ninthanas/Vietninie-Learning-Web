// ============================================================================
// DATA SERVICE — datasets come from the Spring Boot API on localhost, otherwise from
// code-split JSON loaded on demand (cached).
// ============================================================================
import topics from '../data/topics.json';
import { fetchDataset } from './api';

const loaders = {
  zhVocab: () => import('../data/chinese-vocabulary.json'),
  viVocab: () => import('../data/vietnamese-vocabulary.json'),
  zhGrammar: () => import('../data/chinese-grammar.json'),
  viGrammar: () => import('../data/vietnamese-grammar.json'),
  conversations: () => import('../data/conversations.json'),
  specialized: () => import('../data/specialized-vocabulary.json')
};

// Spring Boot endpoints (used on localhost); the bundled JSON is the fallback when the API is down.
const endpoints = {
  zhVocab: '/api/vocabulary/zh',
  viVocab: '/api/vocabulary/vi',
  zhGrammar: '/api/grammar/zh',
  viGrammar: '/api/grammar/vi',
  conversations: '/api/conversations',
  specialized: '/api/specialized'
};

const cache = new Map();
function load(name) {
  if (!cache.has(name)) {
    cache.set(
      name,
      fetchDataset(endpoints[name]).then((remote) => remote || loaders[name]().then((m) => m.default))
    );
  }
  return cache.get(name);
}

export const getBaseVocabulary = (dir) => load(dir === 'zh' ? 'zhVocab' : 'viVocab');
export const getGrammar = (dir) => load(dir === 'zh' ? 'zhGrammar' : 'viGrammar');
export const getConversations = () => load('conversations');
export const getSpecializedData = () => load('specialized');
export const getTopics = () => topics;
