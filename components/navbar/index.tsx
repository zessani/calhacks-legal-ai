import styles from './Navbar.module.css'; // Adjust the import
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-[#001f3f] text-white border-b border-white border-opacity-50 shadow-md">
      <h1 className="text-3xl font-extrabold">Legal AI</h1>
      <Link href="/get-started">
        <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-100 transition">
          Get Started
        </button>
      </Link>
    </nav>
  );
};

export default Navbar
