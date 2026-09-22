"use client";

import { useMemo, useState } from "react";

import type { DiagnosticTest } from "@/types/patient/test.types";

import TestCard from "./TestCard";
import styles from "./TestCatalogue.module.css";

interface TestCatalogueProps {
  tests: DiagnosticTest[];
}

const ALL_CATEGORIES = "all";

type HomeCollectionFilter = "all" | "available";

type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "mrp-asc"
  | "mrp-desc";

/*
 * The backend returns mrpAmount as a string.
 * Invalid or missing MRP values are not treated as ₹0.
 */
function getNumericMrp(test: DiagnosticTest): number | null {
  const amount = test.mrpAmount;

  if (amount == null || amount.trim() === "") {
    return null;
  }

  const value = Number(amount);

  return Number.isFinite(value) && value >= 0
    ? value
    : null;
}

export default function TestCatalogue({
  tests,
}: Readonly<TestCatalogueProps>) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(ALL_CATEGORIES);

  const [homeCollectionFilter, setHomeCollectionFilter] =
    useState<HomeCollectionFilter>("all");

  const [sortOption, setSortOption] =
    useState<SortOption>("default");

  /*
   * Keep the existing category filter based on
   * actual category IDs returned by the backend.
   */
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        tests
          .map((test) => test.category_id)
          .filter(
            (id): id is number => typeof id === "number"
          )
      )
    ).sort((a, b) => a - b);
  }, [tests]);

  /*
   * Apply search, category, and home collection
   * filters before sorting the matching results.
   */
  const filteredTests = useMemo(() => {
    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase();

    const matches = tests.filter((test) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES ||
        String(test.category_id) === selectedCategory;

      const searchableText = [
        test.test_name,
        test.test_code,
        test.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      const matchesHomeCollection =
        homeCollectionFilter === "all" ||
        test.homeCollection === true;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesHomeCollection
      );
    });

    /*
     * Do not mutate the tests prop or change the
     * order provided by the API when "Default" is selected.
     */
    if (sortOption === "default") {
      return matches;
    }

    const sorted = [...matches];

    if (sortOption === "name-asc") {
      return sorted.sort((a, b) =>
        a.test_name.localeCompare(b.test_name)
      );
    }

    if (sortOption === "name-desc") {
      return sorted.sort((a, b) =>
        b.test_name.localeCompare(a.test_name)
      );
    }

    /*
     * Missing or invalid MRP values always appear
     * after tests with a valid MRP.
     */
    return sorted.sort((a, b) => {
      const aMrp = getNumericMrp(a);
      const bMrp = getNumericMrp(b);

      if (aMrp === null && bMrp === null) {
        return 0;
      }

      if (aMrp === null) {
        return 1;
      }

      if (bMrp === null) {
        return -1;
      }

      return sortOption === "mrp-asc"
        ? aMrp - bMrp
        : bMrp - aMrp;
    });
  }, [
    tests,
    searchQuery,
    selectedCategory,
    homeCollectionFilter,
    sortOption,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== ALL_CATEGORIES ||
    homeCollectionFilter !== "all" ||
    sortOption !== "default";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORIES);
    setHomeCollectionFilter("all");
    setSortOption("default");
  }

  return (
    <div className={styles.catalogue}>
      {/* FILTER PANEL */}

      <div className={styles.filterPanel}>
        <div className={styles.filterHeader}>
          <div>
            <h3 className={styles.filterTitle}>
              Find Your Diagnostic Test
            </h3>

            <p className={styles.filterDescription}>
              Search by test name or code, filter
              by category and home collection, or sort
              the available tests.
            </p>
          </div>
        </div>

        <div className={styles.filterGrid}>
          {/* SEARCH */}

          <div className={styles.field}>
            <label
              htmlFor="test-search"
              className={styles.label}
            >
              Search Tests
            </label>

            <div className={styles.searchWrapper}>
              <span
                className={styles.searchIcon}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m16 16 5 5" />
                </svg>
              </span>

              <input
                id="test-search"
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by test name or code..."
                className={styles.searchInput}
                autoComplete="off"
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}

          <div className={styles.field}>
            <label
              htmlFor="test-category"
              className={styles.label}
            >
              Test Category
            </label>

            <select
              id="test-category"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className={styles.categorySelect}
            >
              <option value={ALL_CATEGORIES}>
                All Categories
              </option>

              {categories.map((categoryId) => (
                <option
                  key={categoryId}
                  value={String(categoryId)}
                >
                  Category ID {categoryId}
                </option>
              ))}
            </select>
          </div>

          {/* HOME COLLECTION FILTER */}

          <div className={styles.field}>
            <label
              htmlFor="test-home-collection"
              className={styles.label}
            >
              Home Sample Collection
            </label>

            <select
              id="test-home-collection"
              value={homeCollectionFilter}
              onChange={(event) =>
                setHomeCollectionFilter(
                  event.target.value as HomeCollectionFilter
                )
              }
              className={styles.categorySelect}
            >
              <option value="all">
                All Tests
              </option>

              <option value="available">
                Home Collection Available
              </option>
            </select>
          </div>

          {/* SORTING */}

          <div className={styles.field}>
            <label
              htmlFor="test-sort"
              className={styles.label}
            >
              Sort By
            </label>

            <select
              id="test-sort"
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              className={styles.categorySelect}
            >
              <option value="default">
                Default Order
              </option>

              <option value="name-asc">
                Test Name: A to Z
              </option>

              <option value="name-desc">
                Test Name: Z to A
              </option>

              <option value="mrp-asc">
                MRP: Low to High
              </option>

              <option value="mrp-desc">
                MRP: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS HEADER */}

      <div className={styles.resultsHeader}>
        <p
          className={styles.resultsCount}
          role="status"
          aria-live="polite"
        >
          <strong>{filteredTests.length}</strong>{" "}
          {filteredTests.length === 1
            ? "test found"
            : "tests found"}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearButton}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* TEST CARDS */}

      {filteredTests.length > 0 ? (
        <div className={styles.testGrid}>
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span
            className={styles.emptyIcon}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5M8 8l5 5M13 8l-5 5" />
            </svg>
          </span>

          <h3 className={styles.emptyTitle}>
            No matching tests found
          </h3>

          <p className={styles.emptyDescription}>
            Try another search term or adjust
            your selected filters.
          </p>

          <button
            type="button"
            className={styles.resetButton}
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}