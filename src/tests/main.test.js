import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import Main from "../routes/Article.svelte";

describe("Main page", _ => {
    it("renders preloader while articles are still loading", _ => {
        const { getAllByRole, getByTestId } = render(Main);

        const preloader = getByTestId("progress-radial");

        expect(preloader).toBeInTheDocument();        
    });

    it("renders all article cards", _ => {
        const { getAllByRole, getByTestId } = render(Main);
        
        const preloader = getByTestId("progress-radial");

        // wait for 5 seconds for the articles to load
        setTimeout(_ => {
            const articleCards = getAllByRole("button");
            expect(preloader).not.toBeInTheDocument();
            expect(articleCards.length).toBeGreaterThan(0);
        }, 5000);
    })
});