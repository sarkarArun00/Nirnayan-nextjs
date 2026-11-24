"use client";

import { useEffect, useRef, useState } from "react";
import {
  searchInvestigations,
  type SearchInvestigation,
} from "@/services/investigation.service";

type Props = {
  stateId: number | null;
  onClose: () => void;
  onSelect?: (investigation: SearchInvestigation) => void;
};

type SearchResult = {
  query: string;
  stateId: number;
  items: SearchInvestigation[];
  error: string;
};

type VoiceRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export default function InvestigationSearchModal({
  stateId,
  onClose,
  onSelect,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<VoiceRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const query = searchText.trim();
  const hasLocation = Number.isSafeInteger(stateId) && Number(stateId) > 0;
  const currentResult =
    result?.query === query && result.stateId === stateId ? result : null;
  const isLoading = Boolean(query && hasLocation && !currentResult);
  const items = currentResult?.items ?? [];
  const resultGroups = [
    {
      type: "test",
      title: "Tests",
      icon: "fa-vial",
      pictureClass: "lab-test-picture",
    },
    {
      type: "package",
      title: "Health Packages",
      icon: "fa-file-medical",
      pictureClass: "lab-package-picture",
    },
  ] as const;

  const toggleVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    setVoiceError("");
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => VoiceRecognition;
      webkitSpeechRecognition?: new () => VoiceRecognition;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "Voice search is unavailable in this browser. Please type your search.",
      );
      inputRef.current?.focus();
      return;
    }

    try {
      const recognition = new Recognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        if (recognitionRef.current === recognition) setIsListening(true);
      };
      recognition.onresult = (event) => {
        if (recognitionRef.current !== recognition) return;
        const transcript =
          event.results[event.resultIndex]?.[0]?.transcript.trim();
        if (transcript) {
          setSearchText(transcript);
          setVoiceError("");
          inputRef.current?.focus();
        }
      };
      recognition.onerror = (event) => {
        if (recognitionRef.current !== recognition) return;
        const messages: Record<string, string> = {
          "not-allowed":
            "Allow microphone access in your browser to use voice search.",
          "service-not-allowed":
            "Your browser has blocked voice search. Please type your search.",
          "audio-capture":
            "No microphone is available. Check your microphone connection.",
          "no-speech": "No speech detected. Tap the microphone and try again.",
          network:
            "Voice search could not connect. Check your internet connection and try again.",
          "language-not-supported":
            "English voice search is unavailable in this browser.",
          aborted: "",
        };
        setVoiceError(
          messages[event.error] ?? "Voice search failed. Please try again.",
        );
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognition.onend = () => {
        if (recognitionRef.current !== recognition) return;
        setIsListening(false);
        recognitionRef.current = null;
      };

      setIsListening(true);
      recognition.start();
    } catch {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition?.abort();
      setIsListening(false);
      setVoiceError(
        "Unable to start voice search. Check microphone access and try again.",
      );
    }
  };

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition?.abort();
    },
    [],
  );

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    if (!query || !hasLocation || stateId == null) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await searchInvestigations(
          { search: query, state_id: stateId, page: 1, limit: 20 },
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setResult({ query, stateId, items: response.data, error: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            query,
            stateId,
            items: [],
            error:
              error instanceof Error
                ? error.message
                : "Unable to search. Please try again.",
          });
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, stateId, hasLocation]);

  return (
    <div className="modal_backdrop active" onClick={onClose}>
      <div
        ref={panelRef}
        className="lab-search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search tests and health packages"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }
          if (event.key === "Tab") {
            const controls = panelRef.current?.querySelectorAll<HTMLElement>(
              'input:not([disabled]), button:not([disabled]), a[href], [tabindex="0"]',
            );
            const first = controls?.[0];
            const last = controls?.[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <div className="lab-search-field">
          <i
            className="fa-solid fa-magnifying-glass lab-search-symbol"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            name="labSearch"
            className="form-control"
            placeholder={
              isListening
                ? "Listening..."
                : "Search for Tests, Health Check-ups"
            }
            aria-label="Search for tests and health check-ups"
            autoComplete="off"
            value={searchText}
            onChange={(event) => {
              const recognition = recognitionRef.current;
              recognitionRef.current = null;
              recognition?.abort();
              setIsListening(false);
              setVoiceError("");
              setSearchText(event.target.value);
            }}
          />
          <div className="flex-dv d-flex align-items-center gap-2">
            <button
              type="button"
              className="lab-search-rx"
              aria-label="Upload prescription"
            >
              <img src="/assets/images/rx.svg" alt="" />
            </button>
            <span className="lab-search-line" />
            <button
              type="button"
              className="lab-search-mike"
              aria-label={
                isListening ? "Stop voice search" : "Start voice search"
              }
              aria-pressed={isListening}
              title={isListening ? "Stop listening" : "Search using your voice"}
              onClick={toggleVoiceSearch}
              style={
                isListening
                  ? {
                      color: "#00A651",
                      background: "#e8f7ee",
                      borderRadius: "50%",
                      boxShadow: "0 0 0 5px rgba(0, 166, 81, 0.12)",
                    }
                  : undefined
              }
            >
              <i
                className={`fa-solid ${isListening ? "fa-stop" : "fa-microphone"} lab-mic-symbol`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="btn p-2"
              aria-label="Close search"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="lab-search-content" aria-busy={isLoading}>
          <div role="status" aria-live="polite">
            {isListening && (
              <p className="px-3 py-3 mb-0" style={{ color: "#08783f" }}>
                Listening... Say a test or package name.
              </p>
            )}
            {voiceError && (
              <p className="px-3 py-3 mb-0 text-danger">{voiceError}</p>
            )}
            {!hasLocation && (
              <p className="px-3 py-4 mb-0">
                Select your location before searching.
              </p>
            )}
            {hasLocation && !query && !isListening && (
              <p className="px-3 py-4 mb-0">
                Type a test or health package name to search.
              </p>
            )}
            {isLoading && <p className="px-3 py-4 mb-0">Searching...</p>}
            {query && currentResult?.error && (
              <p className="px-3 py-4 mb-0 text-danger">
                {currentResult.error}
              </p>
            )}
            {query &&
              currentResult &&
              !currentResult.error &&
              items.length === 0 && (
                <p className="px-3 py-4 mb-0">
                  No tests or packages found for “{query}”.
                </p>
              )}
          </div>

          {query &&
            resultGroups.map((group) => {
              const matches = items.filter(
                (item) => item.product_type === group.type,
              );
              if (matches.length === 0) return null;

              return (
                <section className="lab-result-group" key={group.type}>
                  <h6>{group.title}</h6>
                  <div className="scroll-pnl">
                    {matches.map((item) => (
                      <div
                        className="lab-result-row"
                        key={`${item.product_type}-${item.id}`}
                        role={onSelect ? "button" : undefined}
                        tabIndex={onSelect ? 0 : undefined}
                        onClick={onSelect ? () => onSelect(item) : undefined}
                        onKeyDown={
                          onSelect
                            ? (event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault();
                                  onSelect(item);
                                }
                              }
                            : undefined
                        }
                        style={onSelect ? { cursor: "pointer" } : undefined}
                      >
                        <div
                          className={`lab-result-picture ${group.pictureClass}`}
                        >
                          <i
                            className={`fa-solid ${group.icon}`}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="lab-result-details">
                          <div className="lab-result-name">
                            {item.test_name}
                          </div>
                          <div className="lab-result-category">
                            {item.product_type === "test" ? "Test" : "Package"}
                          </div>
                        </div>
                        {onSelect && (
                          <div className="lab-result-action">
                            <i
                              className="fa-solid fa-arrow-right"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          {/* <div className="lab-search-assistance">
            <div className="inn">
              <span className="lab-assistance-icon">
                <img src="/assets/images/bot.svg" alt="" />
              </span>
              <span className="lab-assistance-text">
                Not Sure which tests right?
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
