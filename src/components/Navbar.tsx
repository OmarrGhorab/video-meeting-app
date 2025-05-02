import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Logo from '../../public/Logo.png'
import DashboardBtn from "./DashboardBtn";
function Navbar() {
  return (
    <nav className="border-b py-2">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE -LOGO */}
        <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
            >
            <Image
                src={Logo}
                alt="Raven's meeting logo"
                className="w-18 h-18 object-contain"
            />
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>

      </div>
    </nav>
  );
}
export default Navbar;