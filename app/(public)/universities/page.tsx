"use client";

import { useState, useMemo } from "react";
import { useUniversities } from "@/hooks/useData";
import UniversityCard from "@/components/UniversityCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Loader2, GraduationCap, Search } from "lucide-react";

export default function UniversitiesPage() {
  const { data: universities, isLoading } = useUniversities();
  const [filters, setFilters] = useState({ search: "", level: "", country: "" });

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

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] py-14 md:py-20">
        <div className="container-custom text-center">
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
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          countries={["Malaysia"]}
        />

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
              onClick={() => setFilters({ search: "", level: "", country: "" })}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 font-medium mb-5">
              Showing{" "}
              <span className="text-[var(--primary)] font-semibold">{filtered.length}</span>{" "}
              universit{filtered.length === 1 ? "y" : "ies"}
            </p>
            <div className="space-y-4">
              {filtered.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
