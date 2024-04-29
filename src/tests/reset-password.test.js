import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/svelte";

// component to test
import ResetPswd from "../routes/reset-password/+page.svelte";

describe("Reset password page", _ => {
    it("renders the reset password form with input email field and submit button", _ => {
        // render reset password page
        const { getByPlaceholderText, getByText } = render(ResetPswd);
        
        // attempt to get form elements
        const emailInput = getByPlaceholderText("john@example.com");
        const submitButton = getByText("Submit", { selector: "button" });
        const backToLogin = getByText("<- Back to login page");
        
        // check if form elements are present
        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(backToLogin).toBeInTheDocument();
    });

    it("enters submits email address to receive password reset link", async _ => {
        // render reset password page
        const { getByPlaceholderText, getByText } = render(ResetPswd);

        // attempt to get form elements
        const emailInput = getByPlaceholderText("john@example.com");
        const submitButton = getByText("Submit", { selector: "button" });

        // fill in form fields with valid data
        fireEvent.input(emailInput, { target: { value: "test@email.com" } });

        // submit form
        fireEvent.click(submitButton);

        // wait for page to redirect
        await new Promise(resolve => setTimeout(resolve, 0));

        // check if page redirected to home page
        expect(window.location.pathname).toBe("/");
    });
});
