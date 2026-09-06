const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function card({ init, cv1, cv2, name, role, geo, bio, full, attrs = '', delay = '', img = '' }) {
  const safeName = esc(name);
  const photo = img
    ? '<img src="' + img + '" alt="' + safeName + '" width="640" height="853" loading="lazy">'
    : '';
  const empty = img ? '' : ' person-photo--empty';
  const fullParas = Array.isArray(full) ? full : (full ? [full] : []);
  const fullHtml = fullParas.length
    ? '<div class="person-full-bio" hidden>' + fullParas.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>'
    : '';
  return (
    '<article class="person reveal' + delay + '"' + (attrs ? ' ' + attrs : '') +
    ' aria-label="' + safeName.replace(/&quot;/g, '') + ', ' + String(role).replace(/&amp;/g, 'and') + '">' +
    '<div class="person-inner">' +
    '<div class="person-face person-front">' +
    '<div class="person-photo' + empty + '" style="--cv1:' + cv1 + ';--cv2:' + cv2 + '">' + photo + '<span class="init">' + init + '</span></div>' +
    '<div class="person-caption"><h3>' + name + '</h3><span class="role">' + role + '</span></div>' +
    '</div>' +
    '<div class="person-face person-back">' +
    '<h3>' + name + '</h3><span class="role">' + role + '</span>' +
    (geo ? '<span class="geo">' + geo + '</span>' : '') +
    '<p class="bio">' + bio + '</p>' +
    '<button type="button" class="person-btn" data-person-open>See details</button>' +
    '</div>' + fullHtml + '</div></article>'
  );
}

const delays = ['', ' d1', ' d2', ' d3'];
function withPalette(list, palette) {
  return list.map((p, i) => {
    const [cv1, cv2] = palette[i % palette.length];
    return { delay: delays[i % delays.length], cv1, cv2, ...p };
  });
}
function visible(list) {
  return list.filter((p) => !p.hidden);
}

const GREEN = [
  ['#0B3D2E', '#09190B'],
  ['#1A5C3A', '#0B3D2E'],
  ['#2F6B3C', '#144028'],
  ['#3D6B2E', '#1A4020'],
  ['#0E4A32', '#09190B'],
  ['#1B5C40', '#0B2A1C'],
  ['#245C38', '#102818'],
  ['#2E6B3A', '#143020'],
];
const MIX = [
  ['#0B3D2E', '#09190B'],
  ['#8B5A18', '#3D280C'],
  ['#1A5C3A', '#0B3D2E'],
  ['#4A6B8B', '#1A2838'],
  ['#2F6B3C', '#144028'],
  ['#5C4A1A', '#2A220E'],
  ['#0E4A32', '#09190B'],
  ['#7A5E20', '#3D2F10'],
];

const IMG = '/assets/images/people/';

const board = withPalette([
  {
    init: 'JK', name: 'Dr. Jean-Pierre Karegeye', role: 'Executive Director', geo: 'Kigali HQ',
    img: IMG + 'jean-pierre-karegeye.jpg',
    bio: 'Scholar and academic administrator leading GPS — connecting knowledge, innovation, enterprise, and policy across the Global South.',
    full: [
      'Dr. Jean-Pierre Karegeye is a Board Member of the Living Peace Institute (LPI) and Executive Director of the Global Platform for the South (GPS), an international initiative that strengthens South–South cooperation by connecting knowledge, innovation, enterprise, and policy to develop practical solutions to the challenges facing the Global South. Working alongside other GPS members, he builds partnerships among universities and connects education and research with industry, civil society, policymakers, and current and former diplomats. This work seeks to advance knowledge production, employment creation, and community engagement.',
      'An alumnus of the University of California, Berkeley, Dr. Karegeye has an interdisciplinary academic background encompassing literature, philosophy, linguistics, theology, and applied pedagogy. He has taught in both the United States and Africa, including at UC Berkeley, Macalester College, Dickinson College, and the American University of Nigeria.',
      'His transdisciplinary research and teaching examine African and Francophone literary and philosophical texts, genocide warning signs, testimonial narratives, postcolonial and decolonial studies, the sociology of African states, and religious extremism. His current projects explore how a critical reconstruction of the humanities and social sciences can renew the conceptual foundations of the Global South while translating knowledge into transformative initiatives that respond to the lived realities of communities.',
      'Dr. Karegeye has authored and co-authored several books and scholarly articles, including Religion in War and Peace in Africa (Routledge, 2020) with Margee Ensign.',
    ],
  },
  {
    init: 'HT', name: 'Prof. Hirut Woldemariam Teketel', role: 'Associate Director for Education, Research, Capacity Building, and Training Programs', geo: 'Addis Ababa',
    img: IMG + 'hirut-woldemariam-teketel.jpg',
    bio: 'Professor of Linguistics at Addis Ababa University; former Ethiopian cabinet minister and Under-Secretary-General of the Organisation of Southern Cooperation.',
    full: [
      'Hirut Woldemariam Teketel is a Professor of Linguistics at Addis Ababa University and most recently served as Under-Secretary-General of the Organisation of Southern Cooperation (OSC). She holds a PhD from the Institute of African Studies at the University of Cologne, Germany, and is an internationally recognized scholar, policy leader, and institutional reformer with over three decades of experience in academia, government, and international cooperation.',
      'She previously served as Vice President of Addis Ababa University and as a Cabinet Minister of the Federal Democratic Republic of Ethiopia, leading the ministries of Culture and Tourism, Labor and Social Affairs, and Science and Higher Education. Throughout her career, she has championed higher education reform, indigenous knowledge systems, research, multilingualism, and inclusive development.',
      'Professor Hirut has published extensively and delivered keynote lectures worldwide on linguistics, language policy, education, leadership, and women\'s empowerment. In recognition of her distinguished contributions to scholarship and public service, she was awarded an Honorary Doctorate in Humanities by the University of Oslo in 2021.',
    ],
  },
  {
    init: 'BD', name: 'Boubacar Boris Diop', role: 'Associate Director for Creative Production', geo: 'Senegal',
    bio: 'Writer, scholar, and public intellectual. Associate Director for Creative Production at GPS.',
  },
  {
    init: 'SK', name: 'Sajith Kaimal', role: 'Associate Director for Emerging Technologies &amp; Innovation', geo: 'Enterprise network',
    bio: 'Founder and CEO of Astra Landing Enterprise and Kanaka Agro Farms. Associate Director for Emerging Technologies &amp; Innovation at GPS.',
  },
  {
    init: 'AO', name: 'Adu Opoku-Boahin', role: 'Associate Director', geo: 'Ghana',
    img: IMG + 'adu-opoku-boahin.jpg',
    bio: 'Chief Executive Officer of INSTE-D. Associate Director at GPS.',
  },
  {
    init: 'PP', name: 'Paulo Pan', role: 'Associate Director for Business and Sports Partnerships', geo: 'Africa · Beyond Africa Group',
    img: IMG + 'paulo-pan.jpg',
    bio: 'Founder &amp; CEO of Beyond Africa Group. Associate Director for Business and Sports Partnerships at GPS.',
    full: [
      'Paulo Pan is Associate Director for Business and Sports Partnerships at the Global Platform for the South (GPS). He is Founder & CEO of Beyond Africa Group, a senior executive with over 20 years of experience on the African continent and 25 years of experience in international relations between different nations, conducting business in multi-sectoral areas.',
      'He is a senior business consultant for Africa at the Global Food Security Fund and leads the “Sports & Education for Everybody, Anywhere” initiative in partnership with UNESCO.',
    ],
  },
], GREEN);

const departments = withPalette([
  {
    init: 'WR', name: 'Prof. Wajiha Raza Rizvi', role: 'Head, Communication, Media, and Creative Industries', geo: 'Pakistan',
    img: IMG + 'wajiha-raza-rizvi.jpg',
    bio: 'Media scholar and cultural-policy specialist heading Communication, Media, and Creative Industries at GPS.',
    full: [
      'Prof. Wajiha Raza Rizvi, Head, Communication, Media, and Creative Industries department of Global Platform for the South (GPS), has served as United Nations Volunteer, focusing on Sustainable Development Goals for Instructional Video Design Ideation and Multilingual Translation Support, and Principal Investigator (Pakistan) and Senior Fellow, Global Centre for Rehumanising Democracy (GCRD), collaborating with different public and private universities on Democratic Discourse Index (DDI), a catalogued project of United Nations Department of Economic and Social Affairs (UN DESA).',
      'Prof. Rizvi brings together academic and professional expertise in media studies, cultural policy, and democratic communication. Her interdisciplinary work spans the intersection of digital discourse, institutional trust, and civic engagement in Pakistan\'s evolving public sphere. She served as Dean and Professor in academia, Senior Research & Policy Specialist at Organisation of Southern Communication (OSC) in Ethiopia, and Director Research & Archive Film Museum Society Pakistan. She was Project Director to set up Department of Film & Television at National College of Arts Lahore, and she was the first member of the team to contribute to the Charter Proposal for establishing Institute of Art and Culture Pakistan, owned by Abu Dhabi Group.',
      'Prof. Rizvi has served in media and academia since 1988, was a member of 16 Boards at different universities and an international civil servant. She pioneered film research in Pakistan, and she developed four undergraduate and graduate degree programs. She produced 65 television quiz shows on the seven SAARC nations, to raise funds for the 9th SAF Games.',
      'Prof. Rizvi contributed to the organization of two consultations on the Third Way of Development in the Global South for OSC and 12 academic conferences in 12 countries for International Association of Media and Communication Research (IAMCR). She was a member of the International Council, S&WG Funds Committee, Publications Committee, Ethics Committee, Head of History Section, and Head of Gender and Communication Section of IAMCR for ten years. She has published 33 single author and 15 co-authored research papers on geopolitics in media and representation of gender and war in films, and a book Political Cinema, 2025.',
    ],
  },
  {
    init: 'JM', name: 'Jacques Mukwende', role: 'Head, Strategic Partnerships, Resource Mobilization, and Institutional Sustainability', geo: 'Kigali HQ',
    img: IMG + 'jacques-mukwende.jpg',
    bio: 'Senior executive with 34 years of international leadership spanning partnerships, resource mobilization, public policy, and institutional transformation.',
    full: [
      'Jacques Mukwende is a senior executive with 34 years of international leadership experience spanning strategic partnerships, resource mobilization, public policy, governance, international development, financial management, and institutional transformation. His career includes 19 years with the African Union (Africa CDC and the African Union Commission), 12 years with the National Bank of Rwanda and the Ministry of Planning, and experience in the private sector.',
      'Throughout his career, he has contributed to mobilizing and managing more than US$15 billion in development financing and public resources, including approximately US$1.5 billion for African Union programmes supporting Agenda 2063, COVID-19 response, and health security initiatives. He has led multidisciplinary teams of over 35 professionals and worked extensively with AU Heads of State & Institutions, AU Policy Organs, Regional Economic Communities, multilateral organizations, development finance institutions, bilateral partners, and the private sector.',
      'Most recently, as Senior Advisor to the Director General of Africa CDC (2024–2026), he provided strategic advice on governance, partnerships, policy coordination, and institutional relations while supporting the Governing Board, the Committee of Heads of State and Government, AU Summits, and engagement with Permanent Representatives and international partners. Previously, as Acting Director of the Partnership Management and Resource Mobilisation Directorate at the African Union Commission, he led continental partnership strategies, donor engagement, international cooperation, resource mobilization, and implementation of Agenda 2063 financing and domestic resource mobilization strategies.',
      'Before joining the African Union, Mr. Mukwende served for over a decade at the National Bank of Rwanda, including as Director of the Payment Systems Department, where he played a pivotal role in modernizing Rwanda\'s national payment systems. He has worked in more than 50 African countries.',
      'He holds a master’s degree in financial economics (Financial Institutions) from the Catholic University of Louvain (Belgium) and a bachelor’s degree in applied economics from the University of Kinshasa, and has completed numerous executive programmes in strategic negotiations, resource mobilization, public administration, and leadership.',
    ],
  },
  {
    init: 'FP', name: 'Prof. Flávio de Leão Bastos Pereira', role: 'Head, Genocide Prevention &amp; Peacebuilding Initiatives', geo: 'Brazil',
    img: IMG + 'flavio-de-leao-bastos-pereira.jpg',
    bio: 'Brazilian human rights lawyer and legal scholar heading Genocide Prevention &amp; Peacebuilding Initiatives at GPS.',
    full: [
      'Prof. Flávio de Leão Bastos Pereira is Head of Genocide Prevention & Peacebuilding Initiatives at the Global Platform for the South (GPS). He is a Brazilian human rights lawyer and legal scholar, with 30 years of university teaching experience. He holds a PhD and Master\'s in Political and Economic Law from Mackenzie Presbyterian University (São Paulo), where he teaches Human Rights, Constitutional Law, Electoral Law and completed a postdoctoral fellowship in Human Rights and New Technologies at the Mediterranea International Centre for Human Rights Research (Reggio Calabria, Italy).',
      'A specialist in Genocide and Human Rights Studies (Zoryan Institute / University of Toronto), his research focuses on international criminal law, indigenous peoples\' rights, and mass atrocity prevention. He serves on the editorial board of the Journal of International Criminal Law (Stockholm) and is listed among the International Criminal Court\'s legal assistants to victims. Vice-President of the Association of Human Rights Attorneys, Judges, and Prosecutors of Latin America and the Caribbean, and attorney at Fregni Advogados Law Firm.',
    ],
  },
  {
    init: 'FS', name: 'Faisal Saleem', role: 'Head, Technology and Innovation', geo: 'Pakistan',
    img: IMG + 'faisal-saleem.jpg',
    bio: 'Sovereign AI consultant and architect heading Technology and Innovation at GPS.',
    full: [
      'Faisal Saleem is Head of Technology and Innovation at the Global Platform for the South (GPS). He is a Sovereign AI Consultant and Architect with over 30 years of experience in enterprise technology and more than two decades specializing in Artificial Intelligence, Machine Learning, and enterprise digital transformation. As Co-Founder and Chief AI Officer at GalaxAI Solutions Pakistan, he helps governments and enterprises design and deploy sovereign AI platforms that ensure data residency, security, regulatory compliance, and operational independence.',
      'His expertise includes Agentic AI, Retrieval-Augmented Generation (RAG), multimodal AI, enterprise AI architecture, and intelligent automation. Faisal has led AI initiatives across healthcare, defence, e-commerce, and the public sector, delivering secure, scalable, and production-ready AI solutions. He is passionate about enabling organizations to adopt responsible AI through privacy-first architectures, empowering them to accelerate innovation while maintaining full control over their data, infrastructure, and strategic AI capabilities.',
    ],
  },
  {
    init: 'SP', name: 'Dr. Suchismita Pattanaik', role: 'Head, Climate, Environment, and Green Transformation', geo: 'Global South',
    img: IMG + 'suchismita-pattanaik.jpg',
    bio: 'Environmental researcher and policy specialist heading Climate, Environment, and Green Transformation at GPS.',
    full: [
      'Dr. Suchismita Pattanaik has over 12 years of experience spanning environmental research, policy, sustainability, climate action, and international cooperation. With a Ph.D. in Environmental Biotechnology, her work bridges scientific research and evidence-based policy, with a focus on climate mitigation and adaptation, carbon sequestration, climate-resilient agriculture, and sustainable development.',
      'She has worked with think tanks, international institutions, and intergovernmental organisations, contributing to South–South cooperation, policy research, climate governance, and initiatives that strengthen collaboration among Member States across the Global South. She is also actively engaged with global networks, reflecting her longstanding commitment to regional and international cooperation. She has authored more than 30 scientific and policy publications and has participated in international climate and policy forums across Asia, Africa, and Europe.',
    ],
  },
], GREEN);

const advisory = withPalette([
  {
    init: 'RS', name: 'Prof. Rossana Valéria de Souza e Silva', role: 'International Advisory Board Member', geo: 'Brazil · GCUB',
    img: IMG + 'rossana-valeria-de-souza-e-silva.jpg',
    bio: 'Executive Director of GCUB and a leading voice in international university cooperation across Latin America and beyond.',
    full: [
      'Professor Rossana Valéria de Souza e Silva holds the position of Executive Director of the Brazilian Universities International Cooperation Group – GCUB since 2008. She holds a PhD in Education from the State University of Campinas – UNICAMP, Brazil and completed her Postdoctoral studies in Educational Sciences at Université Paris 8, France. Professor Rossana is a retired professor from the University of Brasília – UnB.',
      'She is a Senior Advisor at the China–Latin America Cultural Exchange Center in Beijing. She is an Invited Researcher at the Faculty of Psychology and Educational Sciences of the University of Geneva, Switzerland, and former President of the Governing Council of the UNESCO International Institute for Higher Education in Latin America and the Caribbean – UNESCO-IESALC. She is a member of the Board of Directors of the Union of Universities of Latin America and the Caribbean – UDUALC.',
      'Professor Rossana has worked in the field of International University Cooperation for nearly 30 years. She served as a consultant for the Organization of American States – OAS, within the Department of Human Development, Education and Employment. She was awarded the French Government distinction L’Ordre des Palmes Académiques for her contributions to Brazil–France University Cooperation.',
      'She served as Special Advisor for International Relations at ANDIFES – the National Association of Federal Institutions of Higher Education, and as Director of International Relations at the Federal University of Uberlândia, Brazil. For her work in promoting International University Cooperation, she received the 2018 Annual Award from the Brazil–Turkey Cultural Center and, in 2019, was declared an Honorary Guest of the city of Ambato, Ecuador.',
      'She is the author of articles and book chapters on Higher Education and University Internationalization, a member of the Scientific Committee of the Scientific Journal KazNU, Kazakhstan, and a member of the Editorial Advisory Board of UNESCO-IESALC’s journal Higher Education and Society. She is also the author and coordinator of several international programs and courses for undergraduate and graduate students, professors, and researchers.',
    ],
  },
  {
    init: 'ME', name: 'Prof. Margee Ensign', role: 'International Advisory Board Member', geo: 'United States · Africa · Europe',
    img: IMG + 'margee-ensign.jpg',
    bio: 'Internationally recognized scholar and university leader in international development, global education, peacebuilding, and community engagement.',
    full: [
      'Professor Margee Ensign is an internationally recognized scholar, university leader, and specialist in international development, global education, peacebuilding, and community engagement. She has led universities across Africa, Europe, and the United States, serving as President of the American University of Nigeria, President of Dickinson College, Vice-Chancellor of the United States International University–Africa in Kenya, and President of the American University in Bulgaria.',
      'She earned a Ph.D. in International Political Economy from the University of Maryland, where her research explored the application of artificial intelligence to international bank lending. Her academic and administrative career has also included appointments at Columbia University, American University, Tulane University, and the University of the Pacific, where she served as Dean of the School of International Studies and Associate Provost for International Initiatives.',
      'Professor Ensign’s scholarship and public service focus on international development, Africa, global education, genocide prevention, peacebuilding, and the civic responsibilities of universities. She is the author or editor of six books, including Rwanda: History and Hope, Confronting Genocide: Dehumanization, Denial and Strategies for Prevention, and Transactional Radio Instruction: Improving Educational Outcomes for Children in Conflict Zones. She has advised African governments, testified before the United States Congress, presented at major international forums, and contributed to prominent academic and public-policy discussions. Her work has appeared in publications such as The Washington Post, and her expertise has been featured by the BBC and CNN.',
      'Her leadership during the Boko Haram insurgency in northeastern Nigeria and the COVID-19 pandemic demonstrated her commitment to connecting universities with their surrounding communities. She has consistently championed the belief that universities should be active and constructive partners in addressing local, national, and global challenges.',
      'Through the Global Platform for the South, Professor Ensign brings extensive experience in building partnerships among universities, governments, and communities across Africa, Europe, and North America. Her leadership will help strengthen cooperation between the Global South and North, expand opportunities for academic exchange and institutional collaboration, and ensure that knowledge and education are translated into practical responses to shared global challenges.',
    ],
  },
  {
    init: 'DK', name: 'Prof. Didas Kayihura Muganga', role: 'International Advisory Board Member', geo: 'Rwanda',
    bio: 'Vice Chancellor of the University of Rwanda.',
  },
  {
    init: 'SS', name: 'Prof. Samir Shaheen', role: 'International Advisory Board Member; Head of Integral Health', geo: 'Rwanda · Sudan',
    img: IMG + 'samir-shaheen.jpg',
    bio: 'Vice Chancellor of the University of Medical Sciences and Technology (UMST) in Kigali, and Professor of Paediatric Orthopaedics at the University of Khartoum. Head of Integral Health at GPS.',
    full: [
      'Prof. Samir Shaheen is Vice Chancellor of the University of Medical Sciences and Technology (UMST) in Kigali, Rwanda, and Head of Integral Health at the Global Platform for the South (GPS). He is Professor of Paediatric Orthopaedics at the Faculty of Medicine, University of Khartoum, and Head of Paediatric Orthopaedics at Soba University Hospital in Khartoum, Sudan. He works in Arabic, English, and German.',
      'He holds an MBBS and an MD from the University of Khartoum, a Diploma in Sport Medicine from the Heidelberg Orthopaedics University Clinic in Germany, and is a medical educationist (JMHPE). His specialist training includes orthopaedics at the University Clinic, Heidelberg; an AO Fellowship at Ulm University Clinic for Trauma, Hand, Plastic and Reconstruction Surgery; orthopaedics and rehabilitation, prosthetics and orthotics technology at Münster University; and trauma and paediatric orthopaedics at the University of Khartoum and Ulm Orthopaedic University Clinic.',
      'Prof. Shaheen has published widely in orthopaedics, paediatric orthopaedics, rehabilitation technology, and medical education, and serves as a reviewer and editorial board member for journals in Sudan and internationally. He is a member of the Assessors for Accreditation of Medical Schools at the Sudan Medical Council and President of the DAAD Alumni Association Sudan (DAAS).',
      'His former leadership roles at the University of Khartoum include Head of the Orthopaedic Department, Director of the Educational Development Centre (Medical Education Unit), Secretary of Academic Affairs, and Acting Deputy Vice Chancellor. He has also served as Head of the Orthopaedic Board at the Sudan Medical Specialization Board and as Deputy Head of Orthopaedic Speciality of the Arab Board.',
    ],
  },
  {
    init: 'AM', name: 'Prof. Abetu Melaku', role: 'International Advisory Board Member', geo: 'Ethiopia',
    bio: 'President and CEO of Western University College, Ethiopia.',
  },
  {
    init: 'AY', name: 'Dr. Arega Yirdaw', role: 'International Advisory Board Member', geo: 'Ethiopia',
    bio: 'Business leader; President and CEO of Unity University, Ethiopia.',
  },
  {
    init: 'JB', name: 'Dr. Jean Bosco Baribeshya', role: 'International Advisory Board Member', geo: 'Rwanda',
    hidden: true,
    bio: 'Vice Chancellor of INES Ruhengeri, Rwanda.',
  },
  {
    init: 'PR', name: 'Pedro Rwagasana', role: 'International Advisory Board Member', geo: 'Rwanda',
    bio: 'Owner of Pedro Coffee.',
  },
  {
    init: 'LM', name: 'Liban Mugabo', role: 'International Advisory Board Member', geo: 'Rwanda',
    bio: 'Managing Director of Safe Gas Rwanda, with senior experience in public policy, finance, and the private sector.',
    full: [
      'A specialist in national-level strategic planning, research, and finance, Mr. Liban Mugabo holds dual master’s degrees in Economics and Public Policy and possesses strong professional experience in the public, private, and NGO sectors.',
      'Currently, Mr. Mugabo is the Managing Director of Safe Gas Rwanda, Rwanda’s biggest LPG gas company by volume. He has also worked with Goldman Sachs, and held a position as Senior Policy Analyst and Interim Deputy Head of the Strategy & Policy Unit at the Office of the President, Rwanda.',
      'Other past experience includes Senior Program Analyst at the William J. Clinton Foundation’s HIV/AIDS Initiative and Senior Analyst for On the Frontier (OTF) Group, as well as work with the Rwanda Investment & Export Promotion Agency (RIEPA) and other private-sector and Rwandan government offices.',
      'Mr. Mugabo is also a regular columnist with Rwanda’s largest English-language newspaper, The New Times, where he provides strategic perspectives on socio-economic issues facing the country. A fluent speaker of English and Kinyarwanda, he is a native speaker of Swahili and possesses a strong ability to speak, read, and write in French.',
    ],
  },
  {
    init: 'SM', name: 'Syed Muhammad Mohsin', role: 'International Advisory Board Member', geo: 'Pakistan',
    img: IMG + 'syed-muhammad-mohsin.jpg',
    bio: 'Chairman and Owner of Hybrid Technics Private Limited, Lahore, with more than 35 years of leadership in industry, public institutions, and aviation.',
    full: [
      'Syed Muhammad Mohsin is dynamic and result oriented with more than 35 years of experience and a successful track record of performance in mega and multibillion projects. He has superior interpersonal skills, capable of resolving multiple and complex problems with innovative solutions. He has extensive interaction experience with government institutes and is well versed in government policies, regulations, and laws. He has immense experience in leading private-public organizations with best technical and management practices from the private sector, introducing systems for operations management and setting up visionary projects from scratch with a change management approach for the benefit of the country.',
      'As a government employee, he has served as Chairman of 12 industrial zones in all provinces of Pakistan, was President of the Technical Educational and Vocational Training Authority (TEVTA) Punjab, and a member of the Pakistan Air Force Board Kamra, a manufacturing unit.',
      'Syed Muhammad Mohsin completed an MS in Electronics Engineering from California State University, Los Angeles (USA) in 1980, and a B.Sc. in Electronics Engineering from the University of Engineering, Lahore (Pakistan) in 1976. He is a commercial Pilot License holder, and he owns Hybrid Technics Private Limited and Hybrid Aviation Private Limited, Lahore (Pakistan). His businesses also run research and development sections and have been manufacturing electronic parts and circuit boards for the industrial sector and international investors such as Honda and Sulzer Ruti in Pakistan.',
    ],
  },
  {
    init: 'NC', name: 'Natalie Campbell-Rodrigues', role: 'International Advisory Board Member', geo: 'Jamaica · Trinidad and Tobago',
    bio: 'Jamaican diplomat, policymaker, and entrepreneur, currently serving as Jamaica’s High Commissioner to Trinidad and Tobago.',
    full: [
      'A Jamaican diplomat, policymaker, entrepreneur, and organizational management professional, currently serving as Jamaica’s High Commissioner to Trinidad and Tobago and Permanent Representative to the Association of Caribbean States (ACS).',
      'Her experience spans diplomacy, public policy, international development, entrepreneurship, and South–South cooperation. She previously served as a Senator in Jamaica, as an Advisor to the Ministry of Foreign Affairs and Foreign Trade, and as the founder and Managing Director of a company operating in Rwanda.',
    ],
  },
  {
    init: 'IG', name: 'Irene Vida Gala', role: 'International Advisory Board Member', geo: 'Brazil · Rwanda',
    img: IMG + 'irene-vida-gala.jpg',
    bio: 'Ambassador of Brazil to Rwanda and a career diplomat with 42 years of service in Brazil’s foreign service.',
    full: [
      'Ambassador Irene Vida Gala is a Brazilian career diplomat with 42 years of service in the Brazilian Foreign Service (Itamaraty). She currently serves as Ambassador of Brazil to the Republic of Rwanda, where she led the establishment of Brazil\'s first resident Embassy in the country, reinforcing Brazil\'s diplomatic engagement with East Africa. Prior to her current appointment, she served as Ambassador of Brazil to the Republic of Ghana.',
      'Throughout her career, Ambassador Gala has developed extensive expertise in Brazil\'s relations with Africa and in multilateral diplomacy. She participated in the establishment and early development of the Community of Portuguese Language Countries (CPLP) and later served at Brazil\'s Permanent Mission to the United Nations in New York, where she followed the work of the United Nations Security Council, with particular responsibility for issues concerning the Great Lakes region of Africa.',
      'Her previous overseas assignments include the Brazilian Embassies in Lisbon, Luanda, and Pretoria, and the Consulate General of Brazil in Rome. In Brazil, she also served as Deputy Head of the Ministry of Foreign Affairs\' Regional Office in São Paulo.',
      'Ambassador Gala has been committed to advancing gender equality and women\'s leadership throughout her career. As the founding President of the Brazilian Women Diplomats Association (AMDB), she contributed to broadening the national debate on women\'s participation in leadership positions and on gender equality within Brazil\'s public service, while also supporting initiatives to increase the representation of women in the Brazilian Foreign Service.',
      'She holds a Bachelor of Laws (LL.B.), a Master\'s degree in International Relations, and is a graduate of the Rio Branco Institute, Brazil\'s diplomatic academy.',
    ],
  },
  {
    init: 'BR', name: 'José Brito', role: 'International Advisory Board Member', geo: 'Cabo Verde',
    bio: 'Former Minister of Foreign Affairs and Minister of Economy of Cabo Verde; co-founder of IHABA.',
    full: [
      'Former Minister of Foreign Affairs and former Minister of Economy of Cabo Verde; former Ambassador to the United States, Canada, and Mexico; and currently co-founder and managing partner of IHABA, a business development and advisory firm.',
      'He also contributed to the Africa Innovation Summit and played an important role in advancing Cabo Verde’s renewable energy strategy.',
    ],
  },
  {
    init: 'PG', name: 'Hon. Professor Pierre Gomez', role: 'International Advisory Board Member', geo: 'The Gambia',
    hidden: true,
    bio: 'Minister of Higher Education, Research, Science and Technology of The Gambia.',
  },
], MIX);

const regional = [
  {
    init: 'MZ', cv1: '#2F6B3C', cv2: '#144028', name: 'Prof. Marcus Zittei', role: 'Regional Coordinator for Latin America', geo: 'Latin America',
    bio: 'Regional Coordinator for Latin America at GPS, with a research focus on institutional sustainability.',
  },
  {
    init: 'MM', cv1: '#4A6B8B', cv2: '#1A2838', name: 'Dr. Myriam Moïse', role: 'Caribbean Hub Coordinator', geo: 'Martinique · The Caribbean',
    img: IMG + 'myriam-moise.jpg',
    bio: 'Associate Professor at Université des Antilles and Executive Secretary-General of Universities Caribbean.',
    delay: ' d2',
    full: [
      'Dr. Myriam Moïse is an Associate Professor of Cultural Studies and Literatures in English at the Université des Antilles in Martinique. She also serves as the Executive Secretary-General of Universities Caribbean, the consortium of Caribbean universities and research institutes (formerly UNICA) headquartered at the University of the West Indies in Jamaica and currently presided over by the University of Havana in Cuba.',
      'Her research spans Gender Studies, Cultural Studies, Critical Race Studies, and Intersectional Ecology, with a particular focus on the literary, aesthetic, and political productions of Caribbean women. Dr. Moïse holds a Doctorate in Postcolonial Studies from Paris Sorbonne Nouvelle University and a Ph.D. in Literatures in English from the University of the West Indies. Her contributions to research and the internationalisation of higher education have been recognized through prestigious awards, including the Fulbright Research Fellowship (2020) and the French National Order of Merit (2023).',
      'Dr. Moïse’s research has been supported by numerous grants and visiting fellowships at leading institutions in Europe and the United States, including New York University (2009), Brown University (2012), University College London (2018), Emory University (2020), and Cambridge University (SFS Visiting International Fellowship 2024-2025). She has published widely in peer-reviewed journals and edited collections in French, English, Spanish, and Portuguese. Among her most recent publications are Border Transgression and Reconfiguration of Caribbean Spaces (Palgrave MacMillan, 2020) and Décoloniser les mémoires de l’esclavage (L’Harmattan Guinée, 2024).',
      'Dr. Myriam Moïse is actively engaged in fostering collaborative research across the wider Caribbean region. She has organized and led numerous academic forums on key development challenges, including reparatory justice, gender equity, and climate justice in the Caribbean and Latin America. In 2024, she convened the international conference “Caribbean Mundus: History, Memory, Post-Slavery,” which she led as one of the principal investigators in the European Union’s Horizon Research and Innovation programme “Connected Worlds: The Caribbean, Origin of the Modern World.”',
      'Beyond academia, Dr. Moïse has worked as a consultant for UNESCO on Inclusion, Diversity, and the Role of Women in Higher Education and has served as a French advisor for the Caribbean Examination Council (CXC) in Barbados. She is also recognized as an expert in gender and development, participating in UN Women and ECLAC academic forums in Latin America. Frequently invited to speak at international congresses, academic symposiums, youth forums, and development workshops, she remains actively engaged in global conversations on equity, social justice, decolonial thought and Caribbean cultural transformations.',
    ],
  },
  {
    init: 'CM', cv1: '#0B3D2E', cv2: '#09190B', name: 'Dr. Christy Mady', role: 'Regional Coordinator for the Middle East', geo: 'Lebanon · Middle East',
    img: IMG + 'christy-mady.jpg',
    delay: ' d3',
    bio: 'Regional Coordinator for the Middle East at GPS. Associate Professor at Notre Dame University – Louaize and Vice Chair of IAMCR’s Gender and Communication Section.',
    full: [
      'Dr. Christy Mady is Regional Coordinator for the Middle East at the Global Platform for the South (GPS). She holds a PhD in Communication from Carleton University, Canada and is currently an Associate Professor at the Department of Media Studies at Notre Dame University - Louaize. She is also the Vice Chair of the Gender and Communication Section at the International Association for Media and Communication Research (IAMCR).',
      'Equipped with a rich professional academic and field background, Mady’s research interests and publications are mainly focused on Pan Arab media, journalism, and the intersection of media with the various social, socio-political, cultural, labor, and legal aspects of gender and sexuality in the SWANA region and mainly Lebanon.',
      'Mady has been actively involved in national and international consultation work, curricula development, and training mainly in the areas of communication, media, alternative media, marginalized groups, and gender. She has worked as an external consultant with the likes of Oxfam, United Nations, and Deutsche Welle, and she has extensively written on and discussed her work at international conferences and forums.',
    ],
  },
];

const researchers = withPalette([
  {
    init: 'AH', name: 'Dr. Ann Heylen', role: 'Professor, Taiwan Studies', geo: 'Taiwan',
    hidden: true,
    img: IMG + 'ann-heylen.jpg',
    bio: 'Professor at National Taiwan Normal University and Executive Director of the International Taiwan Studies Center.',
    attrs: 'data-item data-pillar="knowledge" data-region="asia"',
    full: [
      'Dr. Ann Heylen is Professor at the Department of Taiwan Culture, Languages and Literature (TCLL) at National Taiwan Normal University (NTNU), Taipei, Taiwan (2008–) and currently serves as the Executive Director of the International Taiwan Studies Center of NTNU. She holds a Ph.D. in Chinese Studies (Sinology) from Catholic University Leuven (K.U.Leuven) in Belgium. She is one of the founding board members of the European Association of Taiwan Studies (EATS) and editor-in-chief of the East Asian Journal of Popular Culture (EAJPC, published by Intellect, UK).',
      'Her research is combined with continued work on the problematique of national, local, and official language planning in Taiwan. Her main interest is in an application of sociolinguist Einar Haugen’s matrix model in language standardization.',
      'Her renewed interest in the 17th century European presence in the China Seas is spurred by the 400-year commemoration of Dutch–Taiwan relations. The focus is on a return to post-event publications of primary source material and their contribution to Taiwan historiographical studies.',
    ],
  },
  {
    init: 'DB', name: 'Denis Bikesha', role: 'Researcher, Genocide Prevention, Peacebuilding &amp; Human Security', geo: 'Rwanda',
    bio: 'Lawyer, former law dean, and researcher in genocide prevention, peacebuilding, and human security.',
    attrs: 'data-item data-pillar="policy" data-region="africa"',
  },
  {
    init: 'RM', name: 'Prof. Roberta Melo', role: 'Researcher, Genocide Prevention, Peacebuilding &amp; Human Security', geo: 'São Paulo · Latin America',
    bio: 'Professor in the International Relations Department at FMU, São Paulo. Researcher in genocide prevention, peacebuilding, and human security.',
    attrs: 'data-item data-pillar="policy" data-region="latam"',
  },
  {
    init: 'JG', name: 'Prof. Julia Gomes', role: 'Professor of International Relations', geo: 'São Paulo · Latin America',
    bio: 'Professor of International Relations at FMU, São Paulo.',
    attrs: 'data-item data-pillar="policy" data-region="latam"',
  },
], MIX);

const people = `<!--meta {"title":"People","desc":"The people of GPS — Board of Directors, International Advisory Board, Regional Coordination, Distinguished Contributors, and Young Leaders.","nav":"people","crumb":[["Home","/"],["About","/about"],["People & Governance"]],"eyebrow":"About · People & Governance","h1":"The people behind <span class='grad-ink'>the platform.</span>","lede":"GPS is powered by people, institutions, and ideas in motion — connecting knowledge, innovation, enterprise, and policy across the Global South.","subnav":[["#board","Board"],["#departments","Departments"],["#advisory","Advisory Board"],["#regional","Coordination"],["#researchers","Researchers"],["#experts-link","Experts & Fellows"],["#contributors","Contributors"],["#young-leaders","Young Leaders"]]}-->
<section id="board" style="padding-top:30px">
<span id="executive"></span>
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Governance</div><h2 class="sec-h reveal">Board of Directors</h2><p class="sub reveal d1">Institutional oversight, fiduciary responsibility, and long-term strategic direction.</p></div><div class="more reveal"><a class="btn btn-ink" href="/about-governance">How governance works <span class="arrow">→</span></a></div></div>
<div class="people-grid">
${visible(board).map(card).join('\n')}
</div>
</div>
</section>
<section id="departments" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Operations</div><h2 class="sec-h reveal">Departments</h2><p class="sub reveal d1">Heads of GPS departments — programmes, partnerships, communications, and institutional sustainability.</p></div></div>
<div class="people-grid">
${visible(departments).map(card).join('\n')}
</div>
</div>
</section>
<section id="advisory">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Counsel</div><h2 class="sec-h reveal">International Advisory Board</h2><p class="sub reveal d1">A distinguished body of university leaders, policymakers, diplomats, and partners across the Global South and beyond.</p></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">Composition</span><h3>University &amp; academic leadership</h3><p>Presidents and secretaries-general of regional university associations across Africa, Latin America &amp; the Caribbean, Asia-Pacific, and the Arab world — and leading rectors and scholars.</p></div>
<div class="card reveal d1"><span class="kick">Composition</span><h3>Former ministers, diplomats &amp; public leaders</h3><p>Senior figures from foreign affairs, economy, and education portfolios — with deep South–South cooperation experience.</p></div>
<div class="card reveal d2"><span class="kick">Composition</span><h3>Entrepreneurs, philanthropists &amp; cultural figures</h3><p>Prominent builders and public voices who extend the platform's reach across business, philanthropy, sport, and culture.</p></div>
</div>
<div class="people-grid" style="margin-top:28px">
${visible(advisory).map(card).join('\n')}
</div>
</div>
</section>
<section id="regional" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> The hubs</div><h2 class="sec-h reveal">Regional Coordination</h2><p class="sub reveal d1">Each hub is led by a Regional Coordinator — strategy, partnerships, programming, and institutional development in their region.</p></div><div class="more reveal"><a class="btn btn-ink" href="/about-regional-hubs">Hubs on the map <span class="arrow">→</span></a></div></div>
<div class="people-grid">
${visible(regional).map(card).join('\n')}
</div>
</div>
</section>
<section id="researchers">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> The bench</div><h2 class="sec-h reveal">Researchers &amp; specialists</h2><p class="sub reveal d1">Scholars, practitioners, and specialists contributing to GPS research, programmes, and regional work.</p></div></div>
<div class="people-grid">
${visible(researchers).map(card).join('\n')}
</div>
</div>
</section>
<section id="experts-link" class="night">
<div class="aurora" aria-hidden="true"></div>
<div class="inner split">
<div><div class="eyebrow reveal"><span class="bar"></span> The wider bench</div><h2 class="sec-h reveal">Experts &amp; Fellows</h2><p class="reveal d1" style="color:var(--ink-inv-soft);max-width:56ch">Researchers, specialists, and fellows across the four pillars and every region — in a searchable, filterable directory that scales as the network grows.</p><div class="reveal d2" style="margin-top:24px"><a class="btn btn-grad" href="/people-experts">Open the directory <span class="arrow">→</span></a></div></div>
<div class="reveal d1"><div class="card dark"><span class="kick" style="color:var(--c2)">Directory filters</span><div class="tags" style="margin-top:10px"><span class="tag">Pillar</span><span class="tag">Region</span><span class="tag">Free-text search</span></div><p style="font-size:13px;margin-top:12px">Fellowship cohorts join from 2027 — <a href="/get-involved-opportunities#fellowships" style="color:var(--c2)">apply here</a>.</p></div></div>
</div>
</section>
<section id="contributors">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Voices</div><h2 class="sec-h reveal">Distinguished Contributors</h2><p class="sub reveal d1">Writers, thinkers, public figures, and innovators who contribute to GPS platforms — GPS Outlook, SouthPlus, dialogues, and convenings.</p></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">Editorial</span><h3>Writers &amp; essayists</h3><p>Contributing to GPS Outlook and SouthPlus — the South narrating itself. First contributor profiles appear with the 2027 launch issues.</p></div>
<div class="card reveal d1"><span class="kick">Public thought</span><h3>Thinkers &amp; public figures</h3><p>Keynotes, dialogues, and multimedia conversations across the convening calendar.</p></div>
<div class="card reveal d2"><span class="kick">Practice</span><h3>Innovators &amp; artists</h3><p>Creative production, exhibitions, and cultural programming — memory and imagination as infrastructure.</p></div>
</div>
</div>
</section>
<section id="young-leaders" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Next generation</div><h2 class="sec-h reveal">Young Leaders</h2><p class="sub reveal d1">Emerging leaders across the network. Individual profiles arrive with the first cohort in 2027 — the pathway is open now.</p></div><div class="more reveal"><a class="btn btn-ink" href="/initiative-youth-leadership">Youth &amp; Leadership initiative <span class="arrow">→</span></a></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">The cohort</span><h3>Selected across the network</h3><p>An annual cohort of students, early-career researchers, founders, and organizers, nominated by hub and university partners across all six regions.</p></div>
<div class="card reveal d1"><span class="kick">What they get</span><h3>Responsibility, not observation</h3><p>Mentorship from senior figures and the diaspora, a platform at the convenings, and real roles inside GPS programs.</p></div>
<div class="card reveal d2"><span class="kick">Nominations open</span><h3>This could be you</h3><p>The first cohort is named in 2027.</p><div class="foot"><a class="btn btn-ink btn-sm" href="/get-involved#join">Join the network <span class="arrow">→</span></a></div></div>
</div>
</div>
</section>
`;

const expertsPage = `<!--meta {"title":"Experts & Fellows","desc":"Searchable directory of GPS researchers, specialists, and fellows — filter by pillar and region.","nav":"people","crumb":[["Home","/"],["About","/about"],["People & Governance","/people"],["Experts & Fellows"]],"eyebrow":"About · Experts & Fellows","h1":"Experts &amp; <span class='grad-ink'>Fellows</span>","lede":"Researchers, specialists, and fellows across the four pillars and every region."}-->
<section style="padding-top:26px">
<div class="inner" data-filter-scope>
<div class="filterbar reveal">
<label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" placeholder="Search expertise, e.g. climate, AI, food systems…" data-f-search aria-label="Search experts"></label>
<div class="chipset" role="group" aria-label="Filter by pillar"><button class="fchip on" data-f-key="pillar" data-f-val="all">All pillars</button><button class="fchip" data-f-key="pillar" data-f-val="knowledge">Knowledge</button><button class="fchip" data-f-key="pillar" data-f-val="innovation">Innovation</button><button class="fchip" data-f-key="pillar" data-f-val="enterprise">Enterprise</button><button class="fchip" data-f-key="pillar" data-f-val="policy">Policy</button></div>
<div class="chipset" role="group" aria-label="Filter by region"><button class="fchip on" data-f-key="region" data-f-val="all">All regions</button><button class="fchip" data-f-key="region" data-f-val="africa">Africa</button><button class="fchip" data-f-key="region" data-f-val="latam">Latin America</button><button class="fchip" data-f-key="region" data-f-val="caribbean">Caribbean</button><button class="fchip" data-f-key="region" data-f-val="asia">Asia</button><button class="fchip" data-f-key="region" data-f-val="mena">MENA</button><button class="fchip" data-f-key="region" data-f-val="diaspora">Diaspora</button></div>
<span class="fcount" data-f-count></span>
</div>
<div class="people-grid" data-filter-list>
${visible(researchers).map(card).join('\n')}
<div class="empty-msg">No profiles match those filters. Try widening your search.</div>
</div>
</div>
</section>
`;

fs.writeFileSync(path.join('src/pages/people.html'), people);
fs.writeFileSync(path.join('src/pages/people-experts.html'), expertsPage);
console.log('wrote flip-card pages');
