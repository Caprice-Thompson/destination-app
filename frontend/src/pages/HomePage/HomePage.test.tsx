import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

const renderComponent = () => {
    render(<HomePage />);
};

describe("HomePage", () => {
    beforeEach(() => {
        renderComponent();
    });

    it("displays page title", () => {
        expect(screen.getByText("HomePage")).toBeInTheDocument();
    });
});