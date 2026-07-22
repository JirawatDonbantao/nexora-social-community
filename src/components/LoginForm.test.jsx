import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

function createDeferred() {
  let resolve;
  const promise = new Promise((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}

describe("LoginForm", () => {
  it("validates fields and focuses the first invalid input", async () => {
    const user = userEvent.setup();
    render(<LoginForm onEmailLogin={vi.fn()} onGoogleLogin={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมล")).toHaveFocus();
  });

  it("toggles password visibility without submitting the form", async () => {
    const user = userEvent.setup();
    render(<LoginForm onEmailLogin={vi.fn()} onGoogleLogin={vi.fn()} />);

    const password = screen.getByLabelText("รหัสผ่าน");
    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "แสดงรหัสผ่าน" }));

    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "ซ่อนรหัสผ่าน" })).toBeInTheDocument();
  });

  it("disables the form while an email login is in progress", async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    const onEmailLogin = vi.fn(() => deferred.promise);
    render(<LoginForm onEmailLogin={onEmailLogin} onGoogleLogin={vi.fn()} />);

    await user.type(screen.getByLabelText("อีเมล"), "demo@nexora.test");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "password123");
    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(onEmailLogin).toHaveBeenCalledWith("demo@nexora.test", "password123");
    expect(screen.getByRole("button", { name: "กำลังเข้าสู่ระบบ..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "ดำเนินการต่อด้วย Google" })).toBeDisabled();

    deferred.resolve();

    await waitFor(() => expect(screen.getByRole("button", { name: "เข้าสู่ระบบ" })).toBeEnabled());
  });

  it("shows a safe Thai error when Google popup is blocked", async () => {
    const onGoogleLogin = vi.fn().mockRejectedValue({ code: "auth/popup-blocked" });
    render(<LoginForm onEmailLogin={vi.fn()} onGoogleLogin={onGoogleLogin} />);

    fireEvent.click(screen.getByRole("button", { name: "ดำเนินการต่อด้วย Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Pop-up");
    expect(onGoogleLogin).toHaveBeenCalledOnce();
  });
});
