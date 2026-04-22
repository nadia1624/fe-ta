import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import AuthGuard from '../../../app/layouts/AuthGuard';
import { getToken } from '../../../app/lib/api';
import '@testing-library/jest-dom';

// Mock API
jest.mock('../../../app/lib/api', () => ({
  getToken: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('AuthGuard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderGuard = () => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<AuthGuard />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('should redirect to login if no token is found', () => {
    (getToken as jest.Mock).mockReturnValue(null);
    
    renderGuard();
    
    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({
        state: { from: '/protected' }
    }));
  });

  it('should render children if token is found', () => {
    (getToken as jest.Mock).mockReturnValue('valid-token');
    
    renderGuard();
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
