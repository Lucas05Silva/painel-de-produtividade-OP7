import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="bg-dark-bg text-light min-h-screen">
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <main className="lg:ml-64 mt-16 p-6">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}
