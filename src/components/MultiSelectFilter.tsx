import React, { useState, useEffect, useRef } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  colors: {
    bgSecondary: string;
    bgTertiary: string;
    borderLight: string;
    text: string;
    textMuted: string;
    accent: string;
  };
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selected,
  onChange,
  colors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (value === 'all') {
      onChange(['all']);
    } else {
      let newSelected: string[];
      if (selected.includes(value)) {
        newSelected = selected.filter(v => v !== value && v !== 'all');
      } else {
        newSelected = [...selected.filter(v => v !== 'all'), value];
      }
      onChange(newSelected.length === 0 ? ['all'] : newSelected);
    }
  };

  const getDisplayLabel = () => {
    if (selected.length === 0 || selected.includes('all')) return 'Todas';
    if (selected.length === 1) {
      const opt = options.find(o => o.value === selected[0]);
      return opt?.label || selected[0];
    }
    return `${selected.length} selecionados`;
  };

  const hasSelection = selected.length > 0 && !selected.includes('all');

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 8,
          border: `1px solid ${hasSelection ? colors.accent : colors.borderLight}`,
          background: hasSelection ? `${colors.accent}15` : colors.bgTertiary,
          fontSize: 12,
          fontWeight: 500,
          color: hasSelection ? colors.accent : colors.textMuted,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}:</span>
        <span style={{ color: hasSelection ? colors.text : colors.textMuted }}>{getDisplayLabel()}</span>
        {hasSelection && (
          <span
            style={{
              background: colors.accent,
              color: '#fff',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {selected.length}
          </span>
        )}
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            minWidth: 180,
            background: colors.bgSecondary,
            border: `1px solid ${colors.borderLight}`,
            borderRadius: 10,
            padding: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 100,
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {options.map(option => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = colors.bgTertiary)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `2px solid ${
                    selected.includes(option.value) ? colors.accent : colors.borderLight
                  }`,
                  background: selected.includes(option.value) ? colors.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.1s ease',
                }}
              >
                {selected.includes(option.value) && (
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: colors.text,
                  fontWeight: selected.includes(option.value) ? 500 : 400,
                }}
              >
                {option.label}
              </span>
            </label>
          ))}
          {hasSelection && (
            <div
              style={{
                borderTop: `1px solid ${colors.borderLight}`,
                marginTop: 4,
                paddingTop: 4,
              }}
            >
              <button
                onClick={() => onChange(['all'])}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 12,
                  color: colors.textMuted,
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderRadius: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = colors.bgTertiary)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;