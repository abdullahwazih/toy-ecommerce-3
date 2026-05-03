import AdminNavbar from "../components/admin/AdminNavBar";
import OrdersMenu from "../components/admin/OrdersMenu";
import ProductsMenu from "../components/admin/ProductsMenu";
import LogoutMenu from "../components/admin/LogoutMenu";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">

                {/* Navbar */}
                <AdminNavbar />
                <div className="p-4">{children}</div>

                {/* Page content here */}

            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <OrdersMenu />

                        {/* List item */}

                        <ProductsMenu />

                        <div className="my-2 border-t border-base-300/60" />
                        <LogoutMenu />
                    </ul>
                </div>
            </div>
        </div>
    );
}
