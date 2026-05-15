import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../useAuth";

// Mock supabase client
const mockOnAuthStateChange = vi.fn();
const mockGetSession = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (...args: unknown[]) => {
        mockOnAuthStateChange(...args);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
      getSession: () => {
        mockGetSession();
        return Promise.resolve({ data: { session: null } });
      },
      signOut: () => {
        mockSignOut();
        return Promise.resolve({ error: null });
      },
    },
  },
}));

function TestConsumer() {
  const { user, loading, session } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.id : "null"}</span>
      <span data-testid="session">{session ? "active" : "null"}</span>
    </div>
  );
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });

  it("starts in loading state and resolves to no user", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("session").textContent).toBe("null");
  });

  it("sets up auth state listener on mount", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it("exposes signOut function", async () => {
    function SignOutConsumer() {
      const { signOut } = useAuth();
      return <button onClick={signOut}>Sign Out</button>;
    }

    render(
      <AuthProvider>
        <SignOutConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Sign Out").click();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
