import Trans from '../common/Trans';
import Button from '../common/Button';
import VocabCard from '../vocabulary/VocabCard';

export default function VocabPreview({ items }) {
  return (
    <section className="section-block" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <Trans k="vocabPreviewTitle" as="h2">Khám phá kho từ vựng thực chiến</Trans>
            <p>Bấm vào 🔊 để nghe phát âm trực tiếp hoặc xem chi tiết từ vựng</p>
          </div>
          <Button to="/vocabulary" variant="outline"><Trans k="viewAllVocab">Xem tất cả từ vựng →</Trans></Button>
        </div>
        <div className="vocab-grid">
          {items.slice(0, 4).map((item) => <VocabCard key={item.id} item={item} variant="preview" />)}
        </div>
      </div>
    </section>
  );
}
