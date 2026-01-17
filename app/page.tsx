"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Wifi, AlertTriangle, MapPin } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;


export default function Home() {
  const [crash, setCrash] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // 🔄 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/data`);
        const data = await res.json();

        setCrash(data.crash);
        setLat(data.lat);
        setLon(data.lon);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // ⏱ COUNTDOWN WHEN CRASH
  useEffect(() => {
    if (!crash) {
      setCountdown(30);
      return;
    }

    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [crash, countdown]);

  const cancelAlert = async () => {
    await fetch(`${BACKEND_URL}/cancel`, { method: "POST" });
    setCrash(false);
    setCountdown(30);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-500 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Smart Helmet</h1>
            <p className="text-gray-400 text-sm">Crash Detection System</p>
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
            connected ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <Wifi className="w-4 h-4" />
          {connected ? "Connected" : "Disconnected"}
        </div>
      </header>

      {/* STATUS */}
      <section className="max-w-xl mx-auto">
        {!crash ? (
          <div className="bg-zinc-900 p-10 rounded-xl text-center">
            <h2 className="text-xl mb-4">Helmet Status</h2>
            <div className="text-4xl text-green-500 font-bold">SAFE</div>
            <p className="text-gray-400 mt-2">No crash detected</p>
          </div>
        ) : (
          <div className="bg-red-950 p-10 rounded-xl text-center animate-pulse">
            <AlertTriangle className="mx-auto text-red-500 w-10 h-10 mb-4" />
            <h2 className="text-xl">CRASH DETECTED</h2>
            <div className="text-5xl text-red-500 font-bold my-4">
              {countdown}s
            </div>
            <button
              onClick={cancelAlert}
              className="bg-blue-600 px-6 py-2 rounded-lg"
            >
              Cancel Alert
            </button>
          </div>
        )}

        {/* GPS */}
        <div className="mt-6 bg-zinc-900 p-6 rounded-xl text-center">
          <MapPin className="mx-auto mb-2 text-blue-400" />
          {lat && lon ? (
            <>
              <p>Lat: {lat}</p>
              <p>Lon: {lon}</p>
              <a
                className="text-blue-400 underline"
                href={`https://maps.google.com/?q=${lat},${lon}`}
                target="_blank"
              >
                Open in Google Maps
              </a>
            </>
          ) : (
            <p className="text-gray-400">Waiting for GPS signal</p>
          )}
        </div>
      </section>
    </main>
  );
}
