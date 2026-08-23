import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { navigationItems, sectionCopy, type Section } from '../app/navigation';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';

type ComingSoonSection = Exclude<Section, 'projects'>;

export function ComingSoonPage({ section }: { section: ComingSoonSection }) {
  const copy = sectionCopy[section];
  const icon = navigationItems.find((item) => item.id === section)?.icon ?? 'bolt';

  return (
    <Paper component="section" className="coming-soon" elevation={1}>
      <span className="coming-soon__icon">
        <Icon name={icon} size={30} />
      </span>
      <Eyebrow>Próximo hito</Eyebrow>
      <Typography component="h1" variant="h4">
        {copy.title}
      </Typography>
      <Typography component="p" variant="body1">
        {copy.description}
      </Typography>
    </Paper>
  );
}
