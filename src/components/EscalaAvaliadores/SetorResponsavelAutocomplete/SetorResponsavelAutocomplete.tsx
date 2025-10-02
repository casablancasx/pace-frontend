import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import SuperSapiensService from '../../../services/SuperSapiensService';
import './SetorResponsavelAutocomplete.css';

interface SetorResponsavelAutocompleteProps {
  value: string;
  onChange: (novoValor: string) => void;
  onSelect: (setor: any) => void;
  placeholder?: string;
  minLength?: number;
  disabled?: boolean;
  unidadeId?: string | number;
}

const DEFAULT_MIN_LENGTH = 2;
const DEBOUNCE_DELAY = 350;

const SetorResponsavelAutocomplete: React.FC<SetorResponsavelAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Digite o setor responsável',
  minLength = DEFAULT_MIN_LENGTH,
  disabled = false,
  unidadeId = '9',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const normalizedValue = value.trim();
  const shouldSearch = normalizedValue.length >= minLength;

  useEffect(() => {
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
        const response = await SuperSapiensService.getSetoresResponsaveis(normalizedValue, unidadeId);
        setOptions(Array.isArray(response) ? response : []);
        setIsOpen(true);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Erro ao buscar setores responsáveis:', err);
        setError('Não foi possível carregar os setores.');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedValue, shouldSearch, disabled, unidadeId]);

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

  const highlightOptions = useMemo(() => {
    const terms = normalizedValue.toUpperCase().split(/\s+/).filter(Boolean);

    return options.map((setor) => {
      const setorNome = setor?.nome ?? '';
      const setorSigla = setor?.sigla ?? '';
      const unidadeNome = setor?.unidade?.nome ?? 'Unidade não informada';

      const highlightedSetorNome = terms.reduce((acc, term) => {
        const regex = new RegExp(`(${term})`, 'gi');
        return acc.replace(regex, '<mark>$1</mark>');
      }, setorNome);

      return {
        raw: setor,
        setorNome,
        setorSigla,
        unidadeNome,
        highlightedSetorNome,
      };
    });
  }, [options, normalizedValue]);

  const handleOptionSelect = (option: any) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !highlightOptions.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % highlightOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + highlightOptions.length) % highlightOptions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = highlightOptions[highlightIndex]?.raw;
      if (option) {
        handleOptionSelect(option);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="setor-responsavel-autocomplete" ref={containerRef}>
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

      {isOpen && (highlightOptions.length > 0 || loading) && (
        <div className="autocomplete-dropdown">
          {loading && <div className="autocomplete-status">Carregando...</div>}

          {!loading && highlightOptions.map((option, index) => (
            <button
              key={option.raw?.uuid ?? option.raw?.id ?? index}
              type="button"
              className={`autocomplete-option ${index === highlightIndex ? 'active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleOptionSelect(option.raw)}
            >
              <span
                className="option-setor"
                dangerouslySetInnerHTML={{ __html: option.highlightedSetorNome }}
              />
              <span className="option-unidade">{option.unidadeNome}</span>
            </button>
          ))}

          {!loading && !highlightOptions.length && (
            <div className="autocomplete-status">Nenhum setor encontrado.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetorResponsavelAutocomplete;
