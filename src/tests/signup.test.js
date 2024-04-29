import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import Signup from "../routes/signup/+page.svelte";

describe("Signup page", () => {
    it("renders the signup form with input fields and submit button", () => {
        const { getByPlaceholderText, getByText } = render(Signup);
        
        const firstNameInput = getByPlaceholderText("first name");
        const lastNameInput = getByPlaceholderText("last name");
        const emailInput = getByPlaceholderText("john@example.com");
        const passwordInput = getByPlaceholderText("password");
        const confirmPasswordInput = getByPlaceholderText("confirm password");
        const submitButton = getByText("Submit");
        
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });
});
