import React from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  LocateFixed,
  UserCircle,
  Search,
  MessageSquare,
} from "lucide-react";

const HelpCard = ({ icon: Icon, title, href }) => (
  <Link href={href || "#"}>
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      </div>
    </div>
  </Link>
);

const HelpSection = () => {
  const helpTopics = [
    {
      icon: Clock,
      title: "Bus Schedule & Timings",
      href: "/help/bus-schedule",
    },
    {
      icon: LocateFixed,
      title: "Live Bus Tracking",
      href: "/help/live-tracking",
    },
    {
      icon: Search,
      title: "Lost & Found",
      href: "/help/lost-and-found",
    },
    {
      icon: MapPin,
      title: "Routes & Stops",
      href: "/help/routes-and-stops",
    },
    {
      icon: UserCircle,
      title: "Login / ID Issues",
      href: "/help/id-login",
    },
    {
      icon: MessageSquare,
      title: "Feedback & Suggestions",
      href: "/help/feedback",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to UniBus Support
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need help with campus transport? Select a category below to get the support you need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpTopics.map((topic, index) => (
            <HelpCard key={index} {...topic} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
