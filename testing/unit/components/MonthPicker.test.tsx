import { render, screen, fireEvent, act } from '@testing-library/react';
import MonthPicker from '../../../app/components/ui/month-picker';
import '@testing-library/jest-dom';

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  ChevronDown: ({ className }: { className: string }) => <span data-testid="chevron-icon" className={className} />,
}));

describe('MonthPicker Component', () => {
  const defaultProps = {
    value: '2026-04',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderPicker = (props = {}) => {
    return render(<MonthPicker {...defaultProps} {...props} />);
  };

  describe('Render Testing', () => {
    it('should render the selected month and year in the trigger', () => {
      renderPicker();
      // selectedMonth = 4 - 1 = 3 (Apr)
      expect(screen.getByText(/Apr 2026/)).toBeInTheDocument();
    });

    it('should render Mei 2026 for 2026-05', () => {
       renderPicker({ value: '2026-05' });
       expect(screen.getByText('Mei 2026')).toBeInTheDocument();
    });
  });

  describe('Year Navigation', () => {
    it('should increment and decrement the picker year', () => {
      renderPicker();
      fireEvent.click(screen.getByText(/2026/)); // Open dropdown
      
      const yearText = screen.getByText('2026', { selector: 'span' });
      const [prevBtn, nextBtn] = screen.getAllByRole('button').slice(1, 3); // 1 = trigger, 2 = prev, 3 = next
      
      // Next
      fireEvent.click(nextBtn);
      expect(screen.getByText('2027')).toBeInTheDocument();
      
      // Prev
      fireEvent.click(prevBtn);
      fireEvent.click(prevBtn);
      expect(screen.getByText('2025')).toBeInTheDocument();
    });
  });

  describe('Month Selection', () => {
    it('should call onChange with correct YYYY-MM when a month is clicked', () => {
      renderPicker({ value: '2026-01' });
      fireEvent.click(screen.getByText(/2026/)); // Open
      
      const marBtn = screen.getByText('Mar');
      fireEvent.click(marBtn);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith('2026-03');
      expect(screen.queryByText('Mar')).not.toBeInTheDocument(); // Closed
    });

    it('should highlight the currently selected month', () => {
      renderPicker({ value: '2026-04' });
      fireEvent.click(screen.getByText(/2026/)); // Open
      
      const aprBtn = screen.getByText('Apr');
      expect(aprBtn).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Shortcuts', () => {
    it('should call onChange with current date when "Bulan ini" is clicked', () => {
      renderPicker({ value: '2020-01' });
      fireEvent.click(screen.getByText(/2020/)); // Open
      
      const todayBtn = screen.getByText('Bulan ini');
      fireEvent.click(todayBtn);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith('2026-04');
    });
  });

  describe('UI Interactions', () => {
    it('should close on outside click', () => {
      renderPicker();
      fireEvent.click(screen.getByText(/2026/)); // Open
      expect(screen.getByText('Bulan ini')).toBeInTheDocument();

      act(() => {
        fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByText('Bulan ini')).not.toBeInTheDocument();
    });
  });
});
