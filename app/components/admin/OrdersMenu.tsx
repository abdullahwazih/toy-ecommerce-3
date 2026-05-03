import Link from "next/link";

const OrdersMenu = () => {
    return (
        <li>
            <Link
                href="/admin/orders" className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Orders"
            >
                {/* icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="my-1.5 inline-block size-4"
                >
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                    <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"></path>
                    <path d="M9 12h6"></path>
                    <path d="M9 16h6"></path>
                    <path d="M9 20h4"></path>
                </svg>

                <span className="is-drawer-close:hidden">Orders</span>
            </Link>
        </li>
    );
};

export default OrdersMenu;
