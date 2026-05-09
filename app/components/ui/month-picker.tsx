import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface MonthPickerProps {
    value: string; // format: 'YYYY-MM'
    onChange: (value: string) => void;
    className?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function MonthPicker({ value, onChange, className = '' }: MonthPickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedYear = value ? parseInt(value.split('-')[0]) : new Date().getFullYear();
    const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : new Date().getMonth();
    const [pickerYear, setPickerYear] = useState(selectedYear);

    // Sync pickerYear when value changes externally
    useEffect(() => {
        if (value) setPickerYear(parseInt(value.split('-')[0]));
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectMonth = (monthIndex: number) => {
        const mm = String(monthIndex + 1).padStart(2, '0');
        onChange(`${pickerYear}-${mm}`);
        setOpen(false);
    };

    const goToToday = () => {
        onChange(new Date().toISOString().slice(0, 7));
        setOpen(false);
    };

    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="flex items-center w-full pl-10 pr-10 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm cursor-pointer text-left relative"
            >
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <span className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis ${!value ? 'text-gray-400' : 'text-gray-700'}`}>
                    {value ? `${MONTHS[selectedMonth]} ${selectedYear}` : "Pilih Bulan & Tahun"}
                </span>
                {value && (
                    <div 
                        onClick={clearFilter}
                        className="absolute right-8 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                    </div>
                )}
                <ChevronDown className={`absolute right-3 w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-72 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in duration-200">
                    {/* Year navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={() => setPickerYear(y => y - 1)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="text-sm font-semibold text-gray-800">{pickerYear}</span>
                        <button
                            type="button"
                            onClick={() => setPickerYear(y => y + 1)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((m, i) => {
                            const isActive = i === selectedMonth && pickerYear === selectedYear;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => selectMonth(i)}
                                    className={`py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100'}`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>

                    {/* Shortcut */}
                    <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                        <button
                            type="button"
                            onClick={goToToday}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Bulan ini
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
