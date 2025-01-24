Here's a **README.md** file for your GitHub repository:

```markdown
# Google Sheets AI Analyst Add-on

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-1.0.0-blue.svg)](https://developers.google.com/apps-script)

A Google Sheets add-on that leverages Gemini AI to analyze spreadsheet data through natural language queries, with automatic chart generation and flexible data range selection.

## Features

- 🧠 Natural language data analysis using Gemini 2.0 Flash
- 📊 Automatic chart/graph generation
- 🖱️ Interactive range selection or manual A1 notation input
- 🔄 Real-time processing of sheet data
- 🛡️ Secure API key management
- 🌐 Modern responsive UI
- ✅ Input validation and error handling

## Installation

1. **Create New Apps Script Project**
   - Open Google Sheets
   - Go to `Extensions > Apps Script`
   - Delete default code and create 3 files:
     - `Code.gs`
     - `Config.gs`
     - `sidebar.html`

2. **Copy Project Files**
   ```bash
   # Clone repository
   git clone https://github.com/<your-username>/sheets-ai-analyst.git
   ```
   Copy contents of:
   - `Code.gs` to your Apps Script project
   - `sidebar.html` to your Apps Script project
   - `Config.gs` to your Apps Script project

3. **Configure API Key**
   - Get Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Replace `YOUR_API_KEY_HERE` in `Config.gs`

4. **Enable Services**
   - In Apps Script editor:
     - Enable `Google Sheets API`
     - Enable `Google Apps Script API`

## Usage

1. **Open Add-on**
   - Refresh Google Sheet
   - Go to `📊 Sheet Analyst > Open AI Analyst`

2. **Select Data Range**
   - Option 1: Highlight cells → Click "Select"
   - Option 2: Manually enter range (e.g., `A1:D10`)
   - Use "Clear" to reset to full sheet

3. **Ask Questions**
   ```
   "Show monthly sales trends as a bar chart"
   "Compare Q1 and Q2 expenses as pie chart"
   "What's the average revenue for 2023?"
   ```

4. **View Results**
   - Text analysis appears in sidebar
   - Charts created in new sheets
   - Errors shown in red with explanations

## Configuration

```javascript
// Config.gs
const CONFIG = {
  GEMINI_API_KEY: "your_api_key_here", // Required
  DEFAULT_RANGE: "FULL_SHEET" // Change default range if needed
};
```

## Deployment

1. In Apps Script editor:
   - Click `Deploy > New deployment`
   - Select type: `Web app`
   - Set:
     - Execute as: `Me`
     - Access: `Anyone with Google account` (or your preference)
   - Click `Deploy`

## License

MIT License - See [LICENSE](LICENSE) file

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct.

## Acknowledgments

- Google Apps Script team
- Gemini AI by Google DeepMind
- Material Design icons

---

**Note:** Never commit actual API keys to version control. Use `.gitignore` for sensitive files.
```

To set up the repository:

1. Create new GitHub repo: `sheets-ai-analyst`
2. Add these files:
   ```
   .
   ├── Code.gs
   ├── Config.gs
   ├── sidebar.html
   ├── README.md
   ├── LICENSE
   └── .gitignore
   ```

Sample `.gitignore`:
```gitignore
# .gitignore
.gas/
*.log
.env
appsscript.json
```

For the MIT License, create `LICENSE` file with:
```text
MIT License
Copyright (c) [year] [fullname]

Permission is hereby granted...
```

This README provides complete setup instructions, usage examples, and project documentation. You can further customize the badges, add screenshots, or include a demo video link.

Would you like me to add GitHub Actions configuration for automatic deployment or any other specific CI/CD setup?
