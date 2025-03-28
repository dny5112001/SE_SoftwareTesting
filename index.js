const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Log storage for dynamic test results
const testResults = [];

// Extracted functions for testability
function controlFlowExample(num) {
  if (num > 10) {
    return "Greater than 10";
  } else {
    return "10 or less";
  }
}

function dataFlowExample(a, b) {
  let sum = a + b;
  return sum;
}

// Original GET route for demonstration
app.get("/whitebox-testing", (req, res) => {
  res.json({
    message: "White Box Testing Techniques",
    controlFlowTest: controlFlowExample(12), // Should return "Greater than 10"
    dataFlowTest: dataFlowExample(5, 7), // Should return 12
  });
});

// POST route for dynamic test case generation
app.post("/whitebox-testing/dynamic", (req, res) => {
  const { controlFlowInput, dataFlowInputA, dataFlowInputB } = req.body;

  // Validate inputs
  if (
    typeof controlFlowInput !== "number" ||
    typeof dataFlowInputA !== "number" ||
    typeof dataFlowInputB !== "number"
  ) {
    return res.status(400).json({ error: "All inputs must be numbers" });
  }

  // Execute test cases
  const controlResult = controlFlowExample(controlFlowInput);
  const dataResult = dataFlowExample(dataFlowInputA, dataFlowInputB);

  // Log results
  const result = {
    timestamp: new Date().toISOString(),
    controlFlow: { input: controlFlowInput, output: controlResult },
    dataFlow: { inputs: [dataFlowInputA, dataFlowInputB], output: dataResult },
  };
  testResults.push(result);

  // Respond with results
  res.json({
    message: "Dynamic Test Case Executed",
    controlFlowResult: controlResult,
    dataFlowResult: dataResult,
    log: result,
  });
});

// Route to view test logs
app.get("/whitebox-testing/logs", (req, res) => {
  res.json({
    message: "Test Result Logs",
    logs: testResults,
  });
});

// Create server
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Export for testing
module.exports = {
  controlFlowExample,
  dataFlowExample,
  app,
  server,
  testResults,
};
