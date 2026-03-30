import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function rewriteNews(originalText: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Reescreva a notícia abaixo como uma matéria jornalística neutra e imparcial para um portal automotivo chamado "Auto Repórter". 
    Mantenha todas as especificações técnicas, preços e dados factuais, mas elimine adjetivos publicitários e tom de "press release".
    
    O texto final deve:
    1. Ter um título impactante e otimizado para SEO (focado em palavras-chave como o nome do carro e marca).
    2. Ter um subtítulo (lead) que resuma os pontos principais em 2 ou 3 frases.
    3. Ter um corpo de texto fluído, dividido em 4 a 6 parágrafos, usando linguagem natural e humana.
    4. Utilizar formatação HTML simples (<p>, <strong> para termos importantes, <ul>/<li> para listas técnicas).
    
    Importante: O texto deve parecer escrito por um jornalista especializado, não uma cópia ou tradução automática. Não use frases como "Segundo o comunicado" ou "A marca anunciou". Escreva como se o Auto Repórter estivesse dando a notícia.
    
    Retorne o resultado no seguinte formato JSON:
    {
      "title": "título aqui",
      "subtitle": "subtítulo aqui",
      "content": "corpo do texto em HTML"
    }
    
    Texto original:
    ${originalText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (sometimes Gemini adds markdown block)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Rewrite Error:", error);
    return null;
  }
}
