import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

// component to test
import Main from "../routes/Article.svelte";

describe("Main page", _ => {
    it("renders preloader while articles are still loading", _ => {
        // render main page
        const { getByTestId } = render(Main);

        // attempt to get preloader
        const preloader = getByTestId("progress-radial");

        // check if preloader is present
        expect(preloader).toBeInTheDocument();        
    });

    it("renders all article cards", _ => {
        // render main page
        const { getAllByRole, getByTestId } = render(Main);
        
        // attempt to get preloader
        const preloader = getByTestId("progress-radial");

        // wait for articles to load (5s timeout)
        setTimeout(_ => {
            const articleCards = getAllByRole("button"); // attempt to get all article cards
            expect(preloader).not.toBeInTheDocument(); // check if preloader is removed
            expect(articleCards.length).toBeGreaterThan(0); // check if article cards are present
        }, 5000);
    })
});