import { Button } from '@/components/ui/button';

interface KeyboardToolbarProps {
  label: string;
  keyboardLanguage: 'es' | 'en';
  onKeyboardLanguageChange: (lang: 'es' | 'en') => void;
  osMode: 'mac' | 'windows';
  onOsModeChange: (mode: 'mac' | 'windows') => void;
  nextPhraseLabel: string;
  onNextPhrase: () => void;
}

export default function KeyboardToolbar({
  label,
  keyboardLanguage,
  onKeyboardLanguageChange,
  osMode,
  onOsModeChange,
  nextPhraseLabel,
  onNextPhrase,
}: KeyboardToolbarProps) {
  return (
    <div className="flex justify-between items-center px-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <path d="M6 8h.01" />
          <path d="M10 8h.01" />
          <path d="M14 8h.01" />
          <path d="M18 8h.01" />
          <path d="M6 12h.01" />
          <path d="M18 12h.01" />
          <path d="M7 16h10" />
          <path d="M10 12h4" />
        </svg>
        <span>{label}</span>

        <div className="flex bg-muted border border-border rounded-lg p-0.5 h-6 gap-0.5 shadow-sm">
          <Button
            variant={keyboardLanguage === 'es' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-bold h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onKeyboardLanguageChange('es')}
          >
            ES
          </Button>
          <Button
            variant={keyboardLanguage === 'en' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-bold h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onKeyboardLanguageChange('en')}
          >
            EN
          </Button>
        </div>

        <div className="flex bg-muted border border-border rounded-lg p-0.5 h-6 gap-0.5 shadow-sm ml-2">
          <Button
            variant={osMode === 'windows' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-bold h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onOsModeChange('windows')}
          >
            WIN
          </Button>
          <Button
            variant={osMode === 'mac' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-bold h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onOsModeChange('mac')}
          >
            MAC
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-[10px] font-bold uppercase tracking-wider h-6 rounded-md px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-1.5 transition-all duration-200 group/btn"
        onClick={onNextPhrase}
      >
        <span>{nextPhraseLabel.replace('->', '').trim()}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/btn:translate-x-0.5 opacity-80">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
