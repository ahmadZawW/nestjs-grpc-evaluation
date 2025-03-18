import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenaiService {
    private openai: OpenAI;

    constructor(private configService: ConfigService ) {
        const apiKey = this.configService.get<string>("OPENAI_API_KEY"); 
        if (!apiKey) {
            throw new Error("Missing OpenAI API Key");
        }
        this.openai = new OpenAI({ apiKey });
    }

    async evaluate(prompt: string): Promise<{ result: string }> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert evaluation agent in multi-class natural language classification and evaluation.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0,
            });
            return { result: response.choices[0]?.message?.content || "" };
        } catch (error) {
            console.error("OpenAI API Error:", error);
            throw new InternalServerErrorException("Failed to generate response from OpenAI");
        }
    }
}
