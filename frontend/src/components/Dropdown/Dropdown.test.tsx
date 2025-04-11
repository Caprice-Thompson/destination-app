import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from "./Dropdown";
import { FaChevronDown } from "react-icons/fa";


describe("Dropdown component", () => {
    const mockOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' }
    ];

    const defaultProps = {
        id: 'test-dropdown',
        name: 'test-dropdown',
        className: 'test-dropdown',
        label: 'Test Dropdown',
        options: mockOptions,
        value: '',
        onChange: jest.fn()
    };

    it("should render correctly with default props", () => {
        render(<Dropdown {...defaultProps} />);
        const dropdown = screen.getByRole('combobox');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveAttribute("id", "test-dropdown");
        expect(dropdown).toHaveAttribute("name", "test-dropdown");
        expect(dropdown).toHaveAttribute("aria-label", "Test Dropdown");
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
    });


    it('calls onChange handler when selection changes', () => {
        render(<Dropdown {...defaultProps} />);
        
        const dropdown = screen.getByRole('combobox');
        fireEvent.change(dropdown, { target: { value: '2' } });
        
        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    });

    it('renders with icon when provided', () => {
        render(
            <Dropdown 
                {...defaultProps} 
                icon={<FaChevronDown data-testid="dropdown-icon" />} 
            />
        );
        
        expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
    });

    it('should render options when clicked', () => {
        render(<Dropdown {...defaultProps} />);
        const dropdown = screen.getByRole('combobox');
        fireEvent.click(dropdown);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
    });
});
