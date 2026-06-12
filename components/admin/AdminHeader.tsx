"use client";

import { useState, useEffect } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-between mb-8 -mx-8 -mt-8 px-8 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E5E5",
        height: "64px",
      }}
    >
      <h1
        style={{
          fontFamily: '"Jost", sans-serif',
          fontWeight: 500,
          fontSize: "18px",
          color: "#111111",
        }}
      >
        {title}
      </h1>
      <span
        className="hidden sm:block"
        style={{
          fontFamily: '"Jost", sans-serif',
          fontWeight: 300,
          fontSize: "13px",
          color: "#888888",
        }}
      >
        {currentTime}
      </span>
    </div>
  );
}
