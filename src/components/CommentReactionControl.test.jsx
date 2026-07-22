import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { reactions } from "../constants";
import CommentReactionControl from "./CommentReactionControl";

describe("CommentReactionControl", () => {
  it("opens from ArrowDown, focuses the first reaction, and restores focus on Escape", async () => {
    const onSelectReaction = vi.fn();
    render(<CommentReactionControl onSelectReaction={onSelectReaction} />);

    const trigger = screen.getByRole("button", { name: "ถูกใจ" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    const picker = await screen.findByRole("group", { name: "เลือกความรู้สึก" });
    const firstReaction = within(picker).getByRole("button", { name: reactions[0].label });

    await waitFor(() => expect(firstReaction).toHaveFocus());

    fireEvent.keyDown(firstReaction, { key: "Escape" });

    expect(screen.queryByRole("group", { name: "เลือกความรู้สึก" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(onSelectReaction).not.toHaveBeenCalled();
  });
});
