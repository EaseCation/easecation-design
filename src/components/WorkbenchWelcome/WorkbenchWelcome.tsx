import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar';
import { Card } from '../Card';
import { ThemeProvider } from '../../theme/ThemeProvider';

export interface WorkbenchWelcomeProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  greeting?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  /** Decorative product artwork supplied by the application. */
  backgroundImage?: string;
  summary?: ReactNode;
  headingLevel?: 1 | 2;
}

function WelcomeAvatar({ name, src, alt }: { name: string; src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <Avatar>
      <AvatarFallback>{Array.from(name).slice(0, 2).join('')}</AvatarFallback>
      {src && !failed ? (
        <AvatarImage
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : null}
    </Avatar>
  );
}

/** Shared welcome composition; authentication, artwork and summary data stay in the host. */
export function WorkbenchWelcome({
  name,
  greeting = 'Welcome back,',
  avatarSrc,
  avatarAlt = '',
  backgroundImage,
  summary,
  headingLevel = 1,
  className,
  ...props
}: WorkbenchWelcomeProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const content = (
    <Card
      size="sm"
      className={['ec-workbench-welcome', className].filter(Boolean).join(' ')}
      {...props}
    >
      {backgroundImage ? (
        <>
          <img
            className="ec-workbench-welcome__art"
            src={backgroundImage}
            alt=""
            aria-hidden="true"
          />
          <div className="ec-workbench-welcome__shade" aria-hidden="true" />
        </>
      ) : null}
      <div className="ec-workbench-welcome__row">
        <div className="ec-workbench-welcome__person">
          <WelcomeAvatar
            key={`${name}:${avatarSrc ?? ''}`}
            name={name}
            src={avatarSrc}
            alt={avatarAlt}
          />
          <Heading>
            {greeting ? <small>{greeting}</small> : null}
            <span title={name}>{name}</span>
          </Heading>
        </div>
        {summary != null ? <div className="ec-workbench-welcome__summary">{summary}</div> : null}
      </div>
    </Card>
  );
  return backgroundImage ? <ThemeProvider mode="dark">{content}</ThemeProvider> : content;
}
