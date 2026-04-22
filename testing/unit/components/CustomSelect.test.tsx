import { render, screen, fireEvent, act } from '@testing-library/react';
import CustomSelect from '../../../app/components/ui/CustomSelect';
import '@testing-library/jest-dom';

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className: string }) => <span data-testid="chevron-icon" className={className} />,
}));

describe('CustomSelect Component', () => {
  const options = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    options,
    placeholder: 'Select status',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSelect = (props = {}) => {
    return render(<CustomSelect {...defaultProps} {...props} />);
  };

  describe('Render Testing', () => {
    it('should render the placeholder when value is empty', () => {
      renderSelect();
      expect(screen.getByText('Select status')).toBeInTheDocument();
    });

    it('should render the label of the selected option', () => {
      renderSelect({ value: 'active' });
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.queryByText('Select status')).not.toBeInTheDocument();
    });

    it('should show placeholder styling when no selection', () => {
      renderSelect();
      const label = screen.getByText('Select status');
      expect(label).toHaveClass('text-gray-400');
    });
  });

  describe('Interactions', () => {
    it('should toggle dropdown and show options', () => {
      renderSelect();
      const trigger = screen.getByText('Select status');
      
      // Open
      fireEvent.click(trigger);
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      
      // Close
      fireEvent.click(trigger);
      // Wait, CustomSelect uses setOpen(p => !p) on the trigger button.
      // Since it's a button, click works.
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('should call onChange and close when an option is clicked', () => {
      renderSelect();
      fireEvent.click(screen.getByText('Select status')); // Open
      
      const activeOption = screen.getByText('Active');
      fireEvent.click(activeOption);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith('active');
      expect(screen.queryByText('Active')).not.toBeInTheDocument(); // Closed
    });

    it('should close dropdown on outside click', () => {
      renderSelect();
      fireEvent.click(screen.getByText('Select status')); // Open
      expect(screen.getByText('Active')).toBeInTheDocument();

      act(() => {
        fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should show "Tidak ada opsi" when options array is empty', () => {
      renderSelect({ options: [] });
      fireEvent.click(screen.getByText('Select status')); // Open
      expect(screen.getByText('Tidak ada opsi')).toBeInTheDocument();
    });
  });
});
