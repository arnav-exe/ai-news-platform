import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import ResetPswd from "../routes/reset-password/+page.svelte";

describe("Reset password page", () => {
    it("renders the reset password form with input fields and submit button", () => {
        const { getByPlaceholderText, getByText } = render(ResetPswd);
        
        const emailInput = getByPlaceholderText("john@example.com");
        const submitButton = getByText("Submit");
        const backToLogin = getByText("<- Back to login page");
        
        expect(emailInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(backToLogin).toBeInTheDocument();
    });
});
