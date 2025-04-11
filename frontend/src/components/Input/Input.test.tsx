import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  const mockOnChange = jest.fn();
  const mockOnFocus = jest.fn();

  const defaultProps = {
    id: "test-input",
    className: "test-class",
    placeholder: "Test placeholder",
    name: "test-name",
    type: "text",
    value: "",
    onChange: mockOnChange,
    autoComplete: "off",
    required: true,
    onFocus: mockOnFocus,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render input with correct props", () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveClass("input test-class");
    expect(input).toHaveAttribute("placeholder", "Test placeholder");
    expect(input).toHaveAttribute("name", "test-name");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toBeRequired();
  });

  it("should call onChange handler when value changes", () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should call onFocus handler when focused", () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it("should render with default values when optional props are not provided", () => {
    render(<Input required={true} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("input");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("autocomplete", "off");
  });
});
