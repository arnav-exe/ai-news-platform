import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { getAllByText, render } from "@testing-library/svelte";

import AccountSettings from "../routes/account-settings/+page.svelte";

describe("Account settings page", () => {
    it("renders the account settings page with input fields and submit button", () => {
        const { getByPlaceholderText, getByText } = render(AccountSettings);
        
        const updatEmailInput = getByPlaceholderText("update email");
        const updatePasswordInput = getByPlaceholderText("update password");
        const submitButtons = getAllByText("Submit");
        const backToHome = getByText("<- Back to home");

        expect(updatEmailInput).toBeInTheDocument();
        expect(updatePasswordInput).toBeInTheDocument();
        expect(submitButtons).toBeInTheDocument();
        expect(backToHome).toBeInTheDocument();
    });
});
