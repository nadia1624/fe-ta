import { render, screen, fireEvent, act } from '@testing-library/react';
import MultiSelect from '../../../app/components/ui/MultiSelect';
import '@testing-library/jest-dom';

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon" />,
  ChevronDown: ({ className }: { className: string }) => <span data-testid="chevron-icon" className={className} />,
  X: ({ onClick }: { onClick?: any }) => <span data-testid="close-icon" onClick={onClick} />,
}));

describe('MultiSelect Component', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  const defaultProps = {
    value: [],
    onChange: jest.fn(),
    options,
    placeholder: 'Select fruits...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderMultiSelect = (props = {}) => {
    return render(<MultiSelect {...defaultProps} {...props} />);
  };

  describe('Render Testing', () => {
    it('should render the placeholder when no value is selected', () => {
      renderMultiSelect();
      expect(screen.getByText('Select fruits...')).toBeInTheDocument();
    });

    it('should render selected options as chips', () => {
      renderMultiSelect({ value: ['apple', 'banana'] });
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.queryByText('Select fruits...')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Interactions', () => {
    it('should toggle dropdown on click', () => {
      renderMultiSelect();
      const trigger = screen.getByText('Select fruits...');
      
      // Open
      fireEvent.click(trigger);
      expect(screen.getByPlaceholderText('Cari...')).toBeInTheDocument();
      
      // Close
      fireEvent.click(trigger);
      expect(screen.queryByPlaceholderText('Cari...')).not.toBeInTheDocument();
    });

    it('should close dropdown on outside click', () => {
      renderMultiSelect();
      fireEvent.click(screen.getByText('Select fruits...'));
      expect(screen.getByPlaceholderText('Cari...')).toBeInTheDocument();

      act(() => {
        fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByPlaceholderText('Cari...')).not.toBeInTheDocument();
    });
  });

  describe('Search Logic', () => {
    it('should filter options based on search term', () => {
      renderMultiSelect();
      fireEvent.click(screen.getByText('Select fruits...'));
      
      const searchInput = screen.getByPlaceholderText('Cari...');
      fireEvent.change(searchInput, { target: { value: 'app' } });

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
    });

    it('should show "no options found" when no match', () => {
      renderMultiSelect();
      fireEvent.click(screen.getByText('Select fruits...'));
      
      fireEvent.change(screen.getByPlaceholderText('Cari...'), { target: { value: 'xyz' } });
      expect(screen.getByText('Tidak ada opsi ditemukan')).toBeInTheDocument();
    });
  });

  describe('Selection Logic', () => {
    it('should call onChange with new value when an option is clicked', () => {
      renderMultiSelect({ value: ['apple'] });
      fireEvent.click(screen.getByText('Apple')); // Open dropdown
      
      const bananaBtn = screen.getByText('Banana');
      fireEvent.click(bananaBtn);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('should remove an option when clicked in the dropdown', () => {
      renderMultiSelect({ value: ['apple', 'banana'] });
      // Click the trigger (any chip text will do)
      fireEvent.click(screen.getByText('Apple')); 
      
      // Options in dropdown are buttons. Chips are spans.
      const appleOption = screen.getByRole('button', { name: /Apple/i });
      fireEvent.click(appleOption);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(['banana']);
    });

    it('should remove an option when clicking the X on a chip', () => {
      renderMultiSelect({ value: ['apple'] });
      
      // Chips are rendered first. The first close-icon is the chip's X.
      const closeIcons = screen.getAllByTestId('close-icon');
      fireEvent.click(closeIcons[0]);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith([]);
    });

    it('should clear all options when the global X is clicked', () => {
      renderMultiSelect({ value: ['apple', 'banana'] });
      
      // 2 chips + 1 global clear = 3 icons. Global clear is the last one.
      const closeIcons = screen.getAllByTestId('close-icon');
      fireEvent.click(closeIcons[2]);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith([]);
    });
  });
});
