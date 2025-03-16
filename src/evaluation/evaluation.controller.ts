import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, from } from 'rxjs';
import { EvaluationRequest } from './interfaces/evaluation-request.interface';
import { EvaluationResponse } from './interfaces/evaluation-response.interface';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller()
export class EvaluationController {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @GrpcMethod('EvaluationService', 'Evaluate')
  evaluate(data: EvaluationRequest): Observable<EvaluationResponse> {
    const { message, possible_categories, true_classes, predicted_classes } = data;

    const prompt = ` You are an expert evaluation agent for a multi-class classification system. I need you to review the latest message and determine how well the predicted classes match the true classes.

    The message and classification details are between """:

    """
    Latest Message: ${message}

    Possible Categories: ${possible_categories}

    True Classes: ${true_classes}

    Predicted Classes: ${predicted_classes}
    """

    Think through your evaluation step by step:
    1. First, understand what makes a message belong to each possible category
    2. Examine the message content carefully for indicators of each true class
    3. Calculate exact matches (classes that appear in both true and predicted)
    4. Identify false positives (predicted but not true) and false negatives (true but not predicted)
    5. Consider any ambiguity in the message that might make classification difficult

    Provide your evaluation in this JSON format:

    {{
      "evaluation": {{
        "jaccard_similarity": float, // intersection over union of true and predicted classes
        "exact_match": boolean, // true if predicted exactly matches true classes
        "class_analysis": [
          {{
            "class": "class_name",
            "correctly_predicted": boolean,
            "evidence": "Text evidence supporting this class",
            "confidence": "High/Medium/Low"
          }}
        ],
        "overall_assessment": "Excellent/Good/Fair/Poor match between predictions and true classes",
        "message_difficulty": "Easy/Medium/Hard to classify and why",
        "improvement_suggestions": "Suggestions to improve classification accuracy"
      }}
    }}
`    
    // const messages = [
    //     {"role": "system", "content": "You are an expert in multi-class natural language classification and evaluation."},
    //     {"role": "user", "content": prompt}
    // ];


    return from(
      this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert in multi-class natural language classification and evaluation.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
      }).then((response) => {
        return { result: response.choices[0].message?.content || '' };
      }),
    );
  }
}
