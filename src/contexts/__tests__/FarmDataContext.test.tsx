import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  FarmDataProvider,
  useFarmData,
  useFinancialData,
  useSensorData,
  useZoneData,
  useWeatherData,
  useTransactions,
} from "../FarmDataContext";

// Mock useAuth - vi.hoisted ensures variables are available in vi.mock factories
const mocks = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockChannel: vi.fn(),
  mockRemoveChannel: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" }, session: null, loading: false, signOut: vi.fn() }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => {
      mocks.mockFrom(...args);
      const self: Record<string, unknown> = {};
      const resolve = () => Promise.resolve({ data: [], error: null });
      // Every chainable method returns self (which is also thenable via .then)
      self.select = () => self;
      self.eq = () => self;
      self.limit = () => self;
      self.order = () => self;
      self.update = () => self;
      self.insert = () => Promise.resolve({ error: null });
      // Make the chain thenable so await works at any point
      self.then = (resolve2: (v: unknown) => unknown, reject2?: (e: unknown) => unknown) =>
        Promise.resolve({ data: [], error: null }).then(resolve2, reject2);
      return self;
    },
    channel: (...args: unknown[]) => {
      mocks.mockChannel(...args);
      return {
        on: function () { return this; },
        subscribe: vi.fn(),
      };
    },
    removeChannel: mocks.mockRemoveChannel,
  },
}));

function TestConsumer() {
  const { sensors, financial, zones, metrics, weather, isLoading } = useFarmData();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="sensors-count">{sensors.length}</span>
      <span data-testid="zones-count">{zones.length}</span>
      <span data-testid="revenue">{financial.revenue}</span>
      <span data-testid="temperature">{weather.temperature}</span>
      <span data-testid="total-area">{metrics.totalArea}</span>
    </div>
  );
}

describe("FarmDataContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useFarmData must be used within a FarmDataProvider"
    );
    spy.mockRestore();
  });

  it("provides default values on mount", async () => {
    render(
      <FarmDataProvider>
        <TestConsumer />
      </FarmDataProvider>
    );

    // Verify default values are rendered immediately (before async fetch completes)
    expect(screen.getByTestId("zones-count").textContent).toBe("4");
    expect(screen.getByTestId("revenue").textContent).toBe("0");
    expect(screen.getByTestId("temperature").textContent).toBe("28");
    expect(screen.getByTestId("total-area").textContent).toBe("550");
    expect(screen.getByTestId("sensors-count").textContent).toBe("0");
  });

  it("fetches data from supabase on mount", async () => {
    render(
      <FarmDataProvider>
        <TestConsumer />
      </FarmDataProvider>
    );

    await waitFor(() => {
      expect(mocks.mockFrom).toHaveBeenCalledWith("farms");
      expect(mocks.mockFrom).toHaveBeenCalledWith("financial_transactions");
    });
  });

  it("sets up realtime subscriptions", async () => {
    render(
      <FarmDataProvider>
        <TestConsumer />
      </FarmDataProvider>
    );

    await waitFor(() => {
      expect(mocks.mockChannel).toHaveBeenCalled();
    });
  });
});

describe("Utility hooks", () => {
  function FinancialConsumer() {
    const { financial } = useFinancialData();
    return <span data-testid="profit">{financial.profit}</span>;
  }

  function SensorConsumer() {
    const { metrics } = useSensorData();
    return <span data-testid="active">{metrics.activeSensors}</span>;
  }

  function ZoneConsumer() {
    const { zones } = useZoneData();
    return <span data-testid="zones">{zones.length}</span>;
  }

  function WeatherConsumer() {
    const { weather } = useWeatherData();
    return <span data-testid="humidity">{weather.humidity}</span>;
  }

  function TransactionsConsumer() {
    const { transactions } = useTransactions();
    return <span data-testid="txns">{transactions.length}</span>;
  }

  it("useFinancialData returns financial summary", async () => {
    render(<FarmDataProvider><FinancialConsumer /></FarmDataProvider>);
    await waitFor(() => expect(screen.getByTestId("profit").textContent).toBe("0"));
  });

  it("useSensorData returns sensor metrics", async () => {
    render(<FarmDataProvider><SensorConsumer /></FarmDataProvider>);
    await waitFor(() => expect(screen.getByTestId("active").textContent).toBe("0"));
  });

  it("useZoneData returns zones", async () => {
    render(<FarmDataProvider><ZoneConsumer /></FarmDataProvider>);
    await waitFor(() => expect(screen.getByTestId("zones").textContent).toBe("4"));
  });

  it("useWeatherData returns weather", async () => {
    render(<FarmDataProvider><WeatherConsumer /></FarmDataProvider>);
    await waitFor(() => expect(screen.getByTestId("humidity").textContent).toBe("65"));
  });

  it("useTransactions returns transactions array", async () => {
    render(<FarmDataProvider><TransactionsConsumer /></FarmDataProvider>);
    await waitFor(() => expect(screen.getByTestId("txns").textContent).toBe("0"));
  });
});
