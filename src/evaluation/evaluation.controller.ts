import { Controller, InternalServerErrorException } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Observable, from } from "rxjs";
import { EvaluationRequest } from "./interfaces/evaluation-request.interface";
import { EvaluationResponse } from "./interfaces/evaluation-response.interface";
import { OpenaiService } from "../openai/openai.service";


@Controller()
export class EvaluationController {
  constructor(private readonly openaiService: OpenaiService) {}

  @GrpcMethod("EvaluationService", "Evaluate")
  evaluate(data: EvaluationRequest): Observable<EvaluationResponse> {
    const { message, possibleCategories, trueClasses, predictedClasses } = data;

    const prompt = `I need you to review the latest message and determine how well the predicted classes match the true classes.

    The message and classification details are between tags <parameterName>  </parameterName>:
    <message> ${message} </message>
    <possibleCategories> ${possibleCategories} </possibleCategories>
    <trueClasses> ${trueClasses} </trueClasses>
    <predictedClasses> ${predictedClasses} </predictedClasses>

    Think through your evaluation step by step:
    1. First, understand what makes a message belong to each possible category
    2. Examine the message content carefully for indicators of each true class
    3. Calculate exact matches (classes that appear in both true and predicted)
    4. Identify false positives (predicted but not true) and false negatives (true but not predicted)
    5. Consider any ambiguity in the message that might make classification difficult

    Provide your evaluation in this JSON format:

    {{
      "evaluation": {{
        "jaccardSimilarity": float, // intersection over union of true and predicted classes
        "exactMatch": boolean, // true if predicted exactly matches true classes
        "classAnalysis": [
          {{
            "class": "className",
            "correctlyPredicted": boolean,
            "evidence": "Text evidence supporting this class",
            "confidence": "High/Medium/Low"
          }}
        ],
        "overallAssessment": "Excellent/Good/Fair/Poor match between predictions and true classes",
        "messageDifficulty": "Easy/Medium/Hard to classify and why",
        "improvementSuggestions": "Suggestions to improve classification accuracy"
      }}
    }}
`;
    try {
      return from(this.openaiService.evaluate(prompt));
    } catch (error) {
      console.error("gRPC OpenAI Error:", error);
      throw new InternalServerErrorException(
        "Error processing OpenAI completion request."
      );
    }
  }
}
