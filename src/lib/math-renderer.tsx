'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

/**
 * Enhanced MathRenderer that accurately parses and renders:
 * 1. LaTeX display equations: $$...$$ and \[...\]
 * 2. LaTeX inline math: $...$ and \(...\)
 * 3. Markdown bold syntax: **text**
 * 4. Line breaks
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  displayMode = false,
}) => {
  const renderedContent = useMemo(() => {
    if (!content) return null;

    try {
      // Normalize delimiters: convert \[...\] to $$...$$ and \(...\) to $...$
      let normalized = content
        .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
        .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

      // Split into math chunks and regular text
      // Matches $$...$$ (display) or $...$ (inline, without trailing currency symbols)
      const parts = normalized.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

      return parts.map((part, index) => {
        if (!part) return null;

        // Display math ($$...$$)
        if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
              strict: false,
            });
            return (
              <div
                key={index}
                className="my-3 overflow-x-auto py-1 text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={index} className="text-red-600">{part}</code>;
          }
        }

        // Inline math ($...$)
        if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: displayMode,
              throwOnError: false,
              strict: false,
            });
            return (
              <span
                key={index}
                className="inline-math px-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={index} className="text-red-600">{part}</code>;
          }
        }

        // Regular text: Parse bold **text** and newlines
        return (
          <span key={index}>
            {part.split('\n').map((line, lIdx, lineArr) => {
              // Parse markdown bold **bold text**
              const boldSegments = line.split(/(\*\*.*?\*\*)/g);
              return (
                <React.Fragment key={lIdx}>
                  {boldSegments.map((segment, sIdx) => {
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                      return (
                        <strong key={sIdx} className="font-bold text-slate-900">
                          {segment.slice(2, -2)}
                        </strong>
                      );
                    }
                    return segment;
                  })}
                  {lIdx < lineArr.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </span>
        );
      });
    } catch {
      return content;
    }
  }, [content, displayMode]);

  return <div className={`math-content leading-relaxed ${className}`}>{renderedContent}</div>;
};
