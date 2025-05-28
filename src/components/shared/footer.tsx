import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 dark:text-white">FoodyX</h3>
            <p className="text-muted-foreground text-sm mb-4 dark:text-gray-400">
              Delivering food to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary dark:hover:text-yellow-400 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary dark:hover:text-yellow-400 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary dark:hover:text-yellow-400 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4 dark:text-white">For You</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Home Page
                </Link>
              </li>
              <li>
                <Link
                  to="/filter-food"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Find Foods
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Order Now
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Top Reviews
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 dark:text-white">
              Our Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={"/about"}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to={"/contact#location"}
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Our Address
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 dark:text-white">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/sign-up"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/forgot-password"
                  className="text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            © {new Date().getFullYear()} FoodyX. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
