import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}

export default function MultiSelect({
    value = [],
    onChange,
    options,
    placeholder = 'Pilih opsi...',
    className = '',
    icon,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleOption = (val: string) => {
        const newValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
        onChange(newValue);
    };

    const removeOption = (val: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== val));
    };

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`relative ${className}`} ref={ref}>
            <div
                onClick={() => setOpen((p) => !p)}
                className={`flex flex-wrap items-center w-full min-h-[42px] pl-10 pr-10 py-1.5 border border-blue-100 bg-white rounded-xl focus-within:ring-2 focus-within:ring-blue-500 outline-none text-sm shadow-sm cursor-pointer transition-all ${
                    open ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
            >
                {icon && (
                    <div className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors">
                        {icon}
                    </div>
                )}
                
                <div className="flex flex-wrap gap-1.5 flex-1">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((opt) => (
                            <span
                                key={opt.value}
                                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-medium border border-blue-100 animate-fadeIn"
                            >
                                {opt.label}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-blue-900 transition-colors"
                                    onClick={(e) => removeOption(opt.value, e)}
                                />
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {value.length > 0 && (
                        <X 
                            className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer mr-0.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange([]);
                            }}
                        />
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </div>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col animate-slideUp">
                    <div className="p-2 border-b border-gray-50">
                        <input
                            type="text"
                            placeholder="Cari..."
                            autoFocus
                            className="w-full px-3 py-1.5 text-xs border border-gray-100 rounded-lg outline-none focus:border-blue-300 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-52 overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = value.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(opt.value);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                                            isSelected
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                Tidak ada opsi ditemukan
                            </div>
                        )}
                    </div>
                    {value.length > 0 && (
                         <div className="p-2 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center px-3">
                             <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{value.length} terpilih</span>
                             <button 
                                type="button" 
                                onClick={() => setOpen(false)}
                                className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors uppercase font-bold tracking-tight"
                             >
                                Selesai
                             </button>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}
