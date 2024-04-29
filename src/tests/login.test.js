import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";

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

    it("submits valid email and password to get sent to home page", async _ => {
        const { getByPlaceholderText, getByText } = render(Login);

        const emailInput = getByPlaceholderText("john@example.com");
        const passwordInput = getByPlaceholderText("password");
        const submitButton = getByText("Submit", { selector: "button" });

        fireEvent.input(emailInput, { target: { value: "test@email.com" } });
        fireEvent.input(passwordInput, { target: { value: "asdf1234" } });

        fireEvent.click(submitButton);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.location.pathname).toBe("/");
    });
});