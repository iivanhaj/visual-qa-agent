# Visual QA Agent

A multimodal browser agent that autonomously verifies web application functionality using GPT-4o. The agent captures the visual state of a page (screenshot) and the DOM structure to plan and execute actions (click, type, scroll) based on natural language goals.

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API Key (Access to GPT-4o model required)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iivanhaj/visual-qa-agent.git
   cd visual-qa-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the project directory (ensure `manifest.json` is in the root).

## Usage

1. **Configure API Key**:
   - Open the extension popup from the browser toolbar.
   - Click the settings icon.
   - Enter your OpenAI API Key and save.

2. **Run a Test**:
   - Navigate to the webpage you want to test.
   - Open the extension popup.
   - Enter a goal in plain English (e.g., "Find the 'Sign Up' button and click it").
   - Click **Start Agent**.

3. **Verify Results**:
   - The agent's progress and decisions will be logged in the popup settings panel.
   - You can inspect the background service worker console for detailed logs.
