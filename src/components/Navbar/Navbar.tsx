import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header
      className="
      h-20
      border-b
      border-blue-100
      dark:border-blue-900
      bg-white
      dark:bg-[#050816]
      px-8
      flex
      items-center
      justify-between"
    >

      <div>

        <h2 className="font-semibold text-lg">

          Learning Session

        </h2>

        <p className="text-sm text-gray-500">

          Ask anything and learn interactively

        </p>

      </div>

      <div className="flex gap-5">

        <Bell className="cursor-pointer" />

        <UserCircle className="cursor-pointer" size={28} />

      </div>

    </header>
  );
};

export default Navbar;