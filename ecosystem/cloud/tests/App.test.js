import { render, screen } from "@testing-library/react";
import App from "../frontend/App";

// Mock child components
jest.mock("../frontend/components/Editor", () => {
    return function MockEditor() {
        return <div data-testid="editor">Editor Component</div>;
    };
});

jest.mock("../frontend/components/ProjectExplorer", () => {
    return function MockProjectExplorer() {
        return (
            <div data-testid="project-explorer">Project Explorer Component</div>
        );
    };
});

jest.mock("../frontend/components/Toolbar", () => {
    return function MockToolbar() {
        return <div data-testid="toolbar">Toolbar Component</div>;
    };
});

jest.mock("../frontend/components/StatusBar", () => {
    return function MockStatusBar() {
        return <div data-testid="status-bar">Status Bar Component</div>;
    };
});

describe("App Component", () => {
    test("renders welcome message when no file is selected", () => {
        render(<App />);

        expect(
            screen.getByText("Welcome to KODEON Cloud IDE")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Select a file to start coding or create a new project."
            )
        ).toBeInTheDocument();
    });

    test("renders main components", () => {
        render(<App />);

        expect(screen.getByTestId("toolbar")).toBeInTheDocument();
        expect(screen.getByTestId("project-explorer")).toBeInTheDocument();
        expect(screen.getByTestId("status-bar")).toBeInTheDocument();
    });
});
