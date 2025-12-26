import React, { useState, useRef, useEffect } from "react";
import { getUser } from "../utls/auth";
import { useNavigate } from "react-router-dom";
import '../index.css'
import PetitionList from './petitionList.jsx'; // add import
import PollsPage from './poll.jsx';

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const displayName =
    user?.name || user?.fullName || user?.username || "User";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const location = user?.location || "San Diego, CA";
  const role = user?.role || "Unverified Official";
  const contact = user?.email || user?.phone || (user?.id ? `${String(user.id).slice(0, 10)}...` : "—");

  const [activeSection, setActiveSection] = useState("Dashboard");

  const topNavItems = ["Home", "Petitions", "Polls", "Reports"];
  const sidebarItems = [
    "Dashboard",
    "Petitions",
    "Polls",
    "Officials",
    "Reports",
    "Settings",
  ];

  const categories = [
    "All Categories",
    "Environment",
    "Infrastructure",
    "Education",
    "Public Safety",
    "Transportation",
    "Healthcare",
    "Housing",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const mockPetitions = [
    {
      id: "p1",
      title: "Fix potholes on 5th Avenue",
      category: "Infrastructure",
      location: "San Diego, CA",
      summary: "Multiple large potholes causing vehicle damage near the market.",
      signatures: 124,
    },
    {
      id: "p2",
      title: "Increase tree coverage in downtown",
      category: "Environment",
      location: "San Diego, CA",
      summary: "Plant 200 trees in downtown areas to improve air quality and shade.",
      signatures: 342,
    },
    {
      id: "p3",
      title: "Safe routes to school",
      category: "Public Safety",
      location: "San Diego, CA",
      summary: "Add crosswalks and traffic calming near elementary schools.",
      signatures: 89,
    },
  ];

  const filteredPetitions =
    selectedCategory === "All Categories"
      ? mockPetitions
      : mockPetitions.filter((p) => p.category === selectedCategory);

  const [selectedPetition, setSelectedPetition] = useState(null);

  function clearFilters() {
    setSelectedCategory("All Categories");
    setSelectedPetition(null);
  }

  const mockNotifications = user?.notifications || [
    { id: "n1", text: "New signature on 'Fix potholes on 5th Avenue'", unread: true },
    { id: "n2", text: "Petition 'Increase tree coverage' reached 300 signatures", unread: false },
  ];
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  const notifRef = useRef(null);
  useEffect(() => {
    function handleDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  // responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* TOP NAVBAR */}
      <header className="h-14 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="text-blue-600 text-2xl md:text-3xl">🏛️</div>
          <span className="font-semibold text-2xl md:text-3xl text-blue-600 flex items-center gap-2">
            Civix
            <span className="text-xs md:text-sm text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </span>
        </div>

        {/* top nav - small screens allowed to scroll horizontally */}
        <nav className="hidden sm:flex gap-6 text-sm md:gap-8 md:text-base overflow-x-auto flex-shrink-0">
          {topNavItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={
                activeSection === item
                  ? "text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 relative" ref={notifRef}>
          {/* Notification button */}
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="relative p-1 rounded-full hover:bg-gray-100"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-12 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
              <div className="p-3 border-b text-sm font-medium text-gray-700">Notifications</div>
              <div className="max-h-56 overflow-auto">
                {mockNotifications.length === 0 ? (
                  <div className="p-3 text-xs text-gray-500">No notifications</div>
                ) : (
                  mockNotifications.map((n) => (
                    <div key={n.id} className={`p-3 text-sm ${n.unread ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                      <div className="text-gray-700">{n.text}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t text-right">
                <button
                  onClick={() => alert("Mark all as read (implement backend)")}
                  className="text-xs text-blue-600 px-2 py-1"
                >
                  Mark all read
                </button>
              </div>
            </div>
          )}

          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            {initial}
          </div>
          <span className="hidden sm:inline text-sm text-gray-700">{displayName}</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-72 bg-white shadow min-h-[calc(100vh-56px)] p-5">
          <ProfileBlock
            initial={initial}
            displayName={displayName}
            role={role}
            location={location}
            contact={contact}
          />
          <nav className="space-y-1 text-sm mt-2">
            {sidebarItems.map((label) => (
              <MenuItem
                key={label}
                label={label}
                active={activeSection === label}
                onClick={() => setActiveSection(label)}
              />
            ))}
          </nav>

          <div className="mt-10 text-sm text-gray-500 flex items-center gap-2">
            ❓ Help & Support
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-14 bottom-0 w-64 bg-white shadow z-40 p-4 overflow-auto md:hidden">
              <ProfileBlock
                initial={initial}
                displayName={displayName}
                role={role}
                location={location}
                contact={contact}
              />
              <nav className="space-y-1 text-sm mt-2">
                {sidebarItems.map((label) => (
                  <MenuItem
                    key={label}
                    label={label}
                    active={activeSection === label}
                    onClick={() => {
                      setActiveSection(label);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {/* WELCOME */}
          <div className="bg-white rounded-lg shadow p-4 md:p-5 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Welcome back, {displayName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                See what's happening in your community and make your voice heard.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Current section: <span className="font-medium">{activeSection}</span>
              </p>
            </div>

            <button
              onClick={() => navigate("/petition")}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 self-stretch md:self-auto"
            >
              + Create Petition
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatBox title="My Petitions" value={user?.stats?.myPetitions ?? "0"} sub="petitions" />
            <StatBox title="Successful Petitions" value={user?.stats?.successful ?? "0"} sub="or under review" />
            <StatBox title="Polls Created" value={user?.stats?.polls ?? "0"} sub="polls" />
          </div>

          {/* ACTIVE PETITIONS */}
          {activeSection === "Petitions" ? (
            <PetitionList />
          ) : activeSection === "Polls" ? (
            <PollsPage />
          ) : (
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-800">
                  Active Petitions Near You
                </h3>

                <div className="text-xs text-gray-500 flex items-center gap-1">
                  Showing for
                  <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    {location}
                  </span>
                </div>
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "All Categories",
                  "Environment",
                  "Infrastructure",
                  "Education",
                  "Public Safety",
                  "Transportation",
                  "Healthcare",
                  "Housing",
                ].map((f, i) => (
                  <button
                    key={f}
                    className={`text-xs px-4 py-1.5 rounded-full border
                      ${
                        i === 0
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* EMPTY */}
              <div className="text-center text-sm text-gray-500 py-10">
                No petitions found with the current filters.
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    /* optional: keep existing clear logic */
                  }}
                  className="text-sm border px-4 py-1.5 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function ProfileBlock({ initial, displayName, role, location, contact }) {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-sm">
          {initial}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">{displayName}</h4>
          <p className="text-xs text-gray-500">{role}</p>
          <p className="text-xs text-gray-400 mt-1">📍 {location}</p>
          <p className="text-xs text-gray-400">{contact}</p>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ label, active, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`px-3 py-2 rounded-md cursor-pointer select-none ${
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </div>
  );
}

function StatBox({ title, value, sub }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  );
}
