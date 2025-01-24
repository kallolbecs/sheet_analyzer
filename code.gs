function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 Sheet Analyst')
    .addItem('Open AI Analyst', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('AI Data Analyst')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getActiveRangeNotation() {
  try {
    const range = SpreadsheetApp.getActiveSpreadsheet()
      .getActiveSheet()
      .getActiveRange()
      .getA1Notation();
    return range || 'FULL_SHEET';
  } catch (e) {
    return 'FULL_SHEET';
  }
}

function processQuery(query, rangeInput) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const range = validateRange(sheet, rangeInput);
    const data = range === 'FULL_SHEET' ? 
      getFullSheetData(sheet) : 
      getRangeData(sheet, range);
    
    const response = callGeminiAPI(query, data);
    return handleResponse(response, ss);
  } catch (error) {
    console.error(error);
    throw new Error(`Processing failed: ${error.message}`);
  }
}

function validateRange(sheet, rangeInput) {
  if (rangeInput.toUpperCase() === 'FULL_SHEET') return 'FULL_SHEET';
  
  try {
    sheet.getRange(rangeInput);
    return rangeInput;
  } catch (e) {
    throw new Error(`Invalid range: "${rangeInput}" - Use A1 notation or "FULL_SHEET"`);
  }
}

function getFullSheetData(sheet) {
  const range = sheet.getDataRange();
  return formatData(range.getDisplayValues());
}

function getRangeData(sheet, rangeInput) {
  const range = sheet.getRange(rangeInput);
  return formatData(range.getDisplayValues());
}

function formatData(data) {
  return data.map(row => row.join(",")).join("\n");
}

function callGeminiAPI(query, csvData) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
  
  const prompt = `Analyze this spreadsheet data and answer the question. Follow these rules:
  1. Be concise but thorough
  2. Format numbers properly
  3. For charts, use this format:
     <chart>
     type: [chart_type]
     title: [title]
     ${csvData}
     </chart>

  Data (CSV):
  ${csvData}

  Question: ${query}`;

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        maxOutputTokens: 2000
      }
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  if (result.error) {
    throw new Error(`API Error: ${result.error.message}`);
  }
  
  return result.candidates[0].content.parts[0].text;
}

function handleResponse(response, spreadsheet) {
  const chartMatch = response.match(/<chart>([\s\S]*?)<\/chart>/);
  if (!chartMatch) return response;

  try {
    const chartContent = chartMatch[1].trim().split('\n');
    const chartType = chartContent.shift().split(': ')[1];
    const chartTitle = chartContent.shift().split(': ')[1];
    const csvData = chartContent.join('\n');

    const chartSheet = spreadsheet.insertSheet(`Chart - ${new Date().toLocaleString()}`);
    const data = Utilities.parseCsv(csvData);
    chartSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

    const chart = createChart(chartSheet, chartType, chartTitle);
    return `${response.replace(/<chart>[\s\S]*<\/chart>/, '')}\n\n✅ Chart created in "${chartSheet.getName()}"`;
  } catch (error) {
    console.error('Chart Error:', error);
    return `${response}\n\n⚠️ Chart creation failed: ${error.message}`;
  }
}

function createChart(sheet, type, title) {
  const chartTypes = {
    line: Charts.ChartType.LINE,
    bar: Charts.ChartType.BAR,
    column: Charts.ChartType.COLUMN,
    pie: Charts.ChartType.PIE,
    area: Charts.ChartType.AREA
  };

  const chart = sheet.newChart()
    .setChartType(chartTypes[type.toLowerCase()] || Charts.ChartType.COLUMN)
    .addRange(sheet.getDataRange())
    .setPosition(2, 2, 0, 0)
    .setOption('title', title)
    .setOption('legend', { position: 'bottom' })
    .build();

  sheet.insertChart(chart);
  return chart;
}
