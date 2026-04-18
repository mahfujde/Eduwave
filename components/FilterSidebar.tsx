"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, X } from "lucide-react";

interface FilterValues {
  search: string;
  level: string;
  country: string;
}

interface Props {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  countries?: string[];
}

export default function FilterSidebar({ filters, onFilterChange, countries = ["Malaysia"] }: Props) {
  const [open, setOpen] = useState(false);

  const updateFilter = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search || filters.country;

  return (
    <div className="w-full mb-6">
      {/* Toggle header */}
      <button
        id="filter-toggle"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl
                   border border-[var(--border)] bg-white shadow-sm
                   hover:border-[var(--accent)] hover:shadow-md transition-all duration-200 group"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 font-semibold text-[var(--primary)] text-sm">
          <SlidersHorizontal size={16} className="text-[var(--accent)]" />
          Filter
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs font-bold">
              {[filters.search, filters.country].filter(Boolean).length}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors">
          {open ? (
            <>Open <ChevronUp size={16} /></>
          ) : (
            <>Filter <ChevronDown size={16} /></>
          )}
        </span>
      </button>

      {/* Collapsible filter panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[var(--primary)] mb-1.5 uppercase tracking-wide">
                Search University
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="filter-search"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  placeholder="Search by name or city..."
                  className="input-field !pl-9 !py-2.5 !text-sm"
                />
              </div>
            </div>

            {/* Location/Country filter */}
            <div className="sm:w-44">
              <label className="block text-xs font-semibold text-[var(--primary)] mb-1.5 uppercase tracking-wide">
                Location
              </label>
              <select
                id="filter-country"
                value={filters.country}
                onChange={(e) => updateFilter("country", e.target.value)}
                className="input-field !py-2.5 !text-sm"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={() => onFilterChange({ search: "", level: "", country: "" })}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-red-500
                           hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <X size={14} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
