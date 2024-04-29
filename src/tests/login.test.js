import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import Login from "../routes/login/+page.svelte";

describe("Login page", _ => {
    it("renders the login form with input fields and submit button", _ => {
        const { getByPlaceholderText, getByText } = render(Login);

        const emailInput = getByPlaceholderText("john@example.com");
        const passwordInput = getByPlaceholderText("password");
        const submitButton = getByText("Submit", { selector: "button" });
        const forgotPassword = getByText("Forgot Password?");
        
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(forgotPassword).toBeInTheDocument();
    });
});
