"use client";

import React from "react";

const BusScheduleHelp = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Bus Schedule & Timings</h1>
      <p className="text-gray-700 mb-4">
        Need help understanding when your UniBus arrives or leaves? You’re in
        the right place.
      </p>

      <ul className="list-disc pl-5 space-y-4 text-gray-700">
        <li>
          <strong>Where can I check the schedule?</strong> <br />
          Visit the "Schedule" tab in the UniBus app to view all active routes,
          with start and end timings.
        </li>
        <li>
          <strong>How often is the schedule updated?</strong> <br />
          Schedules are updated every semester and reflect changes in campus
          timing or road availability.
        </li>
        <li>
          <strong>What if the bus is late?</strong> <br />
          You can track live status under "Live Tracking". If it’s late due to
          traffic or other issues, you'll see delay alerts in the app.
        </li>
        <li>
          <strong>Can I save my daily bus route?</strong> <br />
          Yes! Go to the schedule page, tap the ⭐ icon next to your preferred
          route to mark it as a favorite.
        </li>
      </ul>
    </div>
  );
};

export default BusScheduleHelp;
