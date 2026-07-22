import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import PostModal from "./PostModal";

const post = {
  id: 1,
  title: "ทดสอบโพสต์",
  image: "",
  createdAt: Date.now(),
  reaction: null,
  baseReactionCount: 0,
  comments: [],
  shareCount: 0,
  isShared: false,
  sharedFrom: null,
};
const noop = () => {};
const testNow = 1_800_000_000_000;

function PostModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>เปิดโพสต์</button>
      {isOpen && (
        <PostModal
          post={post}
          now={testNow}
          closeModal={() => setIsOpen(false)}
          setReaction={noop}
          addComment={noop}
          addReply={noop}
          setCommentReaction={noop}
          setReplyReaction={noop}
          sharePost={noop}
          onCopyLink={noop}
        />
      )}
    </>
  );
}

describe("PostModal", () => {
  it("focuses its close control, traps Tab, closes with Escape, and restores focus", async () => {
    render(<PostModalHarness />);

    const opener = screen.getByRole("button", { name: "เปิดโพสต์" });
    opener.focus();
    fireEvent.click(opener);

    const dialog = await screen.findByRole("dialog", { name: /โพสต์ของ/i });
    const closeButton = screen.getByRole("button", { name: "Close" });
    await waitFor(() => expect(closeButton).toHaveFocus());

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(dialog).toContainElement(document.activeElement);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());
  });
});
