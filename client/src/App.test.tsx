import { render, screen } from '@testing-library/react';
import App from './App';
import useAuth from './hooks/useAuth';

jest.mock('./services/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
}));

jest.mock('./hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        getAccessToken: jest.fn()
    }))
}));

const mockLogs = [
    {
        id: 1,
        timestamp: '2024-01-01T12:00:00Z',
        service: 'TestService',
        level: 'INFO',
        message: 'Test message',
        lineNumber: 1
    },
    {
        id: 2,
        timestamp: '2024-01-01T12:01:00Z',
        service: 'TestService',
        level: 'ERROR',
        message: 'Error message',
        lineNumber: 2
    }
];

jest.mock('./pages/LoginPage', () => ({
    __esModule: true,
    default: () => (
        <div className="text-center">
            <h3>Please log in to view your logs</h3>
            <button className="btn btn-primary">Log In</button>
        </div>
    )
}));

jest.mock('./pages/DashboardPage', () => ({
    __esModule: true,
    default: () => (
        <div>
            <h2>Dashboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Timestamp</th>
                        <th>Service</th>
                        <th>Level</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {mockLogs.map(log => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.service}</td>
                            <td>{log.level}</td>
                            <td>{log.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}));

jest.mock('./components/Navbar', () => ({
    __esModule: true,
    default: () => (
        <nav>
            <div>Log Viewer</div>
        </nav>
    )
}));

jest.mock('react-router-dom', () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
    Navigate: ({ to }: { to: string }) => <div>Redirecting to {to}</div>
}));

describe('App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
            getAccessToken: jest.fn().mockResolvedValue('mock-token')
        });

        render(<App />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows login page when not authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
            getAccessToken: jest.fn().mockResolvedValue('mock-token')
        });

        render(<App />);
        expect(screen.getByText('Please log in to view your logs')).toBeInTheDocument();
    });

    it('shows dashboard when authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
            getAccessToken: jest.fn().mockResolvedValue('mock-token')
        });

        render(<App />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Timestamp')).toBeInTheDocument();
        expect(screen.getByText('Service')).toBeInTheDocument();
        expect(screen.getByText('Level')).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();

        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();

        const testServiceElements = screen.getAllByText('TestService');
        expect(testServiceElements).toHaveLength(2);

        expect(screen.getByText('INFO')).toBeInTheDocument();
        expect(screen.getByText('ERROR')).toBeInTheDocument();
    });
});