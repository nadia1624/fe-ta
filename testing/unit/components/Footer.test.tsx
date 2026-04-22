import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Footer from '../../../app/components/layout/Footer';
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = new URL('http://localhost/') as any;
  });

  afterAll(() => {
    // @ts-ignore
    window.location = originalLocation;
  });

  const renderFooter = (props = {}) => {
    return render(
      <MemoryRouter>
        <Footer {...props} />
      </MemoryRouter>
    );
  };

  describe('Render Testing', () => {
    it('should render the footer successfully', () => {
      renderFooter();
      expect(screen.getByText('SIMAP')).toBeInTheDocument();
      expect(screen.getByText(/Inovasi tata kelola agenda/i)).toBeInTheDocument();
    });
  });

  describe('Default Navigation Links', () => {
    it('should display default navigation links when navLinks prop is missing', () => {
      renderFooter();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Fitur')).toBeInTheDocument();
      expect(screen.getByText('Alur')).toBeInTheDocument();
      expect(screen.getByText('Berita')).toBeInTheDocument();
    });
  });

  describe('Custom Navigation Links', () => {
    it('should display custom links when provided and not show default links', () => {
      const customLinks = [
        { label: 'Custom Link A', id: 'a' },
        { label: 'Custom Link B', id: 'b' },
      ];
      renderFooter({ navLinks: customLinks });

      expect(screen.getByText('Custom Link A')).toBeInTheDocument();
      expect(screen.getByText('Custom Link B')).toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });
  });

  describe('Scroll Behavior', () => {
    it('should call scrollTo function when provided on link click', () => {
      const scrollToMock = jest.fn();
      renderFooter({ scrollTo: scrollToMock });

      const homeBtn = screen.getByText('Home');
      fireEvent.click(homeBtn);

      expect(scrollToMock).toHaveBeenCalledWith('hero');
    });

    it('should update window.location.href when scrollTo is not provided', () => {
      renderFooter();
      
      const featuresBtn = screen.getByText('Fitur');
      fireEvent.click(featuresBtn);

      expect(window.location.href).toBe('http://localhost/#fitur');
    });
  });

  describe('Static Content', () => {
    it('should display Navigation and Connect headers', () => {
      renderFooter();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    it('should display social links', () => {
      renderFooter();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('YouTube')).toBeInTheDocument();
    });
  });

  describe('Dynamic Year', () => {
    it('should display the current year in the copyright notice', () => {
      renderFooter();
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should not error when navLinks is an empty array', () => {
      renderFooter({ navLinks: [] });
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      // Since it's an empty array, it should render 0 links
      const buttons = screen.queryAllByRole('button');
      // SIMAP button is not there (it's text), navigation buttons are 'button' elements
      expect(buttons.length).toBe(0);
    });
  });
});
