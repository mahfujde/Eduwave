"use client";

import { useState, useMemo } from "react";
import { usePrograms, useUniversities } from "@/hooks/useData";
import ProgramCard from "@/components/ProgramCard";
import { Loader2, Search, SlidersHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { PROGRAM_LEVELS } from "@/constants/site";

const PER_PAGE = 12;

export default function CoursesPage() {
  const { data: programs, isLoading } = usePrograms();
  const { data: universities } = useUniversities();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter change
  const resetPage = () => setPage(1);

  return (
    <div>
      {/* Hero */}
      <div className="dark-gradient-bg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] py-14 md:py-20 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] rounded-full bg-[var(--accent)]/[0.04]" style={{ animation: "float 4s ease-in-out infinite reverse" }} />
        </div>
        <div className="container-custom text-center relative z-10" data-anim="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4">
            <BookOpen size={15} />
            Academic Programs
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Courses &amp; Programs
          </h1>
          <p className="text-blue-100/80 text-base md:text-lg max-w-xl mx-auto">
            Discover the right program for your academic and career goals.
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Level tabs */}
        <div className="card p-3 mb-4 overflow-x-auto" data-anim="fade-up">
          <div className="flex gap-2 min-w-max">
            {["", ...PROGRAM_LEVELS].map((l) => {
              const count = l
                ? programs?.filter(p => p.level === l).length ?? 0
                : programs?.length ?? 0;
              const isActive = level === l;
              return (
                <button
                  key={l || "all"}
                  onClick={() => { setLevel(l); resetPage(); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {l || "All"}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20" : "bg-gray-200"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 md:p-6 mb-8" data-anim="fade-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search programs..."
                className="input-field !pl-10"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--primary)] border rounded-lg"
            >
              <SlidersHorizontal size={16} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4`}>
              <select value={level} onChange={(e) => { setLevel(e.target.value); resetPage(); }} className="input-field md:w-44">
                <option value="">All Levels</option>
                {PROGRAM_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select value={universityId} onChange={(e) => { setUniversityId(e.target.value); resetPage(); }} className="input-field md:w-56">
                <option value="">All Universities</option>
                {universities?.map((u) => (
                  <option key={u.id} value={u.id}>{u.shortName || u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Programs grid with pagination */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No programs found.</p>
            <button
              onClick={() => { setSearch(""); setLevel(""); setUniversityId(""); resetPage(); }}
              className="btn-primary mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} program{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-anim-stagger="fade-up">
              {paginated.map((prog) => (
                <ProgramCard key={prog.id} program={prog} />
              ))}
            </div>

            {/* FIX: Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === p
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
