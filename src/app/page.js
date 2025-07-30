'use client';

import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Essential for basic calendar structure
import Link from 'next/link';

const localizer = momentLocalizer(moment);

export default function Dashboard() {
  const [stats, setStats] = useState({ calls: 0, appointments: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // *** NEW STATE VARIABLES FOR CALENDAR CONTROL ***
  const [currentDate, setCurrentDate] = useState(new Date()); // Represents the date the calendar is currently showing
  const [currentView, setCurrentView] = useState('month'); // Represents the current view (month, week, day, agenda)

  useEffect(() => {
    async function fetchData() {
      try {
        const metricsRes = await fetch('/api/dashboard/metrics');
        if (!metricsRes.ok) {
          throw new Error(`HTTP error! status: ${metricsRes.status}`);
        }
        const metricsData = await metricsRes.json();
        setStats(metricsData);

        const calendarRes = await fetch('/api/dashboard/calendar');
        if (!calendarRes.ok) {
          throw new Error(`HTTP error! status: ${calendarRes.status}`);
        }
        const calendarData = await calendarRes.json();
        setEvents(calendarData.map(event => ({
          title: event.summary || event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        })));
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // *** NEW CALLBACK FUNCTIONS FOR CALENDAR INTERACTION ***
  const handleNavigate = useCallback((newDate) => setCurrentDate(newDate), []);
  const handleView = useCallback((newView) => setCurrentView(newView), []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    // Main container uses a white background color and dark text
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header and Chatbot Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Clinic Dashboard</h1>
          <Link href="/ai" passHref>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200 ease-in-out text-base sm:text-lg">
              💬
              <span>AI Appointment Assistant</span>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Total Agent Calls Card */}
          <div className="bg-blue-100 p-5 sm:p-6 rounded-xl shadow-md-plus border border-blue-200 flex items-center gap-4">
            <div className="flex-shrink-0 p-3 bg-blue-200 rounded-full text-blue-600 text-3xl">
              📞 {/* Phone emoji */}
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">Total Agent Calls</p>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900">{stats.calls}</p>
            </div>
          </div>

          {/* Total Appointments Booked Card */}
          <div className="bg-green-100 p-5 sm:p-6 rounded-xl shadow-md-plus border border-green-200 flex items-center gap-4">
            <div className="flex-shrink-0 p-3 bg-green-200 rounded-full text-green-600 text-3xl">
              🗓️ {/* Calendar emoji */}
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">Total Appointments Booked</p>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900">{stats.appointments}</p>
            </div>
          </div>
        </div>

        {/* Doctor Calendar */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md-plus border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Doctor Appointments</h2>
          <div className="h-[600px] sm:h-[700px] lg:h-[800px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%',}}
              // *** ADDED PROPS FOR CALENDAR CONTROL ***
              date={currentDate}       // Pass the current date state to the calendar
              view={currentView}       // Pass the current view state to the calendar
              onNavigate={handleNavigate} // Function to call when navigation buttons (Today, Back, Next) are clicked
              onView={handleView}         // Function to call when view buttons (Month, Week, Day, Agenda) are clicked
              eventPropGetter={() => ({
                style: {
                  backgroundColor: '#3B82F6', // Tailwind's blue-500
                  color: 'white',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  border: 'none',
                  fontSize: '0.875rem',
                }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}