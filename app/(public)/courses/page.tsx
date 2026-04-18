"use client";

import { useState, useMemo } from "react";
import { usePrograms, useUniversities } from "@/hooks/useData";
import ProgramCard from "@/components/ProgramCard";
import { Loader2, Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { PROGRAM_LEVELS } from "@/constants/site";

export default function CoursesPage() {
  const { data: programs, isLoading } = usePrograms();
  const { data: universities } = useUniversities();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!programs) return [];
    return programs.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) &&
            !p.university?.name.toLowerCase().includes(q) &&
            !p.description?.toLowerCase().includes(q)) return false;
      }
      if (level && p.level !== level) return false;
      if (universityId && p.universityId !== universityId) return false;
      return true;
    });
  }, [programs, search, level, universityId]);

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
          Courses & Programs
        </h1>
        <p className="mt-2 text-gray-600">
          Discover the right program for your academic and career goals.
        </p>
      </div>

      {/* Filters bar */}
      <div className="card p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs..."
              className="input-field !pl-10"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium
                     text-[var(--primary)] border rounded-lg"
          >
            <SlidersHorizontal size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4`}>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-field md:w-44"
            >
              <option value="">All Levels</option>
              {PROGRAM_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              className="input-field md:w-56"
            >
              <option value="">All Universities</option>
              {universities?.map((u) => (
                <option key={u.id} value={u.id}>{u.shortName || u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Programs grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No programs found.</p>
          <button
            onClick={() => { setSearch(""); setLevel(""); setUniversityId(""); }}
            className="btn-primary mt-4"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            Showing {filtered.length} program{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
