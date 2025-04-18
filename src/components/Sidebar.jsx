import {
    BarChart2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Settings,
    Users,
    Briefcase,
    X,
    Layout,
    Globe,
    Layers,
    Info,
    SlidersHorizontal,
    Grid ,
    Image,
    Mail,
    MessageSquare,
    FileImage,
    ShoppingCart,
    Calendar,
    Bell,
    BookOpen,
    Tag,
    Folder,
    PenTool,
    HelpCircle,
    Lock,
    Database,
    Shield,
    MailIcon,
    BriefcaseBusiness,
    Building ,
    BadgeInfo 
} from "lucide-react";
import logo from "../assets/images/logo-land.png"

import { NavLink } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { useAuth } from "../context/AuthContext";


function Sidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {

    const [count, setCount] = useState({
        enquiries: 0,
        comments: 0,
        sliders: 0,
        users:0,
        clients: 0,
        socialMedia: 0,
    });
    const { authState } = useAuth();
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const { data } = await axiosInstance.get('/stats/total-counts');
                setCount({
                    enquiries: data.counts.enquiries.unread || 0,
                    comments: 0,
                    sliders: data.counts.sliders.total || 0, 
                    users: data.counts.users.total || 0, 
                    clients: data.counts.clients.total || 0,
                    socialMedia: data.counts.social.active || 0,
                });
            } catch (error) {
                console.error('Error fetching sidebar counts:', error);
                // Keep the previous state on error
                setCount(prevCount => prevCount);
            }
        };

        fetchCounts();

        const interval = setInterval(fetchCounts, 60000); // Refresh every minute

        return () => clearInterval(interval);
    }, []);

    const navigation = [
        {
            section: "Dashboard",
            items: [
                { name: 'Dashboard', path: '/', icon: Home },
                { name: 'Analytics', path: '/analytics', icon: BarChart2 },
                { name: 'Enquiries', path: '/enquiries', icon: FileText, count: count.enquiries },
            ]
        },
        {
            section: "Content Management",
            items: [
                { name: 'Pages', path: '/pages', icon: Layout },
                { name: 'Clients', path: '/clients', icon: Briefcase, count: count.clients },
                 { name: 'SEO Editor', path: '/seo-editor', icon: Layers },
                 { name: 'Tooltip Management', path: '/tooltips', icon: Info  },
                { name: 'Slider', path: '/slider', icon: SlidersHorizontal, count: count.sliders },
                { name: 'Category', path: '/category', icon: Grid  },
                { name: 'Organization Details', path: '/organization-details', icon: BadgeInfo , },
                { name: 'Social Media', path: '/social', icon: Globe, count: count.socialMedia },

            ]
        },
        {
            section: "User Management",
            items: [
                { name: 'Users', path: '/users', icon: Users, role: 'superadmin', count: count.users },
                // { name: 'Roles & Permissions', path: '/roles', icon: Lock },
            ]
        },
        {
            section: "System",
            items: [
                // { name: 'Notifications', path: '/notifications', icon: Bell, count: count.notifications },
                // { name: 'SEO', path: '/seo', icon: Globe },
                // { name: 'Mail Config', path: '/mail-config', icon: MailIcon },
                { name: 'Settings', path: '/settings', icon: Settings },
                // { name: 'Help & Docs', path: '/help', icon: HelpCircle }
            ]
        },
    ];

    const NavItem = ({ item, isActive }) => {
        const content = (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <item.icon
                            className={`w-7 h-7 text-primary group-hover:text-white ${isActive ? 'text-white' : ''
                                }`}
                        />
                    </div>
                    <span
                        className={`ml-3 font-medium ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            } ${isActive ? 'text-white' : ''}`}
                        style={{
                            transform: isCollapsed ? 'translateX(-20px)' : 'translateX(0)',
                            display: isCollapsed ? 'none' : 'block'
                        }}
                    >
                        {item.name}
                    </span>
                </div>
                {item.count > 0 && (
                    <div
                        className={`badge badge-primary ${isCollapsed ? 'hidden' : 'ml-2'
                            }`}
                    >
                        <span className="text-white">{item.count}</span>
                    </div>
                )}
            </div>
        );

        return isCollapsed ? (
            <Tippy
                content={
                    <div className="font-medium flex items-center">
                        {item.name}
                        {item.count && (
                            <div className="badge badge-primary ml-2">
                                {item.count}
                            </div>
                        )}
                    </div>
                }
                placement="right"
                arrow={true}
                className="tippy-box ml-2"
            >
                {content}
            </Tippy>
        ) : (
            content
        );
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-base-200 
                transition-all duration-300 ease-in-out shadow-sm h-full 
                ${isCollapsed ? 'w-16' : 'w-64'} 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex items-center justify-between h-16 px-3">
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-0' : 'w-40'
                        }`}>
                        <img src={logo} alt="logo" className="h-auto w-40 rounded-lg mt-5" />
                    </div>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 focus:outline-none text-white rounded-xl shadow-md transition-all duration-300 ease-in-out lg:flex hidden"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-neutral-content" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-neutral-content" />
                        )}
                    </button>
                    <button onClick={onClose} className="lg:hidden p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-2 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hidden pt-8 pb-24">
                    {navigation.map((section, index) => {
                        // Filter items based on role requirements
                        const filteredItems = section.items.filter(item =>
                            !item.role || authState.role === item.role
                        );

                        // Skip rendering the entire section if no items remain after filtering
                        if (filteredItems.length === 0) {
                            return null;
                        }

                        return (
                            <div key={section.section} className={`${index > 0 ? 'mt-6' : 'mt-2'}`}>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'h-0 opacity-0' : 'h-6 opacity-100'
                                    }`}>
                                    <h2 className="text-xs font-semibold text-neutral-content/70 uppercase tracking-wider px-2 mb-2">
                                        {section.section}
                                    </h2>
                                </div>
                                {filteredItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && onClose()}
                                        className={({ isActive }) =>
                                            `flex mx-auto px-2 py-2 mt-2 rounded-lg duration-300 ease-in-out group relative
                                        ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-neutral-content hover:bg-primary/30 hover:text-white'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <NavItem item={item} isActive={isActive} />
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        );
                    })}
                </nav>

            </aside>

            {/* Add custom styles for Tippy */}
            <style>{`
                .tippy-box {
                    background-color: rgb(17, 24, 39);
                }
                .tippy-arrow {
                    color: rgb(17, 24, 39);
                }
            `}</style>
        </>
    );
}

export default Sidebar;