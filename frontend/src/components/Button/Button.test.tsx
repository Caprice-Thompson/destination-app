import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    id: "test-button",
    className: "test-class",
    type: "submit" as const,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button with correct props", () => {
    render(<Button {...defaultProps}>Test Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("id", "test-button");
    expect(button).toHaveClass("test-class");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveTextContent("Test Button");
  });

  it("should call onClick handler when clicked", () => {
    render(<Button {...defaultProps}>Test Button</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should render icon when provided", () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(
      <Button {...defaultProps} icon={icon}>
        Test Button
      </Button>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should not render icon when not provided", () => {
    render(<Button {...defaultProps}>Test Button</Button>);

    expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
  });
});
