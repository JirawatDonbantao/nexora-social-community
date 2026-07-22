import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Signup from "./Signup";
import { useUserAuth } from "../context/useUserAuth";

vi.mock("../context/useUserAuth", () => ({
  useUserAuth: vi.fn(),
}));

function renderSignup(authOverrides = {}) {
  useUserAuth.mockReturnValue({
    loading: false,
    logInWithGoogle: vi.fn(),
    signUp: vi.fn(),
    user: null,
    ...authOverrides,
  });

  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<p>หน้าแรก Nexora</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Signup", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates an email account and redirects to the home page", async () => {
    const user = userEvent.setup();
    const signUp = vi.fn().mockResolvedValue({});
    renderSignup({ signUp });

    await user.type(screen.getByLabelText("อีเมล"), "demo@nexora.test");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "password123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่าน"), "password123");
    await user.click(screen.getByRole("button", { name: "สร้างบัญชี Nexora" }));

    await waitFor(() => expect(signUp).toHaveBeenCalledWith("demo@nexora.test", "password123"));
    expect(await screen.findByText("หน้าแรก Nexora")).toBeInTheDocument();
  });

  it("uses the Google flow and redirects to the home page", async () => {
    const user = userEvent.setup();
    const logInWithGoogle = vi.fn().mockResolvedValue({});
    renderSignup({ logInWithGoogle });

    await user.click(screen.getByRole("button", { name: "ดำเนินการต่อด้วย Google" }));

    await waitFor(() => expect(logInWithGoogle).toHaveBeenCalledOnce());
    expect(await screen.findByText("หน้าแรก Nexora")).toBeInTheDocument();
  });
});
