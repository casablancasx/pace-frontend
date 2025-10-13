import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import pautaService from '../../services/pautaService';
import type { OrgaoJulgadorResponse } from '../../services/pautaService';
import './OrgaoJulgadorAutocomplete.css';

interface OrgaoJulgadorAutocompleteProps {
  value: string;
  uf: string;
  onChange: (newValue: string) => void;
  onSelect?: (orgaoJulgador: OrgaoJulgadorResponse) => void;
  placeholder?: string;
  minLength?: number;
  disabled?: boolean;
}

const DEFAULT_MIN_LENGTH = 3;
const DEBOUNCE_DELAY = 400;

const OrgaoJulgadorAutocomplete: React.FC<OrgaoJulgadorAutocompleteProps> = ({
  value,
  uf,
  onChange,
  onSelect,
  placeholder = 'Digite o nome do órgão julgador',
  minLength = DEFAULT_MIN_LENGTH,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);
  const [options, setOptions] = useState<OrgaoJulgadorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const normalizedValue = value.trim();
  const shouldSearch = normalizedValue.length >= minLength && uf !== '';

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (!shouldSearch || disabled) {
      setOptions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await pautaService.listarOrgaosJulgadores(uf, normalizedValue);
        setOptions(Array.isArray(response) ? response : []);
        setIsOpen(true);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Erro ao buscar órgão julgador:', err);
        setError('Não foi possível carregar os órgãos julgadores.');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedValue, uf, shouldSearch, disabled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: OrgaoJulgadorResponse) => {
    skipNextFetch.current = true;
    onChange(option.nome);
    setIsOpen(false);
    setHighlightIndex(-1);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < options.length) {
          handleOptionSelect(options[highlightIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const showDropdown = isOpen && (loading || error || options.length > 0);

  return (
    <div className="orgao-julgador-autocomplete" ref={containerRef}>
      <div className={`autocomplete-input-wrapper ${disabled ? 'disabled' : ''}`}>
        <Search className="autocomplete-icon" size={18} />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={uf ? placeholder : 'Selecione primeiro a UF'}
          disabled={disabled || !uf}
          className="autocomplete-input"
        />
        {loading && <Loader2 className="autocomplete-spinner" size={18} />}
      </div>

      {showDropdown && (
        <div className="autocomplete-dropdown">
          {loading && (
            <div className="autocomplete-status">Buscando...</div>
          )}
          {error && (
            <div className="autocomplete-error">{error}</div>
          )}
          {!loading && !error && options.length === 0 && shouldSearch && (
            <div className="autocomplete-status">Nenhum órgão julgador encontrado</div>
          )}
          {!loading && !error && options.length > 0 && (
            <>
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className={`autocomplete-option ${index === highlightIndex ? 'active' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <div className="option-content">
                    <div className="option-name">{option.nome}</div>
                    <div className="option-uf">{option.uf}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrgaoJulgadorAutocomplete;
