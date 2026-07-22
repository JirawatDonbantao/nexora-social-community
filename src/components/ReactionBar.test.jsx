import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { reactions } from "../constants";
import ReactionBar from "./ReactionBar";

describe("ReactionBar", () => {
  it("lazy-mounts the post reaction picker for keyboard users", async () => {
    const onSetReaction = vi.fn();
    render(
      <ReactionBar
        postId={1}
        selectedReaction={null}
        onSetReaction={onSetReaction}
      />
    );

    const trigger = screen.getByRole("button", { name: "ถูกใจ" });
    expect(screen.queryByRole("group", { name: "เลือกความรู้สึก" })).not.toBeInTheDocument();

    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    const picker = await screen.findByRole("group", { name: "เลือกความรู้สึก" });
    const firstReaction = within(picker).getByRole("button", { name: reactions[0].label });
    await waitFor(() => expect(firstReaction).toHaveFocus());

    fireEvent.click(firstReaction);

    expect(onSetReaction).toHaveBeenCalledWith(1, "like");
    expect(screen.queryByRole("group", { name: "เลือกความรู้สึก" })).not.toBeInTheDocument();
  });
});
