import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";

import Signup from "../routes/signup/+page.svelte";

describe("Signup page", _ => {
    it("renders the signup form with input fields and submit button", _ => {
        const { getByRole, getByPlaceholderText, getByText } = render(Signup);
        
        const firstNameInput = getByRole("textbox", { name: "First Name" });
        const lastNameInput = getByRole("textbox", { name: "Last Name" });
        const emailInput = getByRole("textbox", { name: "Email" });
        const passwordInput = getByPlaceholderText("password");
        const confirmPasswordInput = getByPlaceholderText("confirm password");
        const submitButton = getByText("Submit", { selector: "button" });
        
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it("submits valid information to create an account and then get sent to home page", async _ => {
        const { getByRole, getByPlaceholderText, getByText } = render(Signup);

        const firstNameInput = getByRole("textbox", { name: "First Name" });
        const lastNameInput = getByRole("textbox", { name: "Last Name" });
        const emailInput = getByRole("textbox", { name: "Email" });
        const passwordInput = getByPlaceholderText("password");
        const confirmPasswordInput = getByPlaceholderText("confirm password");
        const submitButton = getByText("Submit", { selector: "button" });

        fireEvent.input(firstNameInput, { target: { value: "test" } });
        fireEvent.input(lastNameInput, { target: { value: "name" } });
        fireEvent.input(emailInput, { target: { value: "test@email.com" } });
        fireEvent.input(passwordInput, { target: { value: "asdf1234" } });
        fireEvent.input(confirmPasswordInput, { target: { value: "asdf1234" } });

        fireEvent.click(submitButton);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.location.pathname).toBe("/");
    });
});
