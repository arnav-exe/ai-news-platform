import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/svelte";

import ResetPswd from "../routes/reset-password/+page.svelte";

describe("Reset password page", _ => {
    it("renders the reset password form with input email field and submit button", _ => {
        const { getByPlaceholderText, getByText } = render(ResetPswd);
        
        const emailInput = getByPlaceholderText("john@example.com");
        const submitButton = getByText("Submit", { selector: "button" });
        const backToLogin = getByText("<- Back to login page");
        
        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(backToLogin).toBeInTheDocument();
    });

    it("enters submits email address to receive password reset link", async _ => {
        const { getByPlaceholderText, getByText } = render(ResetPswd);

        const emailInput = getByPlaceholderText("john@example.com");
        const submitButton = getByText("Submit", { selector: "button" });

        fireEvent.input(emailInput, { target: { value: "test@email.com" } });

        fireEvent.click(submitButton);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.location.pathname).toBe("/");
    });
});
