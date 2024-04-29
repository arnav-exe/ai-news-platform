import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

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
});
