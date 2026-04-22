import { render, screen, fireEvent, act } from '@testing-library/react';
import { NewsSlider } from '../../../app/components/NewsSlider';
import '@testing-library/jest-dom';

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Newspaper: () => <span data-testid="newspaper-icon" />,
  ChevronLeft: () => <span data-testid="prev-icon" />,
  ChevronRight: () => <span data-testid="next-icon" />,
}));

describe('NewsSlider Component', () => {
  const mockDokumentasis = [
    { file_path: 'news1.webp' },
    { file_path: 'news2.png' },
    { file_path: 'news3.jpg' },
  ];

  const defaultProps = {
    dokumentasis: mockDokumentasis,
    judul: 'Berita Terbaru',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.clearAllTimers();
    });
    jest.useRealTimers();
  });

  describe('Render Testing', () => {
    it('should show placeholder icon when dokumentasis is empty', () => {
      render(<NewsSlider dokumentasis={[]} judul="Test" />);
      expect(screen.getByTestId('newspaper-icon')).toBeInTheDocument();
    });

    it('should show placeholder icon when dokumentasis is null', () => {
        // @ts-ignore
        render(<NewsSlider dokumentasis={null} judul="Test" />);
        expect(screen.getByTestId('newspaper-icon')).toBeInTheDocument();
    });

    it('should render the first image with correct URL and alt text', () => {
      render(<NewsSlider {...defaultProps} />);
      const firstImg = screen.getByAltText('Berita Terbaru - 1');
      expect(firstImg).toBeInTheDocument();
      expect(firstImg).toHaveAttribute('src', '/api/uploads/berita/news1.webp');
    });
  });

  describe('Navigation Logic', () => {
    it('should change to next image when next button is clicked', () => {
      render(<NewsSlider {...defaultProps} />);
      const nextBtn = screen.getByLabelText('Next image');
      
      fireEvent.click(nextBtn);
      expect(screen.getByAltText('Berita Terbaru - 2')).toBeInTheDocument();
      
      fireEvent.click(nextBtn);
      expect(screen.getByAltText('Berita Terbaru - 3')).toBeInTheDocument();
      
      // Wrap around
      fireEvent.click(nextBtn);
      expect(screen.getByAltText('Berita Terbaru - 1')).toBeInTheDocument();
    });

    it('should change to prev image when prev button is clicked', () => {
      render(<NewsSlider {...defaultProps} />);
      const prevBtn = screen.getByLabelText('Previous image');
      
      // Wrap to last
      fireEvent.click(prevBtn);
      expect(screen.getByAltText('Berita Terbaru - 3')).toBeInTheDocument();
      
      fireEvent.click(prevBtn);
      expect(screen.getByAltText('Berita Terbaru - 2')).toBeInTheDocument();
    });

    it('should jump to specific slide when indicator is clicked', () => {
      render(<NewsSlider {...defaultProps} />);
      const indicator3 = screen.getByLabelText('Go to slide 3');
      
      fireEvent.click(indicator3);
      expect(screen.getByAltText('Berita Terbaru - 3')).toBeInTheDocument();
    });
  });

  describe('Auto-play Logic', () => {
    it('should automatically change slide every 4 seconds', () => {
      render(<NewsSlider {...defaultProps} />);
      expect(screen.getByAltText('Berita Terbaru - 1')).toBeInTheDocument();
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      expect(screen.getByAltText('Berita Terbaru - 2')).toBeInTheDocument();
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      expect(screen.getByAltText('Berita Terbaru - 3')).toBeInTheDocument();
    });

    it('should pause auto-play when mouse enters and resume when it leaves', () => {
      render(<NewsSlider {...defaultProps} />);
      const container = screen.getByAltText('Berita Terbaru - 1').parentElement?.parentElement!;
      
      // Enter
      fireEvent.mouseEnter(container);
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      // Should still be at index 0
      expect(screen.getByAltText('Berita Terbaru - 1')).toBeInTheDocument();
      
      // Leave
      fireEvent.mouseLeave(container);
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      // Should progress now
      expect(screen.getByAltText('Berita Terbaru - 2')).toBeInTheDocument();
    });
  });

  describe('Conditional Controls', () => {
    it('should not show navigation arrows if there is only 1 image', () => {
      render(<NewsSlider dokumentasis={[{ file_path: 'one.jpg' }]} judul="Single" />);
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    });
  });
});
