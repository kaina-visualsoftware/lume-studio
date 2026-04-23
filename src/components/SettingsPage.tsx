import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './Theme';
import { darkColors, lightColors } from '../types';
import { IconChevronDown } from './Icons';

interface SettingsPageProps {
  dateRange: 'today' | '7d' | '30d' | 'custom';
}

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
  colors: typeof darkColors;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, label, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} style={{ position: 'relative' }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 8, display: 'block' }}>{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: colors.bgTertiary,
          border: `1px solid ${isOpen ? colors.accent : colors.borderLight}`,
          borderRadius: 8,
          fontSize: 13,
          color: colors.text,
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          transition: 'border-color 0.15s',
        }}
      >
        <span>{selectedOption?.label}</span>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.2s',
        }}>
          <IconChevronDown size={16} color={colors.textMuted} />
        </span>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: colors.bgSecondary,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: 8,
          overflow: 'hidden',
          zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: option.value === value 
                  ? colors.accentMuted 
                  : hoveredOption === option.value 
                    ? colors.bgTertiary 
                    : 'transparent',
                border: 'none',
                fontSize: 13,
                color: option.value === value ? colors.accent : colors.textSecondary,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.15s',
              }}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <span style={{ color: colors.accent, fontSize: 11, fontWeight: 600 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const timezoneOptions = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Recife', label: 'Recife (GMT-3)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
];

const currencyOptions = [
  { value: 'BRL', label: 'Real Brasileiro (R$)' },
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'Libra Esterlina (£)' },
];

const languageOptions = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es', label: 'Español' },
];

const themeOptions = [
  { value: 'light', label: '☀️ Claro' },
  { value: 'dark', label: '🌙 Escuro' },
  { value: 'system', label: '💻 Sistema' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ dateRange: _dateRange }) => {
  const { theme, setTheme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  
  const [storeName, setStoreName] = useState('LUME Studio');
  const [storeEmail, setStoreEmail] = useState('contato@lumestudio.com');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [currency, setCurrency] = useState('BRL');
  const [language, setLanguage] = useState('pt-BR');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Configurações</h1>
        <p style={{ fontSize: 14, color: colors.textMuted }}>Gerencie as configurações da sua loja</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: colors.bgSecondary, borderRadius: 12, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text }}>Informações da Loja</h2>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 8, display: 'block' }}>Nome da Loja</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                style={{ width: '100%', padding: '12px 14px', background: colors.bgTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 13, color: colors.text, outline: 'none' }}
                placeholder="Nome da sua loja"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 8, display: 'block' }}>Email de Contato</label>
              <input 
                type="email" 
                value={storeEmail} 
                onChange={(e) => setStoreEmail(e.target.value)} 
                style={{ width: '100%', padding: '12px 14px', background: colors.bgTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 8, fontSize: 13, color: colors.text, outline: 'none' }}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <CustomSelect 
                label="Idioma" 
                value={language}
                options={languageOptions}
                onChange={setLanguage}
                colors={colors}
              />
            </div>
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text }}>Regional</h2>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <CustomSelect 
                label="Fuso Horário" 
                value={timezone}
                options={timezoneOptions}
                onChange={setTimezone}
                colors={colors}
              />
            </div>
            <div>
              <CustomSelect 
                label="Moeda" 
                value={currency}
                options={currencyOptions}
                onChange={setCurrency}
                colors={colors}
              />
            </div>
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text }}>Notificações</h2>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px solid ${colors.borderLight}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>Notificações por Email</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Receba notificações sobre novos pedidos</div>
              </div>
              <button 
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                style={{ width: 44, height: 24, borderRadius: 12, background: emailNotifs ? colors.accent : colors.bgTertiary, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              >
                <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', transition: 'transform 0.2s', transform: emailNotifs ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>Atualizações de Pedidos</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Notificações sobre mudanças de status</div>
              </div>
              <button 
                type="button"
                onClick={() => setOrderNotifs(!orderNotifs)}
                style={{ width: 44, height: 24, borderRadius: 12, background: orderNotifs ? colors.accent : colors.bgTertiary, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              >
                <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', transition: 'transform 0.2s', transform: orderNotifs ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>Emails de Marketing</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Promoções e novidades</div>
              </div>
              <button 
                type="button"
                onClick={() => setMarketingEmails(!marketingEmails)}
                style={{ width: 44, height: 24, borderRadius: 12, background: marketingEmails ? colors.accent : colors.bgTertiary, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              >
                <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', transition: 'transform 0.2s', transform: marketingEmails ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: colors.bgSecondary, borderRadius: 12, border: `1px solid ${colors.borderLight}` }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.text }}>Aparência</h2>
          </div>
          <div style={{ padding: 24 }}>
            <CustomSelect 
              label="Tema" 
              value={theme}
              options={themeOptions}
              onChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
              colors={colors}
            />
          </div>
        </div>

        <div style={{ border: `1px solid ${colors.error}`, borderRadius: 12, background: `${colors.error}08` }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.error}30` }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: colors.error }}>Zona de Perigo</h2>
          </div>
          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
              Uma vez excluída, sua loja não pode ser recuperada. Todos os dados serão perdidos permanentemente.
            </p>
            <button type="button" style={{ padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: colors.error, color: '#FFFFFF', transition: 'opacity 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Excluir Loja
            </button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 32 }}>LUME Studio v1.0.0</div>
    </div>
  );
};