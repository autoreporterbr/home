import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Quem Somos | Auto Repórter',
  description: 'Conheça a história e o compromisso do Auto Repórter com o jornalismo automotivo sério e imparcial.',
}

export default function QuemSomosPage() {
  return (
    <div>
      <Header />
      <main className="max-w-[1000px] mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-2 bg-yellow-400 rounded-full" />
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tight leading-none">
            Jornalismo que acelera com <span className="text-yellow-500">imparcialidade.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
            O Auto Repórter nasceu da paixão por automóveis e da necessidade de um portal que fale a língua do consumidor brasileiro, sem vícios comerciais.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Nossa Missão</h2>
              <p className="text-gray-600 leading-relaxed">
                Nossa missão é fornecer informações precisas, avaliações técnicas rigorosas e as últimas notícias do mundo automotivo de forma clara e acessível. 
                Acreditamos que todo comprador de carro merece saber a verdade sobre o que está colocando em sua garagem.
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Metodologia</h2>
              <p className="text-gray-600 leading-relaxed">
                Nosso sistema de ranking exclusivo avalia 8 pilares fundamentais: acabamento, infotenimento, espaço, porta-malas, desempenho, dirigibilidade, conforto e consumo. 
                As notas são atribuídas por especialistas com base em testes reais de rodagem.
              </p>
           </div>
           <div className="bg-black p-10 rounded-3xl text-white space-y-6 shadow-2xl transform rotate-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-yellow-400">Por Douglas Lemos</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Idealizador e editor-chefe do Auto Repórter, Douglas Lemos combina anos de experiência r cobrindo o setor automotivo com uma visão crítica e moderna sobre a mobilidade no Brasil.
              </p>
              <div className="flex gap-4">
                 <div className="w-12 h-1 bg-yellow-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Editoria-chefe</span>
              </div>
           </div>
        </div>

        <div className="mt-24 p-12 bg-gray-50 rounded-3xl text-center">
           <h2 className="text-3xl font-black mb-4">FAÇA PARTE DO GRUPO</h2>
           <p className="text-gray-500 mb-8 max-w-md mx-auto">Receba novidades semanais e alertas de lançamentos diretamente no seu e-mail.</p>
           <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Seu melhor e-mail" className="form-input !rounded-full text-center" />
              <button className="btn-primary !rounded-full px-10">INSCREVER</button>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
