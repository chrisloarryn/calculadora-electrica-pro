import { navigationItems, sectionCopy, type Section } from '../app/navigation';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';

type ComingSoonSection = Exclude<Section, 'projects'>;

export function ComingSoonPage({ section }: { section: ComingSoonSection }) {
  const copy = sectionCopy[section];
  const icon = navigationItems.find((item) => item.id === section)?.icon ?? 'bolt';

  return (
    <section className="coming-soon">
      <span className="coming-soon__icon">
        <Icon name={icon} size={30} />
      </span>
      <Eyebrow>Próximo hito</Eyebrow>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
    </section>
  );
}
