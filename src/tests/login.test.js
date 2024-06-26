import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";

// component to test
import Login from "../routes/login/+page.svelte";

describe("Login page", _ => {
    it("renders the login form with input fields and submit button", _ => {
        // render login page
        const { getByPlaceholderText, getByText } = render(Login);

        // attempt to get form elements
        const emailInput = getByPlaceholderText("john@example.com");
        const passwordInput = getByPlaceholderText("password");
        const submitButton = getByText("Submit", { selector: "button" });
        const forgotPassword = getByText("Forgot Password?");
        
        // check if form elements are present
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(forgotPassword).toBeInTheDocument();
    });

    it("submits valid email and password to get sent to home page", async _ => {
        // render login page
        const { getByPlaceholderText, getByText } = render(Login);

        // attempt to get form elements
        const emailInput = getByPlaceholderText("john@example.com");
        const passwordInput = getByPlaceholderText("password");
        const submitButton = getByText("Submit", { selector: "button" });

        // fill in form fields with valid data
        fireEvent.input(emailInput, { target: { value: "test@email.com" } });
        fireEvent.input(passwordInput, { target: { value: "asdf1234" } });

        // submit form
        fireEvent.click(submitButton);

        // wait for page to redirect
        await new Promise(resolve => setTimeout(resolve, 0));

        // check if page redirected to home page
        expect(window.location.pathname).toBe("/");
    });
});