import { NextRequest, NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-3-flash-preview';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(req: NextRequest) {
    const { jd } = await req.json();

    if (!jd.trim() || jd.trim().length < 50) {
        return NextResponse.json({ error: 'JD Too Short' }, { status: 400 });
    }

    const prompt = `
        Analyze this job description. Return valid minified JSON only. Do not truncate. Do not use markdown. Do not add commentary.
        { "must_haves": ["skill1", "skill2", ...],
         "nice_to_haves": ["thing1", ...],
         "hidden_flags": [ { "title": "Flag Title", "detail": "one sentence plain English explanation", "severity": "critical|warn" } ],
         "verdict_short": "8-12 word blunt verdict",
         "verdict_score": 1-10,
         "what_they_actually_want": "2 sentences max."
        }   

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
            temperature: 0.2,       // lower = more deterministic JSON
            maxOutputTokens: 4096,
            responseMimeType: 'application/json', // tells Gemini to return raw JSON, no markdown fences
        },
    };

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
    });

    const data = await response.json();

    if(!response.ok){
        console.error('Gemini API error',data);
        return NextResponse.json({error:data?.error?.message || 'Gemini API error'},{status:response.status});
    }
    
    const raw : string = data?.candidates?.[0]?.content?.parts?.[0].text ?? '';
    if(!raw){
        return NextResponse.json({error : 'Empty AI response'},{status:500});
    }


    try{
        const parsed = JSON.parse(raw);
        return NextResponse.json(parsed);
    } catch(error){  
        console.error('Raw Gemini Output :', raw, error);
        return NextResponse.json({ error: 'Invalid response from gemini', raw }, { status: 500 });
    }
}
