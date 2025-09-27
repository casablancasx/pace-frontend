import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import './TagInput.css';

interface TagInputOption {
  id: number | string;
  label: string;
}

interface TagInputProps {
  label: string;
  placeholder: string;
  options: TagInputOption[];
  selectedIds: (number | string)[];
  onChange: (selectedIds: (number | string)[]) => void;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({ 
  label, 
  placeholder, 
  options, 
  selectedIds, 
  onChange,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOptions = options.filter(option => selectedIds.includes(option.id));
  const availableOptions = options.filter(option => 
    !selectedIds.includes(option.id) && 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOption = (optionId: number | string) => {
    onChange([...selectedIds, optionId]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveOption = (optionId: number | string) => {
    onChange(selectedIds.filter(id => id !== optionId));
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay para permitir clique nas opções
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`tag-input ${className || ''}`}>
      <label className="tag-input__label">{label}</label>
      
      <div className="tag-input__container">
        {/* Tags selecionadas */}
        <div className="tag-input__tags">
          {selectedOptions.map(option => (
            <div key={option.id} className="tag-input__tag">
              <span>{option.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className="tag-input__tag-remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Campo de busca */}
        <div className="tag-input__search-container">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="tag-input__search"
          />
          <Plus size={16} className="tag-input__icon" />
        </div>

        {/* Dropdown com opções */}
        {isOpen && availableOptions.length > 0 && (
          <div className="tag-input__dropdown">
            {availableOptions.slice(0, 10).map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleAddOption(option.id)}
                className="tag-input__option"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;