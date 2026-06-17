"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  commandMap,
  commands,
  UNKNOWN_LINE,
  type CaseMeta,
  type Output,
  type TerminalCtx,
} from "@/components/terminal/registry";
import { useAppStore } from "@/store/useAppStore";
import { useMotion } from "@/components/MotionProvider";
import { Crt } from "@/components/terminal/Crt";

const BOOT =
  "MOKSITE OS v1.0 — UNAUTHORIZED ACCESS DETECTED… just kidding. welcome, detective. type 'help' to begin.";
const PROMPT = "moksite@cmd:~$";
const TAP_ROW = ["help", "cases", "cv", "contact", "exit"];

type Entry = { input: string | null; output: Output };

export default function Terminal({ cases }: { cases: CaseMeta[] }) {
  const router = useRouter();
  const close = useAppStore((s) => s.closeTerminal);
  const toggleHighContrast = useAppStore((s) => s.toggleHighContrast);
  const { scrollTo } = useMotion();

  const [booted, setBooted] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  // mount: capture focus + lock scroll + boot timer; restore focus/scroll on close
  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const timer = window.setTimeout(() => setBooted(true), 1200);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries, booted]);

  const ctx: TerminalCtx = useMemo(
    () => ({
      close,
      clear: () => setEntries([]),
      navigate: (href) => {
        close();
        router.push(href);
      },
      downloadCv: () => {
        const a = document.createElement("a");
        a.href = "/cv.pdf";
        a.download = "";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
      scrollToSignal: () => {
        close();
        if (window.location.pathname === "/") scrollTo("#signal");
        else router.push("/#signal");
      },
      toggleTheme: toggleHighContrast,
      cases,
      commands: commands.map((c) => ({ name: c.name, description: c.description })),
    }),
    [cases, close, router, scrollTo, toggleHighContrast],
  );

  const runInput = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setEntries((p) => [...p, { input: "", output: [] }]);
      return;
    }
    setHistory((h) => [...h, trimmed]);
    setHistIdx(-1);
    const [name, ...args] = trimmed.split(/\s+/);
    const command = commandMap.get(name.toLowerCase());
    const output: Output = command ? await command.run(args, ctx) : [UNKNOWN_LINE];
    setEntries((p) => [...p, { input: trimmed, output }]);
    setInput("");
  };

  const complete = (raw: string) => {
    const current = raw.trim().toLowerCase();
    if (!current) return;
    const matches = commands.map((c) => c.name).filter((n) => n.startsWith(current));
    if (matches.length === 1) {
      setInput(`${matches[0]} `);
    } else if (matches.length > 1) {
      setEntries((p) => [
        ...p,
        { input: null, output: [{ kind: "text", text: matches.join("   "), tone: "rain" }] },
      ]);
    }
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void runInput(e.currentTarget.value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      complete(e.currentTarget.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = Math.min(history.length - 1, histIdx + 1);
      setHistIdx(idx);
      setInput(history[history.length - 1 - idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput("");
      } else {
        const idx = histIdx - 1;
        setHistIdx(idx);
        setInput(history[history.length - 1 - idx]);
      }
    }
  };

  // dialog-level: Esc always closes; any key skips boot; Tab traps focus (except
  // on the input, which uses Tab for completion and stops propagation).
  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (!booted) {
      setBooted(true);
      return;
    }
    if (e.key === "Tab" && e.target !== inputRef.current) {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command Center"
      tabIndex={-1}
      className="terminal-overlay"
      onKeyDown={onDialogKey}
    >
      <Crt>
        <div className="terminal-head">
          <span className="terminal-title">MOKSITE OS</span>
          <button type="button" className="terminal-close" aria-label="Close terminal" onClick={close}>
            ✕
          </button>
        </div>

        <div ref={logRef} className="terminal-log" aria-live="polite">
          <p className="terminal-boot">{BOOT}</p>
          {!booted && <p className="terminal-booting">booting… (press any key)</p>}
          {entries.map((entry, i) => (
            <div key={i} className="terminal-entry">
              {entry.input !== null && (
                <p className="terminal-echo">
                  <span className="terminal-prompt">{PROMPT}</span> {entry.input}
                </p>
              )}
              {entry.output.map((line, j) => {
                if (line.kind === "link") {
                  return (
                    <p key={j} className="terminal-out">
                      <a
                        href={line.href}
                        target={line.external ? "_blank" : undefined}
                        rel={line.external ? "noreferrer" : undefined}
                      >
                        {line.text}
                      </a>
                    </p>
                  );
                }
                if (line.kind === "ascii") {
                  return (
                    <pre key={j} className="terminal-ascii">
                      {line.text}
                    </pre>
                  );
                }
                return (
                  <p key={j} className={`terminal-out tone-${line.tone ?? "default"}`}>
                    {line.text}
                  </p>
                );
              })}
            </div>
          ))}
        </div>

        {booted && (
          <div className="terminal-taprow">
            {TAP_ROW.map((name) => (
              <button
                key={name}
                type="button"
                className="terminal-tap"
                onClick={() => void runInput(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <div className="terminal-input-row">
          <label htmlFor="terminal-input" className="terminal-prompt">
            {PROMPT}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            className="terminal-input"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="terminal input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKey}
          />
        </div>
      </Crt>
    </div>
  );
}
