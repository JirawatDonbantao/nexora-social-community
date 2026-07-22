import { useCallback, useEffect, useRef, useState } from "react";

export function useReactionPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const controlNodeRef = useRef(null);
  const pickerNodeRef = useRef(null);
  const triggerNodeRef = useRef(null);
  const shouldFocusFirstRef = useRef(false);

  const setControlRef = useCallback((node) => {
    controlNodeRef.current = node;
  }, []);

  const setPickerRef = useCallback((node) => {
    pickerNodeRef.current = node;
  }, []);

  const setTriggerRef = useCallback((node) => {
    triggerNodeRef.current = node;
  }, []);

  const openPicker = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !shouldFocusFirstRef.current) return;

    shouldFocusFirstRef.current = false;
    pickerNodeRef.current?.querySelector("button")?.focus();
  }, [isOpen]);

  const handleBlur = useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closePicker();
    }
  }, [closePicker]);

  const handleMouseLeave = useCallback(() => {
    if (!controlNodeRef.current?.contains(document.activeElement)) {
      closePicker();
    }
  }, [closePicker]);

  const handleControlKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closePicker();
      triggerNodeRef.current?.focus();
    }
  }, [closePicker]);

  const handleTriggerKeyDown = useCallback((event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      shouldFocusFirstRef.current = true;
      openPicker();
    }
  }, [openPicker]);

  return {
    isOpen,
    attachControl: setControlRef,
    attachPicker: setPickerRef,
    attachTrigger: setTriggerRef,
    closePicker,
    controlProps: {
      onMouseEnter: openPicker,
      onMouseLeave: handleMouseLeave,
      onBlur: handleBlur,
      onKeyDown: handleControlKeyDown,
    },
    triggerProps: {
      onKeyDown: handleTriggerKeyDown,
    },
  };
}
