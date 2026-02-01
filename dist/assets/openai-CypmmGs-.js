import{O as t}from"./index-DU3xAm2I.js";const o=async()=>(await chrome.storage.local.get(["openai_api_key"])).openai_api_key,n=async()=>{const e=await o();if(!e)throw new Error("OpenAI API Key not found. Please set it in the extension settings.");return new t({apiKey:e,dangerouslyAllowBrowser:!0})},i=`
You are a Visual QA Agent acting as a user on a webpage. 
Your goal is to achieve the user's objective by interacting with the page.
You will receive a description of the current page state (either DOM or screenshot analysis) and the user's goal.
You must output a JSON object with the next action to perform.

Allowed Actions:
- CLICK: { type: "CLICK", selector: "css_selector", description: "Clicking the login button" }
- TYPE: { type: "TYPE", selector: "css_selector", text: "my_password", description: "Typing password" }
- SCROLL: { type: "SCROLL", direction: "down", description: "Scrolling down to find footer" }
- FINISH: { type: "FINISH", success: true, message: "Goal achieved!" }
- ASK: { type: "ASK", question: "I am stuck, what should I do?" }
`;export{i as A,n as c};
