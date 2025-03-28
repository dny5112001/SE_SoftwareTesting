const {
  controlFlowExample,
  dataFlowExample,
  app,
  server,
  testResults,
} = require("../index"); // Adjust path if needed (e.g., "./index" if in same dir)
const request = require("supertest");

describe("White Box Testing", () => {
  // Control Flow Testing
  test("Control Flow: Should return correct message based on input", () => {
    expect(controlFlowExample(12)).toBe("Greater than 10");
    expect(controlFlowExample(5)).toBe("10 or less");
  });

  // Data Flow Testing
  test("Data Flow: Should correctly add two numbers", () => {
    expect(dataFlowExample(3, 4)).toBe(7);
    expect(dataFlowExample(-2, 2)).toBe(0);
  });

  // Dynamic Test Case API Testing
  describe("Dynamic Test Case Endpoint", () => {
    test("POST /whitebox-testing/dynamic should return correct results", async () => {
      const response = await request(app) // Use `app` directly
        .post("/whitebox-testing/dynamic")
        .send({ controlFlowInput: 15, dataFlowInputA: 8, dataFlowInputB: 3 });

      expect(response.status).toBe(200);
      expect(response.body.controlFlowResult).toBe("Greater than 10");
      expect(response.body.dataFlowResult).toBe(11);
    });

    test("POST /whitebox-testing/dynamic should reject invalid input", async () => {
      const response = await request(app) // Use `app` directly
        .post("/whitebox-testing/dynamic")
        .send({
          controlFlowInput: "invalid",
          dataFlowInputA: 8,
          dataFlowInputB: 3,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All inputs must be numbers");
    });

    test("Logs should capture test results", async () => {
      await request(app) // Use `app` directly
        .post("/whitebox-testing/dynamic")
        .send({ controlFlowInput: 7, dataFlowInputA: 2, dataFlowInputB: 5 });

      expect(testResults.length).toBeGreaterThan(0);
      expect(testResults[testResults.length - 1].controlFlow.output).toBe(
        "10 or less"
      );
      expect(testResults[testResults.length - 1].dataFlow.output).toBe(7);
    });
  });

  // Cleanup (only if server is running)
  afterAll((done) => {
    if (server && typeof server.close === "function") {
      server.close(done);
    } else {
      done();
    }
  });
});
