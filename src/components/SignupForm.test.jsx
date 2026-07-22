import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SignupForm from "./SignupForm";

function createDeferred() {
  let resolve;
  const promise = new Promise((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}

describe("SignupForm", () => {
  it("validates empty fields and focuses the email input", async () => {
    const user = userEvent.setup();
    render(<SignupForm onEmailSignup={vi.fn()} onGoogleSignup={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "สร้างบัญชี Nexora" }));

    expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    expect(screen.getByText("กรุณายืนยันรหัสผ่าน")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมล")).toHaveFocus();
  });

  it("rejects mismatched passwords before calling Firebase", async () => {
    const user = userEvent.setup();
    const onEmailSignup = vi.fn();
    render(<SignupForm onEmailSignup={onEmailSignup} onGoogleSignup={vi.fn()} />);

    await user.type(screen.getByLabelText("อีเมล"), "demo@nexora.test");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "password123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่าน"), "different123");
    await user.click(screen.getByRole("button", { name: "สร้างบัญชี Nexora" }));

    expect(screen.getByText("รหัสผ่านทั้งสองช่องไม่ตรงกัน")).toBeInTheDocument();
    expect(screen.getByLabelText("ยืนยันรหัสผ่าน")).toHaveFocus();
    expect(onEmailSignup).not.toHaveBeenCalled();
  });

  it("shows or hides both password fields together", async () => {
    const user = userEvent.setup();
    render(<SignupForm onEmailSignup={vi.fn()} onGoogleSignup={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "แสดงรหัสผ่านทั้งหมด" }));

    expect(screen.getByLabelText("รหัสผ่าน")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("ยืนยันรหัสผ่าน")).toHaveAttribute("type", "text");
  });

  it("disables actions while submitting and maps Google errors safely", async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    const onEmailSignup = vi.fn(() => deferred.promise);
    const onGoogleSignup = vi.fn().mockRejectedValue({ code: "auth/popup-blocked" });
    render(<SignupForm onEmailSignup={onEmailSignup} onGoogleSignup={onGoogleSignup} />);

    await user.type(screen.getByLabelText("อีเมล"), "demo@nexora.test");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "password123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่าน"), "password123");
    await user.click(screen.getByRole("button", { name: "สร้างบัญชี Nexora" }));

    expect(onEmailSignup).toHaveBeenCalledWith("demo@nexora.test", "password123");
    expect(screen.getByRole("button", { name: "กำลังสร้างบัญชี..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "ดำเนินการต่อด้วย Google" })).toBeDisabled();

    deferred.resolve();
    await waitFor(() => expect(screen.getByRole("button", { name: "สร้างบัญชี Nexora" })).toBeEnabled());

    fireEvent.click(screen.getByRole("button", { name: "ดำเนินการต่อด้วย Google" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Pop-up");
  });
});
