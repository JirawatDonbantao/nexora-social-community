import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import StoryCreator from "./StoryCreator";
import StoryViewer from "./StoryViewer";

const noop = () => {};

function StoryCreatorHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>สร้างสตอรี่</button>
      {isOpen && (
        <StoryCreator
          onAddImageStory={noop}
          onAddTextStory={noop}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function StoryViewerHarness() {
  const [isOpen, setIsOpen] = useState(false);
  const story = {
    avatar: "avatar.svg",
    name: "Nara",
    type: "text",
    text: "สวัสดี Nexora",
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>ดูสตอรี่</button>
      <StoryViewer story={isOpen ? story : null} onClose={() => setIsOpen(false)} />
    </>
  );
}

async function expectEscapeToRestoreFocus(openerName, dialogName) {
  const opener = screen.getByRole("button", { name: openerName });
  opener.focus();
  fireEvent.click(opener);

  await screen.findByRole("dialog", { name: dialogName });
  const closeButton = screen.getByRole("button", { name: /ปิด/ });
  await waitFor(() => expect(closeButton).toHaveFocus());

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("dialog", { name: dialogName })).not.toBeInTheDocument();
  await waitFor(() => expect(opener).toHaveFocus());
}

describe("story dialogs", () => {
  it("makes Story Creator keyboard-dismissible and restores focus", async () => {
    render(<StoryCreatorHarness />);
    await expectEscapeToRestoreFocus("สร้างสตอรี่", "สตอรี่ของคุณ");
  });

  it("makes Story Viewer keyboard-dismissible and restores focus", async () => {
    render(<StoryViewerHarness />);
    await expectEscapeToRestoreFocus("ดูสตอรี่", "สตอรี่ของ Nara");
  });
});
