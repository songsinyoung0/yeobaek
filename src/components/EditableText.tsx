import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X, Link as LinkIcon } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  isLink?: boolean;
  linkUrl?: string;
  onSaveLinkUrl?: (newUrl: string) => void;
  label?: string;
  children?: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'a';
}

const formatUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }
  if (url.startsWith('@')) {
    return `https://instagram.com/${url.substring(1)}`;
  }
  return `https://${url}`;
};

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  multiline = false,
  className = '',
  inputClassName = '',
  placeholder = '내용을 입력하세요',
  isLink = false,
  linkUrl = '',
  onSaveLinkUrl,
  label,
  children,
  tag = 'span',
}) => {
  const { isAdminMode } = useSiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [tempUrl, setTempUrl] = useState(linkUrl);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    setTempUrl(linkUrl);
  }, [linkUrl]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(tempValue);
    if (isLink && onSaveLinkUrl) {
      onSaveLinkUrl(tempUrl);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setTempUrl(linkUrl);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdminMode) {
    if (isLink && linkUrl) {
      return (
        <a
          href={formatUrl(linkUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children || value}
        </a>
      );
    }
    const TagComponent = tag as any;
    return <TagComponent className={className}>{children || value}</TagComponent>;
  }

  // Admin Mode: Editing State
  if (isEditing) {
    return (
      <div className="inline-block relative z-30 my-1 p-2 bg-amber-50 rounded-xl border-2 border-amber-400 shadow-xl animate-fadeIn text-left text-black max-w-full">
        {label && (
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <Edit3 className="w-3 h-3" />
            <span>{label} 수정</span>
          </div>
        )}

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={placeholder}
            className={`w-full p-2 text-xs sm:text-sm bg-white rounded-lg border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-black font-normal ${inputClassName}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-2 text-xs sm:text-sm bg-white rounded-lg border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-black font-normal ${inputClassName}`}
          />
        )}

        {isLink && onSaveLinkUrl && (
          <div className="mt-2 pt-2 border-t border-amber-200">
            <label className="block text-[10px] font-medium text-amber-900 mb-1 flex items-center space-x-1">
              <LinkIcon className="w-3 h-3" />
              <span>연결 링크 (URL)</span>
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-1.5 text-xs bg-white rounded-md border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-black"
            />
          </div>
        )}

        <div className="flex items-center justify-end space-x-1.5 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>취소</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>적용 (Save)</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin Mode: Idle State (Clickable & Highlighted)
  const TagComponent = tag as any;

  return (
    <TagComponent
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`relative group/editable cursor-pointer border-2 border-dashed border-amber-400/70 hover:border-amber-500 hover:bg-amber-400/10 p-1 rounded-md transition-all inline-block ${className}`}
      title={`[클릭하여 수정] ${label || value}`}
    >
      {children || value}
      <span className="inline-flex items-center space-x-1 ml-1 px-1.5 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-bold align-middle opacity-90 group-hover/editable:opacity-100 group-hover/editable:scale-105 transition-all shadow-xs">
        <Edit3 className="w-2.5 h-2.5" />
        <span>수정</span>
      </span>
    </TagComponent>
  );
};
