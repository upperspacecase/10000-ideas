"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/libs/supabase-browser";
import { Check, AlertCircle, Database } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SetupPage() {
    const [status, setStatus] = useState("idle"); // idle, running, success, error
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const runSetup = async () => {
        setStatus("running");
        setLogs([]);
        addLog("Starting database initialization...");

        try {
            // 1. Create tables one by one using RPC if available, or just check existence
            // Since we can't run DDL (CREATE TABLE) from the browser client directly without a specific RPC function,
            // we will use the specific 'exec_sql' RPC if enabled, OR we instruct the user.

            // However, usually RLS policies prevent table creation from the client.
            // So this page serves as a DIAGNOSTIC tool mostly, unless you enable the 'exec_sql' function.

            // Let's check if we can connect first.
            const { data, error } = await supabaseBrowser.from('projects').select('count').limit(1);

            if (error) {
                if (error.code === "42P01") { // Relation 'projects' does not exist
                    addLog("❌ Tables missing: The 'projects' table was not found.");
                    addLog("⚠️ NOTE: Browsers cannot create tables directly for security reasons.");
                    addLog("Please go to Supabase Dashboard > SQL Editor and run the script below:");
                    setStatus("error");
                } else {
                    addLog(`❌ Connection error: ${error.message}`);
                    setStatus("error");
                }
            } else {
                addLog("✅ Connection successful!");
                addLog("✅ 'projects' table exists.");
                setStatus("success");
            }

        } catch (err) {
            addLog(`❌ Unexpected error: ${err.message}`);
            setStatus("error");
        }
    };

    const sqlScript = `
CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, phase TEXT NOT NULL, tags TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS backlog_ideas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, skills TEXT NOT NULL, author TEXT NOT NULL, votes INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS join_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS problems (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user" TEXT NOT NULL, problem TEXT NOT NULL, job_to_be_done TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON projects FOR ALL USING (true);
ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON backlog_ideas FOR ALL USING (true);
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON join_requests FOR ALL USING (true);
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON problems FOR ALL USING (true);

INSERT INTO projects (title, description, phase, tags) VALUES ('Welcome to 10,000 IDEAS', 'Platform live!', 'Launch', ARRAY['welcome']);
  `;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
            <div className="max-w-3xl w-full bg-white rounded-3xl border-2 border-black/10 p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <Database className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Database Setup</h1>
                        <p className="text-muted-foreground">Check connection and initialize tables</p>
                    </div>
                </div>

                <div className="mb-8">
                    <button
                        onClick={runSetup}
                        disabled={status === "running"}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        {status === "running" ? "Checking..." : "Check Connection & Tables"}
                    </button>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 text-gray-300 font-mono text-sm mb-8 min-h-[150px]">
                    {logs.length === 0 ? (
                        <span className="opacity-50">// Logs will appear here...</span>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className="mb-1">{log}</div>
                        ))
                    )}
                </div>

                {status === "error" && (
                    <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6">
                        <h3 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Manual Action Required
                        </h3>
                        <p className="text-orange-700 mb-4">
                            Browsers cannot create tables directly. Copy this SQL and run it in your Supabase Dashboard.
                        </p>
                        <div className="relative">
                            <pre className="bg-white p-4 rounded-lg border-2 border-orange-100 overflow-x-auto text-xs text-gray-600">
                                {sqlScript}
                            </pre>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(sqlScript);
                                    toast.success("SQL copied!");
                                }}
                                className="absolute top-2 right-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold hover:bg-orange-200"
                            >
                                Copy SQL
                            </button>
                        </div>
                        <div className="mt-4">
                            <a
                                href="https://supabase.com/dashboard/project/gilyduulqfujbvjflibw/sql/new"
                                target="_blank"
                                className="text-primary hover:underline font-bold"
                            >
                                Open Supabase SQL Editor &rarr;
                            </a>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Database is ready! You can go to the homepage.
                        <a href="/" className="ml-4 underline">Go Home</a>
                    </div>
                )}
            </div>
        </div>
    );
}
