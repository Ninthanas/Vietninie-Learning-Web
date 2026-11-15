import { useState } from 'react';
import Trans from '../components/common/Trans';
import Loading from '../components/common/Loading';
import SidebarNav from '../components/grammar/SidebarNav';
import DialogueStream from '../components/grammar/DialogueStream';
import { useAsyncData } from '../hooks/useAsyncData';
import { useLanguage } from '../hooks/useLanguage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getConversations } from '../services/dataService';

export default function Conversation() {
  const { isLearningZh } = useLanguage();
  const { data: list, loading } = useAsyncData(() => getConversations(), []);
  const [active, setActive] = useState(0);
  useDocumentTitle('Vietninie • Hội thoại');

  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <div>
            <Trans k="conversation" as="h1" style={{ fontSize: '2rem', fontWeight: 800, marginTop: 6 }}>17 Tình Huống Hội Thoại Giao Tiếp Đời Sống & Thương Mại</Trans>
          </div>
        </div>
        {loading || !list ? (
          <Loading />
        ) : (
          <div className="grammar-layout">
            <SidebarNav
              label="Conversation Scenarios"
              badgeVariant="jade"
              items={list.map((c, i) => ({ key: i, label: isLearningZh ? c.title_vi : c.title_zh, badge: c.level.split('/')[0] }))}
              activeIndex={active}
              onSelect={setActive}
            />
            <section>{list[active] && <DialogueStream conversation={list[active]} />}</section>
          </div>
        )}
      </div>
    </section>
  );
}
