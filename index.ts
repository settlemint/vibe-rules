#!/usr/bin/env bun
import { render } from "ink";
import React from "react";
import { App } from "./src/components/app.js";

// Run the CLI
if (import.meta.main) {
  render(React.createElement(App));
}
