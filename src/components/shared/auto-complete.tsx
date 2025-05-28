import React, { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getAutocompleteOptions } from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Suggestion {
  properties: {
    place_id: string;
    formatted: string;
  };
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function AutoComplete({
  onSelect,
  defaultValue,
  className,
}: {
  onSelect: (value: Suggestion | null) => void;
  defaultValue?: string;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState(defaultValue ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!selected) {
      setInputValue(value);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (input: string) => {
    try {
      const response = await axios.request(getAutocompleteOptions(input));
      const data = await response.data;

      setSuggestions(data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (place: Suggestion) => {
    setInputValue(place.description);
    setSuggestions([]);
    setSelected(true);
    onSelect(place);
  };

  const handleClear = () => {
    setInputValue("");
    setSelected(false);
    onSelect(null);
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={cn("relative w-full  ", className)}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Enter an address"
          value={inputValue}
          onChange={handleInput}
          className={cn(
            "w-full pl-9 pr-10 h-10 transition-colors shadow-sm focus:border-slate-50",
            isLoading && "animate-pulse"
          )}
        />
        {selected && (
          <Button
            onClick={handleClear}
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-destructive/10"
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden bg-background shadow-lg border border-input"
          >
            <motion.ul className="max-h-[280px] overflow-y-auto py-1">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={suggestion.place_id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    type="button"
                    className="flex w-full justify-start items-start gap-x-2 px-3 py-2 text-left hover:bg-muted/50"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 text-sm">
                      {suggestion.description}
                    </span>
                  </Button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
