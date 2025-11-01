import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RoadmapStep, Opportunity, Citation, TTSVoice, AnalyticsData, ATSAnalysisResult, GeneratedQuiz } from '../types';

// Fix: Use `process.env.API_KEY` as per coding guidelines, which resolves the TypeScript error.
// The API key must be obtained exclusively from this environment variable.
if (!process.env.API_KEY) {
    // This provides a clear error if the environment variable is not set.
    throw new Error("API_KEY environment variable not set. Please ensure it is configured in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const roadmapSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      step: {
        type: Type.INTEGER,
        description: 'The step number in the roadmap, starting from 1.',
      },
      title: {
        type: Type.STRING,
        description: 'A concise title for this step of the roadmap.',
      },
      description: {
        type: Type.STRING,
        description: 'A detailed description of what to learn or do in this step.',
      },
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'A list of key skills to acquire during this step.',
      },
      resources: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'A list of suggested resources, like course types, books, or projects.',
      },
    },
    required: ["step", "title", "description", "skills", "resources"],
  },
};

export const generateCareerRoadmap = async (interests: string): Promise<RoadmapStep[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following interests and goals, create a detailed, step-by-step career roadmap. The user is looking for guidance on what to learn and in what order to achieve their career goals. Interests: "${interests}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
      },
    });

    const jsonText = response.text.trim();
    const roadmap = JSON.parse(jsonText) as RoadmapStep[];
    return roadmap.sort((a, b) => a.step - b.step);

  } catch (error) {
    console.error("Error generating career roadmap:", error);
    throw new Error("Failed to generate career roadmap. The AI may be experiencing high traffic. Please try again later.");
  }
};

export const fetchOpportunities = async (query: string): Promise<{ opportunities: Opportunity[]; citations: Citation[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Using Google Search, find and list up to 10 real-time global opportunities based on the user's query: "${query}". Include a mix of national (Indian) and international university admissions, tech and non-tech internships, scholarships, and jobs. For each, provide a title, organization, category (one of 'Scholarship', 'Internship', 'Admission', 'Workshop', 'Job'), location, a brief description, deadline in YYYY-MM-DD format, and a direct URL. Respond with ONLY a valid JSON array of objects with these keys: "title", "organization", "category", "location", "description", "deadline", "url". Do not add any other text or formatting.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        // More robust JSON parsing to handle potential conversational text from the model.
        let jsonText = response.text.trim();
        const jsonStartIndex = jsonText.indexOf('[');
        const jsonEndIndex = jsonText.lastIndexOf(']');

        if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
        } else {
            // Throw a specific error if a JSON array is not found.
            throw new SyntaxError("Could not find a valid JSON array in the AI's response.");
        }

        const opportunities = JSON.parse(jsonText) as Opportunity[];
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const citations: Citation[] = groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web?.title)
            .reduce((acc: Citation[], current) => {
                // Deduplicate citations based on URI
                if (!acc.some(item => item.uri === current.uri)) {
                    acc.push(current);
                }
                return acc;
            }, []);

        return { opportunities, citations };
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        if (error instanceof SyntaxError) {
            throw new Error("The AI returned information in an unexpected format. Please try rephrasing your query.");
        }
        throw new Error("Failed to fetch opportunities. The AI may be busy. Please try again later.");
    }
};

export const generateSpeech = async (textToSpeak: string, voiceName: TTSVoice = 'Kore'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say clearly: ${textToSpeak}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate audio. Please try again.");
    }
};

export const generateLessonSummary = async (lessonTitle: string, lessonDescription: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a concise, one-paragraph summary for the following lesson titled "${lessonTitle}". The lesson covers: "${lessonDescription}". Focus on the key takeaways for a learner.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating lesson summary:", error);
        throw new Error("Failed to generate summary. The AI may be busy. Please try again.");
    }
};

export const getAnalyticsInsights = async (query: string, data: AnalyticsData): Promise<string> => {
    try {
        const prompt = `
            You are a senior data analyst for an educational platform called Saumya Path.
            Analyze the following JSON data to answer the user's query.
            Provide a clear, concise, and helpful answer based ONLY on the data provided.
            Format your response in readable Markdown.

            User Query: "${query}"

            Platform Data:
            ${JSON.stringify(data, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating analytics insights:", error);
        throw new Error("Failed to generate insights. The AI may be busy. Please try again.");
    }
};

const atsAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 representing how well the resume matches the job description.",
        },
        matchingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important keywords from the job description that were found in the resume.",
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important keywords from the job description that were NOT found in the resume.",
        },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific, actionable suggestions for improving the resume based on the job description. For example, 'Incorporate the keyword 'Agile Methodologies' into your project descriptions.'",
        }
    },
    required: ["matchScore", "matchingKeywords", "missingKeywords", "suggestions"],
};

export const analyzeResumeWithATS = async (resumeText: string, jobDescription: string): Promise<ATSAnalysisResult> => {
    try {
        const prompt = `
            Act as an advanced AI-powered Applicant Tracking System (ATS) and resume optimization expert.
            Your task is to meticulously compare the provided resume against the given job description.
            Provide a detailed analysis strictly in the required JSON format.

            Here is the analysis you need to perform:
            1.  **Match Score**: Calculate a percentage score (0-100) that quantifies how well the resume aligns with the job description's requirements.
            2.  **Keyword Analysis**:
                a. Extract the most crucial skills, technologies, and qualifications (keywords) from the job description.
                b. Identify which of these keywords are present in the resume.
                c. Identify which keywords are missing from the resume.
            3.  **Actionable Suggestions**: Provide concrete, actionable recommendations for the user to improve their resume. The suggestions should be specific and directly related to bridging the gaps identified between the resume and the job description.

            **Resume Content:**
            ---
            ${resumeText}
            ---

            **Job Description:**
            ---
            ${jobDescription}
            ---

            Now, provide the analysis in the specified JSON format.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: atsAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ATSAnalysisResult;

    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Failed to analyze resume. The AI may be experiencing high traffic or the provided text is too long. Please try again with a concise resume and job description.");
    }
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text.",
                    },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 4 multiple-choice options.",
                    },
                    correctAnswer: {
                        type: Type.INTEGER,
                        description: "The 0-indexed integer of the correct answer in the options array.",
                    },
                },
                required: ["question", "options", "correctAnswer"],
            },
        },
    },
    required: ["questions"],
};

export const generateQuizForLesson = async (lessonTitle: string, lessonDescription: string): Promise<GeneratedQuiz> => {
    try {
        const prompt = `
            Based on the following lesson content, create a short multiple-choice quiz with exactly 3 questions to test a user's understanding.
            Each question must have 4 options.

            Lesson Title: "${lessonTitle}"
            Lesson Description: "${lessonDescription}"

            Return the quiz in the specified JSON format.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedQuiz;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. The AI may be busy. Please try again.");
    }
};
