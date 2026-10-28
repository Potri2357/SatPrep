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

        // Regular text: Parse tables, images, bold **text** and newlines
        const lines = part.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i].trim();

          // 1. Markdown Image: ![alt](url)
          const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            elements.push(
              <div key={`img-${index}-${i}`} className="my-3 flex flex-col items-center justify-center">
                <img
                  src={imgMatch[2]}
                  alt={imgMatch[1]}
                  className="max-h-72 w-auto max-w-full rounded-2xl border border-[#BCEBFC] bg-white p-2 shadow-2xs object-contain"
                />
                {imgMatch[1] && (
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 italic">
                    {imgMatch[1]}
                  </span>
                )}
              </div>
            );
            i++;
            continue;
          }

          // 2. Markdown Table: consecutive lines starting with '|'
          if (line.startsWith('|') && line.endsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
              tableLines.push(lines[i].trim());
              i++;
            }

            // Must have at least header + separator or row
            if (tableLines.length >= 2) {
              const parseRow = (r: string) =>
                r
                  .split('|')
                  .slice(1, -1)
                  .map((c) => c.trim());

              const headerCells = parseRow(tableLines[0]);
              // Check if 2nd line is separator like |:---|---:|
              const hasSep = /^\|[\s:\-|\s]+\|$/.test(tableLines[1]);
              const bodyRows = tableLines.slice(hasSep ? 2 : 1).map(parseRow);

              elements.push(
                <div key={`table-${index}-${i}`} className="my-3 overflow-x-auto rounded-xl border border-[#BCEBFC] shadow-2xs">
                  <table className="w-full text-left text-[11.5px] border-collapse bg-white">
                    <thead>
                      <tr className="bg-[#F0FAFF] border-b border-[#BCEBFC] text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                        {headerCells.map((h, hIdx) => (
                          <th key={hIdx} className="px-3 py-2 border-r border-[#BCEBFC]/60 last:border-r-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bodyRows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-[#F9FDFF]' : 'bg-white'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 text-slate-800 border-r border-slate-100 last:border-r-0 font-medium">
                              {cell.startsWith('**') && cell.endsWith('**') ? (
                                <strong className="font-bold text-slate-900">{cell.slice(2, -2)}</strong>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
              continue;
            }
          }

          // 3. Regular text line: parse bold **text**
          const boldSegments = lines[i].split(/(\*\*.*?\*\*)/g);
          elements.push(
            <React.Fragment key={`line-${index}-${i}`}>
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
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          );
          i++;
        }

        return <span key={index}>{elements}</span>;
      });
    } catch {
      return content;
    }
  }, [content, displayMode]);

  return <div className={`math-content leading-relaxed ${className}`}>{renderedContent}</div>;
};
