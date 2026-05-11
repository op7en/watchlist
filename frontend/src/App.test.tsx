import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import { logout } from "./features/auth/authSlice";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    }),
    get: jest.fn(),
    isAxiosError: jest.fn(),
  },
}));

test("renders auth form when user is logged out", () => {
  store.dispatch(logout());

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});
