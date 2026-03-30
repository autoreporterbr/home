import { prisma } from '../lib/prisma'

async function main() {
  const article = await prisma.article.upsert({
    where: { slug: "novo-jeep-renegade-2026-hibrido-precos" },
    update: {},
    create: {
      title: "Novo Jeep Renegade 2026 estreia motor híbrido e tem redução de preços em até R$ 18 mil",
      subtitle: "Modelo da Stellantis recebe motorização MHEV de 48V e renovação completa no interior, com foco em tecnologia e conectividade. Versão de entrada agora parte de R$ 143.690.",
      slug: "novo-jeep-renegade-2026-hibrido-precos",
      content: `
<p>A Jeep oficializou o lançamento da linha 2026 do Renegade no mercado brasileiro, trazendo como principal novidade a introdução da motorização híbrida leve (MHEV) de 48V. O sistema, que faz sua estreia na marca, visa aumentar a eficiência energética e melhorar as respostas do SUV em ambiente urbano. Além da atualização mecânica, o modelo recebeu uma reformulação significativa em sua cabine e novos pacotes tecnológicos.</p>

<p>No interior, o Renegade 2026 apresenta um painel redesenhado com materiais de acabamento superior. Todas as versões agora contam com quadro de instrumentos 100% digital, enquanto as configurações de topo recebem uma nova central multimídia de 10,1 polegadas com integração nativa da assistente virtual Alexa. O console central também foi modificado, passando a oferecer saídas de ar dedicadas para os passageiros do banco traseiro.</p>

<p>Em termos de segurança e conveniência, a linha 2026 incorpora o sistema Adventure Intelligence em todas as variantes. O pacote inclui recursos de assistência 24 horas, comandos de voz e a capacidade de receber atualizações de software de forma remota (Over-the-Air). Para o fora-de-estrada, a versão Willys permanece como a única opção 4x4 do segmento B-SUV, equipada com câmbio automático de nove marchas e seletor com cinco modos de terreno.</p>

<p>Uma das estratégias da Jeep para a nova linha foi o reposicionamento comercial, resultando em reduções de preços em diversas versões. A variante Altitude, por exemplo, teve seu valor reduzido em R$ 18 mil, passando a ser comercializada por R$ 143.690. A fabricante também estendeu a garantia de fábrica para cinco anos em toda a gama Renegade.</p>

<p><strong>Preços e Versões do Jeep Renegade 2026:</strong></p>
<ul>
  <li><strong>Jeep Renegade Altitude:</strong> R$ 143.690</li>
  <li><strong>Jeep Renegade Night Eagle:</strong> R$ 154.690</li>
  <li><strong>Jeep Renegade Longitude:</strong> R$ 158.690</li>
  <li><strong>Jeep Renegade Sahara:</strong> R$ 175.990</li>
  <li><strong>Jeep Renegade Willys:</strong> R$ 189.990</li>
</ul>
      `,
      imageUrl: "/images/articles/jeep-renegade-2026.png",
      editoria: "noticias",
      category: "Lançamentos",
      status: "published",
      source: "Stellantis Media",
      sourceUrl: "https://www.media.stellantis.com/br-pt/jeep/press/a-evolucao-do-icone-novo-jeep-renegade-chega-com-interior-completamente-novo-novas-tecnologias-motorizacao-hibrida-mhev-e-reducao-de-preco",
      authorName: "Redação Auto Repórter",
      publishedAt: new Date()
    }
  })
  console.log("Article created/updated:", article.title)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
