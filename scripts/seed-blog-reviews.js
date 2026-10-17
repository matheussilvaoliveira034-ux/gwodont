const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { getDb, saveBlogPost, insertReview } = require('../lib/db');

async function seedBlogAndReviews() {
  console.log('Seeding Blog Posts and Verified Google Reviews...');
  const db = getDb();

  // 1. SEED BLOG POSTS
  const existingPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
  if (existingPosts.count === 0) {
    const posts = [
      {
        slug: 'bruxismo-do-sono-vs-vigilia-como-identificar',
        title: 'Bruxismo do Sono vs. Bruxismo em Vigília: Como Identificar e Tratar as Dores Orofaciais',
        excerpt: 'Apertar ou ranger os dentes causa desgaste silencioso do esmalte e dores musculares tensionais. Conheça as diferenças clínicas entre o padrão noturno e diurno e as abordagens com placas NTI e LIVA.',
        category: 'Bruxismo & ATM',
        tags: 'bruxismo, dores orofaciais, nti, liva, atm, oclusao',
        reading_time: '4 min de leitura',
        author: 'Dr. Guilad Weil',
        is_published: 1,
        content: `O bruxismo é uma atividade repetitiva dos músculos mastigatórios caracterizada pelo aperto ou ranger dos dentes e pelo encostamento involuntário da mandíbula. Embora frequentemente tratado como uma única condição, a literatura clínica e a prática odontológica dividem o bruxismo em duas manifestações distintas: o bruxismo do sono e o bruxismo em vigília (diurno).

### 1. Bruxismo do Sono: Rangimento e Microdespertares
No bruxismo noturno, o paciente costuma ranger os dentes de forma rítmica ou contrair a mandíbula com força máxima durante episódios de microdespertares cerebrais. Os sintomas mais frequentes ao acordar incluem:
- Sensação de cansaço ou dor nos músculos masseter e temporal;
- Dores de cabeça tensionais logo pela manhã;
- Desgastes planos nas bordas incisais e superfícies oclusais;
- Trincas imperceptíveis que aumentam a sensibilidade a alimentos frios.

### 2. Bruxismo em Vigília: O Aperto Silencioso do Dia a Dia
Diferente do sono, o bruxismo em vigília consiste predominantemente no aperto sustentado ou na sustentação de tensão muscular estática enquanto o indivíduo trabalha, dirige ou se concentra em tarefas exigentes. Muitas pessoas nem percebem que seus dentes permanecem encostados por horas a fio.

### Abordagens Terapêuticas no Consultório
O bruxismo não possui uma cura medicamentosa mágica; seu manejo responsável tem três pilares:
1. **Proteção Oclusal:** Confecção de placas de alívio muscular e proteção dental, como os dispositivos NTI (aprovado pelo FDA para controle de cefaleias tensionais e desprogramação neuromuscular) e o sistema LIVA;
2. **Conscientização e Biofeedback:** Técnicas para orientar o paciente a manter dentes afastados durante o dia (lábios selados, dentes desoclusos);
3. **Mapeamento de Desgaste:** Acompanhamento regular para evitar que a perda de dimensão vertical afete a harmonia mastigatória.

Na GW Odontologia em Pinheiros, realizamos exame minucioso da articulação temporomandibular (ATM), palpação muscular e oclusão para indicar o tratamento mais conservador e biologicamente seguro para o seu caso.`,
      },
      {
        slug: 'laserterapia-para-herpes-labial-e-aftas',
        title: 'Laserterapia de Baixa Potência: Como a Bioestimulação Celular Alivia Herpes Labial e Aftas',
        excerpt: 'A aplicação da luz laser clínica (LLLT) acelera a cicatrização tecidual, proporciona alívio imediato do desconforto e estimula a imunidade local sem causar dor.',
        category: 'Laserterapia',
        tags: 'laserterapia, herpes labial, aftas, lllt, bioestimulacao',
        reading_time: '5 min de leitura',
        author: 'Dr. Guilad Weil',
        is_published: 1,
        content: `O herpes labial e as estomatites aftosas recorrentes causam grande incômodo físico, desconforto ao falar e mastigar e constrangimento estético para os pacientes. Nos últimos anos, a Laserterapia de Baixa Intensidade (Low-Level Laser Therapy – LLLT) consolidou-se como uma das ferramentas clínicas mais seguras e eficazes para o controle dessas lesões.

### Como a Luz Laser Atua nas Células?
A laserterapia clínica utiliza fótons de luz em comprimentos de onda específicos (vermelho e infravermelho próximo) que interagem com os fotorreceptores celulares das mitocôndrias (como o citocromo c oxidase). Esse processo biológico, chamado fotobiomodulação:
- Aumenta a produção de energia celular (ATP);
- Acelera a síntese de colágeno e a regeneração tecidual;
- Promove ação anti-inflamatória e analgésica rápida por modulação de mediadores químicos;
- Diminui o inchaço e a queimação local.

### O Momento Ideal para a Aplicação
No caso do herpes labial (vírus HSV-1):
- **Fase Prodrômica (formigamento, coceira ou vermelhidão inicial):** Quando aplicada nesta fase inicial, a laserterapia pode até mesmo abortar a evolução para vesículas cheias de líquido, reduzindo drasticamente o tempo total do surto;
- **Fase de Vesículas e Crostas:** A aplicação promove alívio imediato da dor e encurta o período de cicatrização de semanas para poucos dias, prevenindo infecções bacterianas secundárias.

### Procedimento Totalmente Indolor e Sem Medicamentos Químicos
A aplicação do laser dura apenas alguns minutos por ponto, não provoca dor nem queimação e não requer anestesia. É especialmente benéfica para pacientes que apresentam crises recorrentes ou que não toleram bem medicamentos antivirais tópicos e sistêmicos.

No consultório do Dr. Guilad Weil em Pinheiros, contamos com equipamento laser moderno e calibrado com protocolos clínicos rigorosos para acolher urgências e tratamentos programados.`,
      },
      {
        slug: 'odontologia-conservadora-preservacao-dental',
        title: 'Por que a Preservação do Dente Natural é a Prioridade da Odontologia Moderna',
        excerpt: 'Com técnicas adesivas de precisão, lupa de magnificação e materiais biocompatíveis, a odontologia clínica moderna foca em manter a integridade dos dentes naturais pelo maior tempo possível.',
        category: 'Clínica Geral',
        tags: 'odontologia clinica, prevencao, restauracao, conservacao, integridade dental',
        reading_time: '4 min de leitura',
        author: 'Dr. Guilad Weil',
        is_published: 1,
        content: `Na busca por tratamentos rápidos e tendências passageiras, muitas intervenções odontológicas acabam desgastando excessivamente a estrutura dental saudável. Contudo, a evidência científica mais sólida demonstra que nenhum biomaterial artificial supera a resiliência biológica e a propriocepção do dente natural mantido em saúde.

### Os Pilares da Odontologia Conservadora
A prática clínica do Dr. Guilad Weil, pautada por mais de 30 anos de atuação contínua após graduação pela Universidade de São Paulo (USP), fundamenta-se nos seguintes princípios:

1. **Diagnóstico Precoce:** Detectar lesões iniciais e desgastes oclusais antes que comprometam a polpa ou quebrem cúspides dentárias;
2. **Desgaste Minimamente Invasivo:** Preservar todo o esmalte e dentina sadios possíveis, intervindo apenas no tecido biologicamente desestruturado;
3. **Materiais Restauradores Biocompatíveis:** Emprego de resinas compostas avançadas e adesivos de última geração que mimetizam a elasticidade natural do dente;
4. **Isolamento Absoluto e Visão Aumentada:** Uso de campo operatório limpo e lupas cirúrgicas para máxima vedação e longevidade das restaurações;
5. **Tratamento de Canal em Parceria com Especialistas:** Quando a infecção atinge o canal, a endodontia moderna limpa e sela a raiz, permitindo que o dente continue na arcada sem necessidade de extração.

Cuidar do seu dente natural de forma ética e preventiva é o melhor investimento para sua mastigação, longevidade e saúde integral.`,
      },
    ];

    posts.forEach(p => {
      saveBlogPost(p, 'admin@gwodonto.com.br');
    });
    console.log(`✓ ${posts.length} artigos clínicos semeados no blog.`);
  }

  // 2. SEED REAL VERIFIED GOOGLE REVIEWS
  const existingReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (existingReviews.count === 0) {
    const reviews = [
      {
        author_name: 'Renato Aguiar',
        author_role: '3 avaliações',
        rating: 5,
        date_text: '3 meses atrás',
        comment: 'O Dr. Guilad é um excelente profissional e tem um profundo conhecimento da odontologia, além de possuir as habilidades adequadas para exercer o ofício. Consultório limpíssimo e atendimento preciso e honesto. Além disso, o Guilad é uma cara muito muito gente boa. Vale muito a pena!',
        owner_response: 'Muito obrigado pelo reconhecimento e pelas palavras, fico imensamente feliz com o seu feedback! No meu consultório, trabalho para que a precisão técnica e o rigor científico caminhem lado a lado com um ambiente biológico totalmente limpo, seguro e acolhedor para os pacientes.',
        treatment_tag: 'Clínica Geral & Precisão',
        profile_url: 'https://www.google.com/maps/contrib/100404016667123163711/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Camila P',
        author_role: '1 avaliação',
        rating: 5,
        date_text: '5 meses atrás',
        comment: 'A laser terapia deu bastante resultado em pouco tempo. Vale super a pena.',
        owner_response: 'Ficamos extremamente felizes com o seu relato! Nosso foco aqui na clínica é justamente associar tecnologia de ponta, como a laserterapia, com a agilidade e conforto que nossos pacientes precisam.',
        treatment_tag: 'Laserterapia',
        profile_url: 'https://www.google.com/maps/contrib/113553157159457423332/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Thaina Drefahl',
        author_role: '1 avaliação',
        rating: 5,
        date_text: '1 ano atrás',
        comment: 'Fiz uma placa para bruxismo e tratei os problemas causados pelo bruxismo. O Dr Guilad foi didático, explicou tudo com clareza e foi muito fácil agendar as consultas.',
        owner_response: 'Que excelente notícia! Ficamos muito felizes em saber que o seu tratamento para bruxismo atendeu suas expectativas com total clareza diagnóstica.',
        treatment_tag: 'Bruxismo & Placa',
        profile_url: 'https://www.google.com/maps/contrib/106511307971636547975/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Daniela Munhoz',
        author_role: '4 avaliações',
        rating: 5,
        date_text: '2 anos atrás',
        comment: 'Excelente atendimento. Tive um crise de herpes e acessei o Dr Guilad em plena sexta a noite. O mesmo respondeu prontamente, foi extremamente atencioso e profissional ao me atender no Sab pela manhã.',
        owner_response: 'Daniela, obrigado pela sua avaliação! Pode contar sempre comigo para aplicações de laser e qualquer questão odontológica de urgência ou manutenção.',
        treatment_tag: 'Urgência & Laser',
        profile_url: 'https://www.google.com/maps/contrib/112782692393049465790/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Gustavo Pugliesi',
        author_role: 'Local Guide · 67 avaliações',
        rating: 5,
        date_text: '3 anos atrás',
        comment: 'Estive no consultório para tratamento de herpes labial com laser. O atendimento é excelente, além do tratamento ser realmente eficiente, com diminuição do inchaço logo após a 1a aplicação.',
        owner_response: 'Muito obrigado pela avaliação e pela confiança, conte sempre conosco quando precisar!',
        treatment_tag: 'Herpes & Laserterapia',
        profile_url: 'https://www.google.com/maps/contrib/103173588502750670941/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Jaqueline Carvalho',
        author_role: '4 avaliações',
        rating: 5,
        date_text: '3 anos atrás',
        comment: 'Excelente atendimento Dr GW é um profissional extremamente capacitado. Ele me orientou claramente sobre meu bruxismo e em nenhum momento quis oferecer tratamentos desnecessários o que me trouxe muita confiança.',
        owner_response: 'Muito obrigado pela avaliação! Ética biológica e conduta conservadora são os nossos maiores compromissos.',
        treatment_tag: 'Bruxismo & Ética',
        profile_url: 'https://www.google.com/maps/contrib/115599709824641125209/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Szycie Towarzyskie',
        author_role: '2 avaliações (International Patient)',
        rating: 5,
        date_text: '2 anos atrás',
        comment: 'O Doutor Guilad não é apenas um bom médico, mas também uma boa pessoa. Ele se preocupa com o paciente e me fez sentir confortável. Ele também fala inglês perfeitamente, o que é uma grande vantagem. Obrigado por uma visita agradável e muito profissional.',
        owner_response: 'Thank you so much! It is a pleasure to welcome international patients and offer high-standard care in English in Pinheiros.',
        treatment_tag: 'English Speaking Care',
        profile_url: 'https://www.google.com/maps/contrib/108538251838910982932/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Mariana Musardo',
        author_role: 'Local Guide · 48 avaliações',
        rating: 5,
        date_text: '1 ano atrás',
        comment: 'Atendimento humanizado e muito profissional. Dr Guilad tem bastante conhecimento na área e continua sempre se atualizando. Recomendo muito!',
        owner_response: 'Mariana, super obrigado pela avaliação positiva! Fico feliz em saber que apreciou o atendimento acolhedor.',
        treatment_tag: 'Atendimento Humanizado',
        profile_url: 'https://www.google.com/maps/contrib/117060126506795726596/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Peter Fonseca',
        author_role: '6 avaliações',
        rating: 5,
        date_text: '2 anos atrás',
        comment: 'Dr. Weil é um excepcional profissional. Eficiente e rápido nos procedimentos. Entende muito da matéria. Sou paciente há muitos anos e recomendo.',
        owner_response: 'Peter, é sempre uma honra atendê-lo ao longo de tantos anos de confiança mútua!',
        treatment_tag: 'Paciente Histórico',
        profile_url: 'https://www.google.com/maps/contrib/106284769951802687594/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Claudio Steiner',
        author_role: '6 avaliações',
        rating: 5,
        date_text: '2 anos atrás',
        comment: 'O Dr Guilad é excelente dentista, cuida de toda minha família com muito cuidado e profundo conhecimento e experiência em odontologia. Equipamento e técnica avançadíssimas. Recomendo.',
        owner_response: 'Que bom que ficou satisfeito, Claudio! É um prazer cuidar da saúde bucal de toda a sua família há tantos anos.',
        treatment_tag: 'Atendimento Familiar',
        profile_url: 'https://www.google.com/maps/contrib/115690012037256420902/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Hyeon Jeong',
        author_role: '1 avaliação',
        rating: 5,
        date_text: '1 ano atrás',
        comment: 'Ótimo profissional, atendimento humanizado, explicação detalhada. Obs: Dr. Gui atende em inglês também!',
        owner_response: 'Muito obrigado pelo feedback! A comunicação transparente em português e inglês é essencial no nosso consultório.',
        treatment_tag: 'Atendimento Bilíngue',
        profile_url: 'https://www.google.com/maps/contrib/111929850261942202183/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Érika Takemoto Fukuda',
        author_role: '2 avaliações',
        rating: 5,
        date_text: '4 anos atrás',
        comment: 'Atendimento excelente, profissional muito simpático e paciente. Pedi um aparelho para bruxismo e gostei muito, a qualidade é ótima. Recomendo!',
        owner_response: 'Olá Érika, muito obrigado pela avaliação! Fico muito contente com a adaptação e o alívio que a placa proporcionou.',
        treatment_tag: 'Aparelho de Bruxismo',
        profile_url: 'https://www.google.com/maps/contrib/111537363380089582142/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Leoni Lumna',
        author_role: '1 avaliação',
        rating: 5,
        date_text: '1 ano atrás',
        comment: 'Recomendo. Excelente profissional. Me atendeu com toda atenção, me explicou tudo e solucionou meu caso com procedimentos muito bem feitos. Continuarei tratando meus dentes com ele.',
        owner_response: 'Leoni, muito obrigado por compartilhar sua experiência! A atenção aos detalhes e o conforto do paciente são prioridades absolutas.',
        treatment_tag: 'Clínica Geral',
        profile_url: 'https://www.google.com/maps/contrib/109412076157802462651/reviews?hl=pt-BR',
        is_featured: 1,
      },
      {
        author_name: 'Zplug Tecnologia',
        author_role: '1 avaliação',
        rating: 5,
        date_text: '1 ano atrás',
        comment: 'Excelente experiência com o Dr. Guilad! Atendimento rápido, comunicação clara e muita agilidade durante o processo. Recomendo fortemente o Dr. Guilad pela dedicação e profissionalismo.',
        owner_response: 'Muito obrigado por sua avaliação, conte sempre com a gente quando precisar!',
        treatment_tag: 'Comunicação & Agilidade',
        profile_url: 'https://www.google.com/maps/contrib/111214854072809975944/reviews?hl=pt-BR',
        is_featured: 1,
      },
    ];

    reviews.forEach(r => {
      insertReview(r);
    });
    console.log(`✓ ${reviews.length} avaliações reais do Google cadastradas no banco de dados.`);
  }

  console.log('Seeding completed successfully!');
}

seedBlogAndReviews().catch(err => {
  console.error('Error seeding blog and reviews:', err);
  process.exit(1);
});
