'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string | number;
  label: string;
  badge?: string;
  sublabel?: string;
}

interface CustomDropdownProps {
  value: string | number;
  onChange: (value: any) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
  triggerClassName,
  menuClassName,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative w-full text-xs', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full h-11 px-3.5 rounded-xl border border-blue-100 bg-white text-slate-800 text-xs font-medium',
          'flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs',
          'hover:border-blue-300 hover:bg-[#F8FAFC]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20 bg-white',
          disabled && 'opacity-50 cursor-not-allowed hover:border-blue-100',
          triggerClassName
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-slate-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-blue-600'
          )}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-1.5 z-50',
            'bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-xl shadow-blue-500/10',
            'p-1.5 max-h-64 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150',
            menuClassName
          )}
        >
          {options.length === 0 ? (
            <div className="p-3 text-center text-slate-400 text-xs">No options available</div>
          ) : (
            <div className="space-y-0.5">
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium cursor-pointer transition-colors',
                      'flex items-center justify-between gap-2',
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-slate-400 font-normal truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 font-mono">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
