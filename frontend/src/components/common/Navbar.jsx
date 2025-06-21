import { NavLink } from "react-router";

const Navbar = () => {
 
  return (
    <nav className="bg-[rgba(16,214,92,0.5)] font-caveat-brush w-full flex justify-between items-center h-full gap-5 p-4 ">
      {" "}
      {/* prettier-ignore */}
      <div className="flex justify-start items-center h-full gap-5">
        <NavLink to='/' className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "text-green-900 font-bold" : ""
  }>My Plants</NavLink>
        <NavLink to='create-plant' className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "text-green-900 font-bold" : ""
  }>Add Plant</NavLink>
        
    </div>
      <div className="flex justify-start items-center h-full gap-5">
        <NavLink to="/logout">logout</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
