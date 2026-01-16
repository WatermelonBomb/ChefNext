import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '../../hooks/useAuth';

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const currentPage = location.pathname;
    const isLandingOrRegister = currentPage === '/' || currentPage === '/chef/register';

    return (
        <div className="min-h-screen">
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />

            {/* Quick Access FAB - Profile */}
            {isAuthenticated && !isLandingOrRegister && (
                <button
                    onClick={() => navigate('/chef/profile')}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#CDAE58] rounded-full shadow-[0_4px_20px_rgba(205,174,88,0.4)] flex items-center justify-center hover:shadow-[0_8px_30px_rgba(205,174,88,0.5)] transition-all z-50"
                >
                    <span className="text-white text-xl">👨‍🍳</span>
                </button>
            )}
        </div>
    );
}
