import { NextRequest, NextResponse } from 'next/server';

const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

export async function POST(req: NextRequest) {
    const { jd, selectedSkills } = await req.json();

    if (!jd.trim() || jd.trim().length < 50) {
        return NextResponse.json({ error: 'JD Too Short' }, { status: 400 });
    }

    const skillList = Array.isArray(selectedSkills) && selectedSkills.length > 0
        ? selectedSkills.map((s: string) => `"${s}"`).join(', ')
        : 'none selected';

    const prompt = `
        Analyze this job description. Return valid minified JSON only. Do not truncate. Do not use markdown. Do not add commentary.
         { "must_haves": ["skill1", "skill2", ...], // keep each item 1-2 words max, no phrases
          "nice_to_haves": ["thing1", ...], // keep each item 1-2 words max, no phrases
         "hidden_flags": [ { "title": "Flag Title", "detail": "one sentence plain English explanation (must be specific to the JD; if unsure leave detail as empty string, never use fallback phrases)", "severity": "critical|warn" } ],
         "verdict_short": "8-12 word blunt verdict",
         "verdict_score": 1-10,
         "what_they_actually_want": "2 sentences max."
        }   

        The candidate has these skills: [${skillList}]
        
        Also include a skill match analysis:
        "skill_match_score": number 0-100 rating how well the candidate's skills match the role (weigh must-haves more than nice-to-haves),
        "skill_match_details": array of {"skill": "<name>", "matched": bool, "source": "must_have"|"nice_to_have"|"mentioned"|null, "note": "one sentence explanation"}
        
        Use your understanding of skill synonyms (e.g. "React" matches "React.js", "JavaScript" matches "JS", "C++" matches "Cpp", "TypeScript" matches "TS").
        If the candidate selected no skills, set skill_match_score to null and skill_match_details to an empty array.

        Return ONLY the JSON. No markdown, no explanation. JD: ${jd}
        `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    const geminiBody = {
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
            responseJsonSchema: {
                type: 'object',
                properties: {
                    must_haves: { type: 'array', items: { type: 'string' } },
                    nice_to_haves: { type: 'array', items: { type: 'string' } },
                    hidden_flags: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                detail: { type: 'string' },
                                severity: { type: 'string', enum: ['critical', 'warn'] },
                            },
                            required: ['title', 'detail', 'severity'],
                        },
                    },
                    verdict_short: { type: 'string' },
                    verdict_score: { type: 'number' },
                    what_they_actually_want: { type: 'string' },
                    skill_match_score: { type: 'number' },
                    skill_match_details: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                skill: { type: 'string' },
                                matched: { type: 'boolean' },
                                source: { type: 'string' },
                                note: { type: 'string' },
                            },
                            required: ['skill', 'matched', 'source', 'note'],
                        },
                    },
                },
                required: [
                    'must_haves', 'nice_to_haves', 'hidden_flags',
                    'verdict_short', 'verdict_score', 'what_they_actually_want',
                    'skill_match_score', 'skill_match_details',
                ],
            },
        },
    };

    let lastError: string | null = null;

    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiBody),
        });

        const data = await response.json();

        if (!response.ok) {
            const msg = data?.error?.message || 'Gemini API error';
            console.error(`Gemini API error with ${model}:`, msg);
            lastError = msg;
            if (response.status === 500 || response.status === 404 || response.status === 400) {
                continue;
            }
            return NextResponse.json({ error: msg }, { status: response.status });
        }

        const raw: string = data?.candidates?.[0]?.content?.parts?.[0].text ?? '';
        if (!raw) {
            lastError = 'Empty AI response';
            console.error(`Empty response from ${model}`);
            continue;
        }

        try {
            const parsed = JSON.parse(raw);
            return NextResponse.json(parsed);
        } catch (error) {
            console.error(`Raw output from ${model}:`, raw, error);
            lastError = 'Invalid response from gemini';
            continue;
        }
    }

    return NextResponse.json({ error: lastError || 'All models failed' }, { status: 500 });
}
