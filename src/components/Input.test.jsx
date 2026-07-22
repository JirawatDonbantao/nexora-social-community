import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("does not submit while a Thai IME composition is in progress", () => {
    const addPost = vi.fn();
    render(<Input addPost={addPost} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "กำลังพิมพ์" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(addPost).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "Enter" });

    expect(addPost).toHaveBeenCalledWith({
      title: "กำลังพิมพ์",
      image: null,
    });
  });
});
