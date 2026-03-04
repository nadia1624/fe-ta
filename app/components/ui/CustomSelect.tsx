import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Pilih opsi',
    className = '',
    icon,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const label = selectedOption ? selectedOption.label : placeholder;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center w-full pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm cursor-pointer text-left transition-all"
            >
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                        {icon}
                    </div>
                )}
                <span className={`flex-1 truncate ${selectedOption ? 'text-gray-700' : 'text-gray-400'}`}>
                    {label}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1 animate-fadeIn">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${value === opt.value
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                    {options.length === 0 && (
                        <div className="px-4 py-2.5 text-sm text-gray-400 text-center">
                            Tidak ada opsi
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
