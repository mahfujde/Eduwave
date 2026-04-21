"use client";

import { useState, useMemo } from "react";
import { useUniversities } from "@/hooks/useData";
import UniversityCard from "@/components/UniversityCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Loader2, GraduationCap, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 9;

export default function UniversitiesPage() {
  const { data: universities, isLoading } = useUniversities();
  const [filters, setFilters] = useState({ search: "", level: "", country: "" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!universities) return [];
    return universities.filter((uni) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !uni.name.toLowerCase().includes(q) &&
          !uni.shortName?.toLowerCase().includes(q) &&
          !uni.city?.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.country && uni.country !== filters.country) return false;
      return true;
    });
  }, [universities, filters]);

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterChange = (f: typeof filters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="dark-gradient-bg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] py-14 md:py-20 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-[var(--accent)]/[0.05]" style={{ animation: "float 5s ease-in-out infinite reverse" }} />
        </div>
        <div className="container-custom text-center relative z-10" data-anim="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4">
            <GraduationCap size={15} />
            Partner Institutions
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            University List
          </h1>
          <p className="text-blue-100/80 text-base md:text-lg max-w-xl mx-auto">
            Browse our partner universities in Malaysia. Find the perfect institution for your studies.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-8 md:py-12">
        {/* Filter panel */}
        <div data-anim="fade-up">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            countries={["Malaysia"]}
          />
        </div>

        {/* University list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">No universities found</p>
            <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters</p>
            <button
              onClick={() => { handleFilterChange({ search: "", level: "", country: "" }); }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 font-medium mb-5">
              Showing{" "}
              <span className="text-[var(--primary)] font-semibold">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span>{" "}
              of <span className="text-[var(--primary)] font-semibold">{filtered.length}</span>{" "}
              universit{filtered.length === 1 ? "y" : "ies"}
            </p>
            <div className="space-y-4" data-anim-stagger="fade-up">
              {paginated.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>

            {/* FIX: Pagination */}
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
          </div>
        )}
      </div>
    </div>
  );
}
