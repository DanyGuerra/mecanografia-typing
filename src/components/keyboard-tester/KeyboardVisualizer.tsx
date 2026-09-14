'use client';

import React, { memo } from 'react';
import Key from '../Key';
import { Sparkles } from 'lucide-react';
import {
  KeyConfig,
  LayoutMode,
  KeyboardLanguage,
} from './types';
import {
  FUNCTION_ROW,
  F_ROW_NAV_KEYS,
} from './layouts';

interface KeyboardVisualizerProps {
  layoutMode: LayoutMode;
  keyboardLanguage: KeyboardLanguage;
  currentAlphanumericLayout: KeyConfig[][];
  currentlyPressedKeys: Set<string>;
  testedKeys: Set<string>;
  capsLockActive: boolean;
  numLockActive: boolean;
  scrollLockActive: boolean;
}

function KeyboardVisualizer({
  layoutMode,
  keyboardLanguage,
  currentAlphanumericLayout,
  currentlyPressedKeys,
  testedKeys,
  capsLockActive,
  numLockActive,
  scrollLockActive,
}: KeyboardVisualizerProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 select-none">
      <div
        className={`keyboard-case overflow-hidden p-3 xl:p-4 shadow-xl ${
          layoutMode === 'compact60'
            ? 'max-w-[885px] mx-auto w-full'
            : layoutMode === 'compact'
            ? 'max-w-[940px] mx-auto w-full'
            : 'min-w-[760px] lg:min-w-0 w-full'
        }`}
      >
        <div className="keyboard-surface w-full p-2.5 xl:p-3.5 flex flex-col gap-[5px]">
          {/* 1. FUNCTION ROW (TKL & Full layouts) */}
          {(layoutMode === 'tkl' || layoutMode === 'full') && (
            <div className="flex gap-4 w-full mb-1">
              {/* Esc + F1-F12 block */}
              <div className="flex items-center gap-[4px] flex-1 min-w-0">
                {/* Esc */}
                <div className="w-[52px] shrink-0">
                  <Key
                    code={FUNCTION_ROW[0].code}
                    label={FUNCTION_ROW[0].label}
                    isPressed={currentlyPressedKeys.has(FUNCTION_ROW[0].code)}
                    isTested={testedKeys.has(FUNCTION_ROW[0].code)}
                  />
                </div>

                {/* Gap after Esc */}
                <div className="w-2 sm:w-4 shrink-0" />

                {/* F1-F4 */}
                <div className="flex gap-[4px] flex-1 min-w-0">
                  {FUNCTION_ROW.slice(1, 5).map((k) => (
                    <Key
                      key={k.code}
                      code={k.code}
                      label={k.label}
                      isPressed={currentlyPressedKeys.has(k.code)}
                      isTested={testedKeys.has(k.code)}
                    />
                  ))}
                </div>

                {/* Gap after F4 */}
                <div className="w-2 sm:w-3 shrink-0" />

                {/* F5-F8 */}
                <div className="flex gap-[4px] flex-1 min-w-0">
                  {FUNCTION_ROW.slice(5, 9).map((k) => (
                    <Key
                      key={k.code}
                      code={k.code}
                      label={k.label}
                      isPressed={currentlyPressedKeys.has(k.code)}
                      isTested={testedKeys.has(k.code)}
                    />
                  ))}
                </div>

                {/* Gap after F8 */}
                <div className="w-2 sm:w-3 shrink-0" />

                {/* F9-F12 */}
                <div className="flex gap-[4px] flex-1 min-w-0">
                  {FUNCTION_ROW.slice(9, 13).map((k) => (
                    <Key
                      key={k.code}
                      code={k.code}
                      label={k.label}
                      isPressed={currentlyPressedKeys.has(k.code)}
                      isTested={testedKeys.has(k.code)}
                    />
                  ))}
                </div>
              </div>

              {/* PrtSc, ScrLk, Pause (aligned above nav cluster) */}
              <div className="grid grid-cols-3 gap-[4px] w-[128px] xs:w-[140px] sm:w-[140px] md:w-[164px] shrink-0">
                {F_ROW_NAV_KEYS.map((k) => (
                  <Key
                    key={k.code}
                    code={k.code}
                    label={k.label}
                    isPressed={currentlyPressedKeys.has(k.code)}
                    isTested={testedKeys.has(k.code)}
                  />
                ))}
              </div>

              {/* Numpad top status plate in Full layout */}
              {layoutMode === 'full' && (
                <div className="w-[172px] xs:w-[188px] sm:w-[188px] md:w-[220px] shrink-0 h-10 xs:h-11 sm:h-11 md:h-[52px] rounded-xl border border-border/70 bg-card/60 px-3 py-1 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`size-2 rounded-full transition-all duration-200 ${
                          numLockActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-muted-foreground/25'
                        }`}
                      />
                      <span className="text-[8px] font-black tracking-wider text-muted-foreground">NUM</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`size-2 rounded-full transition-all duration-200 ${
                          capsLockActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-muted-foreground/25'
                        }`}
                      />
                      <span className="text-[8px] font-black tracking-wider text-muted-foreground">CAPS</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`size-2 rounded-full transition-all duration-200 ${
                          scrollLockActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-muted-foreground/25'
                        }`}
                      />
                      <span className="text-[8px] font-black tracking-wider text-muted-foreground">SCR</span>
                    </div>
                  </div>
                  <span className="text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground tracking-widest border border-border/50">
                    100% PRO
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. MAIN KEYBOARD + NAV CLUSTER + NUMPAD */}
          <div className="flex gap-4 w-full items-start">
            {/* Column 1: Main Alphanumeric Block (5 rows) */}
            <div className="flex flex-col gap-[5px] flex-1 min-w-0">
              {currentAlphanumericLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-[4px] w-full items-center justify-between">
                  {row.map((key) => {
                    const isKeyPressed =
                      key.code === 'CapsLock'
                        ? capsLockActive || currentlyPressedKeys.has('CapsLock')
                        : currentlyPressedKeys.has(key.code);

                    const isKeyTested = testedKeys.has(key.code);

                    return (
                      <Key
                        key={key.code}
                        code={key.code}
                        label={key.label}
                        shiftLabel={key.shiftLabel}
                        widthUnit={key.widthUnit}
                        flexGrow={key.flexGrow}
                        isPressed={isKeyPressed}
                        isTested={isKeyTested}
                        isCapsLockActive={capsLockActive && key.code === 'CapsLock'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Column 2: Navigation Cluster Block (TKL & Full) */}
            {(layoutMode === 'tkl' || layoutMode === 'full') && (
              <div className="flex flex-col gap-[5px] w-[128px] xs:w-[140px] sm:w-[140px] md:w-[164px] shrink-0">
                {/* Row 0: Ins, Home, PgUp */}
                <div className="grid grid-cols-3 gap-[4px] w-full">
                  <Key code="Insert" label="Ins" isPressed={currentlyPressedKeys.has('Insert')} isTested={testedKeys.has('Insert')} />
                  <Key code="Home" label="Home" isPressed={currentlyPressedKeys.has('Home')} isTested={testedKeys.has('Home')} />
                  <Key code="PageUp" label="PgUp" isPressed={currentlyPressedKeys.has('PageUp')} isTested={testedKeys.has('PageUp')} />
                </div>

                {/* Row 1: Del, End, PgDn */}
                <div className="grid grid-cols-3 gap-[4px] w-full">
                  <Key code="Delete" label="Del" isPressed={currentlyPressedKeys.has('Delete')} isTested={testedKeys.has('Delete')} />
                  <Key code="End" label="End" isPressed={currentlyPressedKeys.has('End')} isTested={testedKeys.has('End')} />
                  <Key code="PageDown" label="PgDn" isPressed={currentlyPressedKeys.has('PageDown')} isTested={testedKeys.has('PageDown')} />
                </div>

                {/* Row 2: Spacer matching row height */}
                <div className="h-10 xs:h-11 sm:h-11 md:h-[52px] w-full" />

                {/* Dedicated Inverted-T Arrow Cluster (Rows 3 & 4) */}
                <div className="flex flex-col gap-[5px] w-full">
                  {/* Row 3: Spacer, ArrowUp, Spacer */}
                  <div className="grid grid-cols-3 gap-[4px] w-full">
                    <div />
                    <Key
                      code="ArrowUp"
                      label="▲"
                      isPressed={currentlyPressedKeys.has('ArrowUp')}
                      isTested={testedKeys.has('ArrowUp')}
                    />
                    <div />
                  </div>

                  {/* Row 4: ArrowLeft, ArrowDown, ArrowRight */}
                  <div className="grid grid-cols-3 gap-[4px] w-full">
                    <Key
                      code="ArrowLeft"
                      label="◀"
                      isPressed={currentlyPressedKeys.has('ArrowLeft')}
                      isTested={testedKeys.has('ArrowLeft')}
                    />
                    <Key
                      code="ArrowDown"
                      label="▼"
                      isPressed={currentlyPressedKeys.has('ArrowDown')}
                      isTested={testedKeys.has('ArrowDown')}
                    />
                    <Key
                      code="ArrowRight"
                      label="▶"
                      isPressed={currentlyPressedKeys.has('ArrowRight')}
                      isTested={testedKeys.has('ArrowRight')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Column 3: Numpad Block (Full 100% only) */}
            {layoutMode === 'full' && (
              <div
                className="grid grid-cols-4 gap-[4px] w-[172px] xs:w-[188px] sm:w-[188px] md:w-[220px] shrink-0"
                style={{ gridAutoRows: 'minmax(0, 1fr)' }}
              >
                {/* Row 0 */}
                <Key code="NumLock" label="NumLk" flexGrow={1} isPressed={currentlyPressedKeys.has('NumLock')} isTested={testedKeys.has('NumLock')} />
                <Key code="NumpadDivide" label="/" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadDivide')} isTested={testedKeys.has('NumpadDivide')} />
                <Key code="NumpadMultiply" label="*" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadMultiply')} isTested={testedKeys.has('NumpadMultiply')} />
                <Key code="NumpadSubtract" label="-" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadSubtract')} isTested={testedKeys.has('NumpadSubtract')} />

                {/* Row 1 */}
                <Key code="Numpad7" label="7" shiftLabel="Home" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad7')} isTested={testedKeys.has('Numpad7')} />
                <Key code="Numpad8" label="8" shiftLabel="↑" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad8')} isTested={testedKeys.has('Numpad8')} />
                <Key code="Numpad9" label="9" shiftLabel="PgUp" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad9')} isTested={testedKeys.has('Numpad9')} />
                <div className="row-span-2 h-full flex flex-col">
                  <Key code="NumpadAdd" label="+" heightUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadAdd')} isTested={testedKeys.has('NumpadAdd')} />
                </div>

                {/* Row 2 */}
                <Key code="Numpad4" label="4" shiftLabel="←" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad4')} isTested={testedKeys.has('Numpad4')} />
                <Key code="Numpad5" label="5" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad5')} isTested={testedKeys.has('Numpad5')} />
                <Key code="Numpad6" label="6" shiftLabel="→" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad6')} isTested={testedKeys.has('Numpad6')} />

                {/* Row 3 */}
                <Key code="Numpad1" label="1" shiftLabel="End" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad1')} isTested={testedKeys.has('Numpad1')} />
                <Key code="Numpad2" label="2" shiftLabel="↓" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad2')} isTested={testedKeys.has('Numpad2')} />
                <Key code="Numpad3" label="3" shiftLabel="PgDn" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad3')} isTested={testedKeys.has('Numpad3')} />
                <div className="row-span-2 h-full flex flex-col">
                  <Key code="NumpadEnter" label="↵" heightUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadEnter')} isTested={testedKeys.has('NumpadEnter')} />
                </div>

                {/* Row 4 */}
                <div className="col-span-2 flex">
                  <Key code="Numpad0" label="0" shiftLabel="Ins" widthUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad0')} isTested={testedKeys.has('Numpad0')} />
                </div>
                <Key code="NumpadDecimal" label="." shiftLabel="Del" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadDecimal')} isTested={testedKeys.has('NumpadDecimal')} />
              </div>
            )}
          </div>

          {/* Fn Layer Arrow status for pure 60% mode */}
          {layoutMode === 'compact60' && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/40 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
                <Sparkles className="size-3 text-primary" />
                {keyboardLanguage === 'es' ? 'Capa Flechas (Fn):' : 'Arrow Keys (Fn):'}
              </span>
              {(['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'] as const).map((arrowCode) => {
                const isPressed = currentlyPressedKeys.has(arrowCode);
                const isTested = testedKeys.has(arrowCode);
                const symbol =
                  arrowCode === 'ArrowLeft' ? '←' :
                  arrowCode === 'ArrowUp' ? '↑' :
                  arrowCode === 'ArrowDown' ? '↓' : '→';
                const label =
                  arrowCode === 'ArrowLeft' ? 'Left' :
                  arrowCode === 'ArrowUp' ? 'Up' :
                  arrowCode === 'ArrowDown' ? 'Down' : 'Right';

                return (
                  <div
                    key={arrowCode}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition-all duration-100 ${
                      isPressed
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-95'
                        : isTested
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-muted/60 text-muted-foreground border-border/60'
                    }`}
                  >
                    <span className="text-sm">{symbol}</span>
                    <span className="text-[10px] font-mono">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(KeyboardVisualizer);
