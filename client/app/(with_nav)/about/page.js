"use client";

import React from "react";

const AboutPage = () => {
  return (
    <div className="font-sans ">
      <section
        className="relative bg-cover bg-center h-screen text-white"
        style={{ backgroundImage: "url('/your-hero-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-5xl font-bold mb-4">
            Smart Travel for Smarter Campuses
          </h1>
          <p className="text-lg max-w-2xl">
            Plan. Track. Ride. Stay connected with your university transit system.
          </p>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-semibold mb-6 text-center">Our Mission</h2>
        <p className="text-center text-lg text-gray-700">
          At UniBuss, our mission is to revolutionize the way people experience daily transportation within campuses and beyond. We are committed to creating a reliable, efficient, and user-friendly platform that bridges the gap between movement and technology.

We aim to empower students, staff, and drivers by offering seamless connectivity through smart scheduling, real-time tracking, and safe travel experiences. What began as a simple idea at Tezpur University in 2024 has now evolved into a purpose-driven platform that reimagines how movement should feel—convenient, inclusive, and accessible to everyone.

UniBuss stands for innovation, accountability, and inclusion. We strive to ensure that everyone—regardless of background, gender, or ability—has the opportunity to move freely, safely, and affordably. With every ride, we’re not just transporting people—we’re building trust, efficiency, and a smarter way to move.

As we grow, we remain grounded in our core belief: movement drives opportunity, and everyone deserves the power to access it.


        </p>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-10">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Reliability</h3>
              <p className="text-gray-700">
                We ensure timely and dependable transportation so that students, staff, and drivers can trust UniBuss every day.
              </p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-700">
                We embrace new technologies to constantly improve the commuting experience and streamline campus travel.
              </p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Inclusivity</h3>
              <p className="text-gray-700">
                We believe transportation should be accessible to all—regardless of background, identity, or ability.
              </p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-md">
              <h3 className="text-2xl font-bold mb-4">Responsibility</h3>
              <p className="text-gray-700">
                We are committed to building a sustainable future by encouraging eco-friendly mobility solutions and reducing our carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-10">
          Global Impact
        </h2>
        <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-10">
          Overcrowding in university transportation has long been a challenge—primarily caused by students boarding buses at the same time without real-time information on availability. This often results in long waits, uncertainty, and congestion.

UniBuss is transforming how students access and experience campus mobility. By providing real-time tracking, live seat availability, and route visibility, our platform empowers students to make informed decisions about when and where to board. With the ability to book seats in advance and view nearby pickup points, students no longer need to arrive early or wait in crowded locations.

This system enhances efficiency, reduces unnecessary gatherings, and ensures a more comfortable and organized commuting experience for everyone on campus.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-10 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} UniBuss. All rights reserved.
          </p>
          <nav className="mt-4">
            <a href="" className="mr-4 text-gray-300 hover:text-white">
              Careers
            </a>
            <a href="" className="mr-4 text-gray-300 hover:text-white">
              Press
            </a>
            <a href="/contact" className="text-gray-300 hover:text-white">
              Contact Us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
