// home.test.js
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import Login from "../routes/login/+page.svelte";

describe("Login page", () => {
  it("renders the div with default value", () => {
    const page = render(Login);
    
    const headerText = page.getByText("LOGIN");

    expect(headerText).toBeInTheDocument();
  });
});