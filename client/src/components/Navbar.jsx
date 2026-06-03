import { supabase } from "../supabase";

function Navbar() {
const handleLogout = async () => {
await supabase.auth.signOut();
};

return ( <nav className="bg-slate-900 text-white p-4 flex justify-between items-center"> <h1 className="text-xl font-bold">
AI Resume Analyzer </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 px-4 py-2 rounded"
  >
    Logout
  </button>
</nav>

);
}

export default Navbar;
