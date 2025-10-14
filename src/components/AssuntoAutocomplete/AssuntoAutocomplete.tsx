import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import pautaService from '../../services/pautaService';
import './AssuntoAutocomplete.css';

interface AssuntoAutocompleteProps {
  value: string;
  onChange: (newValue: string) => void;
  onSelect: (assunto: { assuntoId: number; assunto: string }) => void;
  placeholder?: string;
  minLength?: number;
  disabled?: boolean;
}

const DEFAULT_MIN_LENGTH = 3;
const DEBOUNCE_DELAY = 400;

const AssuntoAutocomplete: React.FC<AssuntoAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Digite o assunto',
  minLength = DEFAULT_MIN_LENGTH,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);
  const [options, setOptions] = useState<Array<{ assuntoId: number; assunto: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const normalizedValue = value.trim();
  const shouldSearch = normalizedValue.length >= minLength;

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
        const response = await pautaService.listarAssuntos(normalizedValue);
        setOptions(Array.isArray(response) ? response : []);
        setIsOpen(true);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Erro ao buscar assuntos:', err);
        setError('Não foi possível carregar os assuntos.');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedValue, shouldSearch, disabled]);

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

  const handleOptionSelect = (option: { assuntoId: number; assunto: string }) => {
    skipNextFetch.current = true;
    onSelect(option);
    setIsOpen(false);
  };

  const highlightedOptions = useMemo(() => {
    const searchTerms = normalizedValue.toUpperCase().split(/\s+/).filter(Boolean);

    return options.map((option) => {
      const assuntoText = option.assunto ?? '';

      const highlightedText = searchTerms.reduce((acc, term) => {
        const regex = new RegExp(`(${term})`, 'gi');
        return acc.replace(regex, '<mark>$1</mark>');
      }, assuntoText);

      return {
        raw: option,
        assuntoId: option.assuntoId,
        assunto: assuntoText,
        highlightedText,
      };
    });
  }, [options, normalizedValue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !highlightedOptions.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % highlightedOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + highlightedOptions.length) % highlightedOptions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = highlightedOptions[highlightIndex]?.raw;
      if (option) {
        handleOptionSelect(option);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="assunto-autocomplete" ref={containerRef}>
      <div className={`autocomplete-input-wrapper ${disabled ? 'disabled' : ''}`}>
        <Search className="autocomplete-icon" size={16} />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => shouldSearch && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="autocomplete-input"
        />
        {loading && <Loader2 className="autocomplete-spinner" size={16} />}
      </div>

      {error && <div className="autocomplete-error">{error}</div>}

      {isOpen && (highlightedOptions.length > 0 || loading) && (
        <div className="autocomplete-dropdown">
          {loading && <div className="autocomplete-status">Carregando...</div>}

          {!loading && highlightedOptions.map((option, index) => (
            <button
              key={option.assuntoId}
              type="button"
              className={`autocomplete-option ${index === highlightIndex ? 'active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleOptionSelect(option.raw)}
            >
              <span
                className="option-name"
                dangerouslySetInnerHTML={{ __html: option.highlightedText }}
              />
            </button>
          ))}

          {!loading && !highlightedOptions.length && (
            <div className="autocomplete-status">Nenhum assunto encontrado.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssuntoAutocomplete;
