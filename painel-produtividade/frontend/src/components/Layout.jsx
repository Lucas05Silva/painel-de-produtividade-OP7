import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="bg-white text-black min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="animate-fadeIn max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
