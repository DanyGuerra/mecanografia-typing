interface FocusOverlayProps {
  message: string;
}

export default function FocusOverlay({ message }: FocusOverlayProps) {
  return (
    <div className="absolute inset-0 pb-6 bg-background/85 backdrop-blur-[2px] rounded-xl flex justify-center items-center z-10 border border-border animate-fade-in">
      <div className="flex flex-col items-center gap-2.5 text-muted-foreground text-sm font-medium text-center p-5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60 animate-bounce">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <line x1="6" y1="8" x2="6" y2="8" />
          <line x1="10" y1="8" x2="10" y2="8" />
          <line x1="14" y1="8" x2="14" y2="8" />
          <line x1="18" y1="8" x2="18" y2="8" />
          <line x1="6" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="18" y2="12" />
          <line x1="7" y1="16" x2="17" y2="16" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
