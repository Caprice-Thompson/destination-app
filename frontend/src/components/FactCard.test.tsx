import { render, screen } from "@testing-library/react";
import FactCard from "./FactCard";

describe("FactCard Component", () => {
  const mockFacts = [
    {
      label: "Fact 1",
      value: "Value 1",
      className: "custom-class",
    },
    {
      label: "Fact 2",
      value: <span data-testid="custom-value">Custom Value</span>,
    },
  ];

  const defaultProps = {
    title: "Test Facts",
    facts: mockFacts,
    className: "test-facts",
  };

  it("should render card with correct title", () => {
    render(<FactCard {...defaultProps} />);

    expect(screen.getByText("Test Facts")).toBeInTheDocument();
  });

  it("should render all facts with their labels and values", () => {
    render(<FactCard {...defaultProps} />);

    expect(screen.getByText("Fact 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Fact 2")).toBeInTheDocument();
    expect(screen.getByTestId("custom-value")).toBeInTheDocument();
  });

  it("should not render when facts array is empty", () => {
    const { container } = render(
      <FactCard title="Empty Facts" facts={[]} className="empty-facts" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should handle JSX elements as values", () => {
    render(<FactCard {...defaultProps} />);

    const customValue = screen.getByTestId("custom-value");
    expect(customValue).toBeInTheDocument();
    expect(customValue.tagName).toBe("SPAN");
  });
});
