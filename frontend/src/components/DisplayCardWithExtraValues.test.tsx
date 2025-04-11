import { render, screen, fireEvent } from "@testing-library/react";
import DisplayCardWithExtraValues from "./DisplayCardWithExtraValues";

describe("DisplayCardWithExtraValues Component", () => {
  const mockData = [
    {
      name: "Item 1",
      description: "Description 1",
      extra1: "Extra 1",
      extra2: "Extra 2",
    },
  ];

  const defaultProps = {
    title: "Test Title",
    data: mockData,
    className: "test-card",
    extraFields: ["extra1", "extra2"],
  };

  it("should render card with correct title", () => {
    render(<DisplayCardWithExtraValues {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render all items with their names and descriptions", () => {
    render(<DisplayCardWithExtraValues {...defaultProps} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  it("should render extra fields when provided", () => {
    render(<DisplayCardWithExtraValues {...defaultProps} />);

    expect(screen.getByText("extra1:")).toBeInTheDocument();
    expect(screen.getByText("Extra 1")).toBeInTheDocument();
    expect(screen.getByText("extra2:")).toBeInTheDocument();
    expect(screen.getByText("Extra 2")).toBeInTheDocument();
  });

  it("should handle flip card functionality when useFlipCard is true", () => {
    render(<DisplayCardWithExtraValues {...defaultProps} useFlipCard={true} />);

    const firstItem = screen.getByText("Item 1").closest("div");
    fireEvent.click(firstItem!);

    // After click, the description should be visible
    expect(screen.getByText("Description 1")).toBeVisible();
  });

  it("should use custom keyField when provided", () => {
    const customKeyData = [
      { id: "1", name: "Custom 1" },
      { id: "2", name: "Custom 2" },
    ];

    render(
      <DisplayCardWithExtraValues
        {...defaultProps}
        data={customKeyData}
        keyField={(item) => item.id as string}
      />
    );

    expect(screen.getByText("Custom 1")).toBeInTheDocument();
    expect(screen.getByText("Custom 2")).toBeInTheDocument();
  });

  it("should handle empty data array", () => {
    render(<DisplayCardWithExtraValues {...defaultProps} data={[]} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});
