"use client";

import { useEffect, useState } from "react";

interface TerminalTextProps {
  text: string[];
  className?: string;
  typing?: boolean;
  typingSpeed?: number;
  cursorBlink?: boolean;
}

export function TerminalText({
  text,
  className = "",
  typing = true,
  typingSpeed = 30,
  cursorBlink = true,
}: TerminalTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!typing) {
      setDisplayedLines(text);
      return;
    }

    if (currentLine < text.length) {
      if (currentChar < text[currentLine].length) {
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLine]) {
              newLines[currentLine] = "";
            }
            newLines[currentLine] = text[currentLine].substring(
              0,
              currentChar + 1
            );
            return newLines;
          });
          setCurrentChar(currentChar + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Move to next line
        const timer = setTimeout(() => {
          setCurrentLine(currentLine + 1);
          setCurrentChar(0);
        }, typingSpeed * 3);
        return () => clearTimeout(timer);
      }
    }
  }, [text, currentLine, currentChar, typing, typingSpeed]);

  // Blinking cursor effect
  useEffect(() => {
    if (!cursorBlink) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursorBlink]);

  return (
    <div className={`font-mono ${className}`}>
      {displayedLines.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
          {index === currentLine && typing && showCursor && (
            <span className="animate-blink">_</span>
          )}
        </div>
      ))}
      {currentLine === text.length && typing && showCursor && (
        <span className="animate-blink">_</span>
      )}
    </div>
  );
}
