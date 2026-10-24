'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  displayMode?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  displayMode = false,
}) => {
  const renderedContent = useMemo(() => {
    if (!content) return '';

    try {
      // Split by double dollar ($$) for display math and single dollar ($) for inline math
      const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

      return parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={index}>{part}</span>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={index}>{part}</span>;
          }
        } else {
          // Render newlines as line breaks
          return (
            <span key={index}>
              {part.split('\n').map((line, lIdx, arr) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        }
      });
    } catch {
      return content;
    }
  }, [content]);

  return <div className={`math-content leading-relaxed ${className}`}>{renderedContent}</div>;
};
