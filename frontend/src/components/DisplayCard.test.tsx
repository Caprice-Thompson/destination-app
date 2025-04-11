import { render, screen } from "@testing-library/react";
import DisplayCard from "./DisplayCard";

describe("DisplayCard Component", () => {
  const mockData = [
    { name: "Item 1", value: "Value 1" },
    { name: "Item 2", value: "Value 2" },
  ];

  const defaultProps = {
    title: "Test Title",
    data: mockData,
    className: "test-card",
  };

  it("should render card with correct title", () => {
    render(<DisplayCard {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render all items in the data array", () => {
    render(<DisplayCard {...defaultProps} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("should apply correct className to container and items", () => {
    render(<DisplayCard {...defaultProps} />);

    const container = screen.getByText("Test Title").parentElement;
    expect(container).toHaveClass("test-card-info-card");

    const items = screen.getAllByRole("heading", { level: 3 });
    items.forEach((item) => {
      expect(item.parentElement).toHaveClass("test-card");
    });
  });

  it("should use custom nameField when provided", () => {
    const customData = [
      { customName: "Custom 1", value: "Value 1" },
      { customName: "Custom 2", value: "Value 2" },
    ];

    render(
      <DisplayCard {...defaultProps} data={customData} nameField="customName" />
    );

    expect(screen.getByText("Custom 1")).toBeInTheDocument();
    expect(screen.getByText("Custom 2")).toBeInTheDocument();
  });

  it("should handle empty data array", () => {
    render(<DisplayCard {...defaultProps} data={[]} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});
