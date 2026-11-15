import { useEffect, useState } from 'react';
import Trans from '../components/common/Trans';
import Loading from '../components/common/Loading';
import SidebarNav from '../components/grammar/SidebarNav';
import GrammarDetail from '../components/grammar/GrammarDetail';
import { useAsyncData } from '../hooks/useAsyncData';
import { useLanguage } from '../hooks/useLanguage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getGrammar } from '../services/dataService';

export default function Grammar() {
  const { learningLang } = useLanguage();
  const { data: list, loading } = useAsyncData(() => getGrammar(learningLang), [learningLang]);
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [learningLang]);
  useDocumentTitle('Vietninie • Ngữ pháp');

  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <div>
            <Trans k="grammar" as="h1" style={{ fontSize: '2rem', fontWeight: 800, marginTop: 6 }}>Hệ Thống Ngữ Pháp Trọng Điểm & Bài Tập Thực Hành</Trans>
          </div>
        </div>
        {loading || !list ? (
          <Loading />
        ) : (
          <div className="grammar-layout">
            <SidebarNav
              label="Grammar Topics List"
              items={list.map((g) => ({ key: g.id, label: `${g.id}. ${g.title}`, badge: g.level }))}
              activeIndex={active}
              onSelect={setActive}
            />
            <section>{list[active] && <GrammarDetail grammar={list[active]} total={list.length} />}</section>
          </div>
        )}
      </div>
    </section>
  );
}
