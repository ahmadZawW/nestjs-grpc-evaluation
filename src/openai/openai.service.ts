import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ChatOpenAI } from "@langchain/openai";
import { traceable } from "langsmith/traceable";
import {
    HumanMessage,
    SystemMessage,
} from "@langchain/core/messages";

@Injectable()
export class OpenaiService {
    private chatModel: ChatOpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>("OPENAI_API_KEY");

        if (!apiKey) {
            throw new Error("Missing OpenAI API Key");
        }
        this.chatModel = new ChatOpenAI({
            openAIApiKey: apiKey,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });

    }

    async evaluate(prompt: string): Promise<{ result: string }> {
        try {
            const tracedCall = traceable(
                async () => {
                    return await this.chatModel.invoke([
                        new SystemMessage(
                            "You are an expert evaluation agent in multi-class natural language classification and evaluation."
                        ),
                        new HumanMessage(prompt),
                    ]);
                },
                {
                    name: "OpenAI Evaluation",
                    inputs: { prompt },
                }
            );
            const response = await tracedCall();

            const resultText =
                typeof response.content === "string"
                    ? response.content
                    : JSON.stringify(response.content);

            return { result: resultText };
        } catch (error) {
            console.error("LangChain OpenAI API Error:", error);
            throw new InternalServerErrorException(
                "Failed to generate response from OpenAI via LangChain"
            );
        }
    }
}
