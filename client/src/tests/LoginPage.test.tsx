import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginPage } from "../vash/auth/pages/LoginPage";

describe("Primer describe", () => {
  it("prueb", () => {
    render(<LoginPage />);

    expect(true).toBe(false);
  });
});
