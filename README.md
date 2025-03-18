# NestJS gRPC Evaluation Service

This project is a microservice built using NestJS that provides an evaluation service for multi-class classification systems. It integrates with OpenAI's GPT model to assess the accuracy of predicted classifications against true classifications.

## Features
- Receives classification evaluation requests via gRPC
- Uses OpenAI's GPT to analyze classification performance
- Returns structured JSON feedback with assessment metrics

## Prerequisites
- Node.js (v16+ recommended)
- NestJS CLI installed globally (`npm install -g @nestjs/cli`)
- OpenAI API key
- gRPC installed and configured

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/nestjs-grpc-evaluation.git
   cd nestjs-grpc-evaluation
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

## Running the Service

Start the gRPC microservice with:
```sh
npm run start
```

To run in watch mode for development:
```sh
npm run start:dev
```

## gRPC API
The service exposes the `Evaluate` method under `EvaluationService`.

### Request Format
```json
{
  "message": "Some input text",
  "possibleCategories": ["Category1", "Category2"],
  "trueClasses": ["Category1"],
  "predictedClasses": ["Category2"]
}
```

### Response Format
```json
{
  "result": "{
    \"evaluation\": {
      \"jaccard_similarity\": 0.5,
      \"exact_match\": false,
      \"class_analysis\": [
        { \"class\": \"Category1\", \"correctly_predicted\": true, \"evidence\": \"Text evidence...\", \"confidence\": \"High\" }
      ],
      \"overall_assessment\": \"Good match\",
      \"message_difficulty\": \"Medium\",
      \"improvement_suggestions\": \"Consider refining model classification\"
    }
  }"
}
```

## Using `grpcurl` for Testing

You can test the gRPC service using `grpcurl`:

```sh
grpcurl -plaintext -d '{
  "message": "I need help setting up my new account, and I also want to report a bug in the checkout process.",
  "possibleCategories": ["question", "bug_report", "feature_request", "account_issue", "billing_problem"],
  "trueClasses": ["question", "bug_report", "account_issue"],
  "predictedClasses": ["question", "account_issue", "feature_request"]
}' localhost:50051 evaluation.EvaluationService/Evaluate
```

### Example Response
```json
{
  "result": {
    "evaluation": {
      "jaccard_similarity": 0.5,
      "exact_match": false,
      "class_analysis": [
        {
          "class": "question",
          "correctly_predicted": true,
          "evidence": "The message mentions needing help setting up an account, which is a typical question.",
          "confidence": "High"
        },
        {
          "class": "bug_report",
          "correctly_predicted": false,
          "evidence": "The message also mentions reporting a bug in the checkout process, indicating a bug report.",
          "confidence": "Medium"
        },
        {
          "class": "feature_request",
          "correctly_predicted": false,
          "evidence": "There is no explicit mention of a feature request in the message.",
          "confidence": "Low"
        },
        {
          "class": "account_issue",
          "correctly_predicted": true,
          "evidence": "The message mentions needing help setting up an account, aligning with an account issue.",
          "confidence": "High"
        },
        {
          "class": "billing_problem",
          "correctly_predicted": false,
          "evidence": "There is no mention of a billing problem in the message.",
          "confidence": "Low"
        }
      ],
      "overall_assessment": "Fair match between predictions and true classes",
      "message_difficulty": "Medium to classify due to the presence of multiple categories in the message, leading to some ambiguity.",
      "improvement_suggestions": "Consider incorporating more context analysis to differentiate between closely related classes like account_issue and feature_request."
    }
  }
}

```

---
**Author:** Ahmad Aboadas

