import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  Badge,
  BadgeButton,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    title: 'Workspace status',
    description: 'Card sizing, radius, and hierarchy from the design system.',
    active: 'Active',
    details: 'View details',
  },
  'zh-CN': {
    title: '工作区状态',
    description: '设计系统中的卡片尺寸、圆角与层级。',
    active: '运行中',
    details: '查看详情',
  },
} as const;

function OverviewExample() {
  const copy = useStoryTranslations(translations);
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Card pressable>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
          <CardAction>
            <Badge>{copy.active}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>EC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar>
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <BadgeButton variant="outline" onClick={() => undefined}>
            {copy.active}
          </BadgeButton>
        </CardContent>
        <CardFooter>
          <Button size="sm">{copy.details}</Button>
        </CardFooter>
      </Card>
      <Card size="sm">
        <CardContent>
          <Skeleton radius="sm" style={{ height: '1rem', width: '65%' }} />
          <Skeleton radius="xl" style={{ height: '4rem', marginTop: '.75rem' }} />
        </CardContent>
      </Card>
    </div>
  );
}

const meta = {
  title: 'Components/Data Display',
  component: Card,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem', maxWidth: '42rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { render: () => <OverviewExample /> };
