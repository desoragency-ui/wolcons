/* ==========================================================================
   WOLCONS — Français / English / العربية
   Le français est la langue source : le dictionnaire est indexé sur le texte
   français exact tel qu'il apparaît dans index.html. Une chaîne absente du
   dictionnaire (nom propre, ville, montant) reste inchangée.

   Chargé AVANT script.js pour que la traduction soit appliquée avant que les
   titres ne soient découpés mot par mot.
   ========================================================================== */
(function () {
  'use strict';

  var DICT = {
    en: {
      /* — Navigation & en-tête — */
      'Aller au contenu principal': 'Skip to main content',
      'Nous sommes': 'About us',
      'La méthode': 'Our method',
      'Nos métiers': 'What we do',
      'Réalisations': 'Projects',
      'Questions': 'FAQ',
      'Demander un devis': 'Get a quote',
      'Demander un devis gratuit': 'Get a free quote',
      'Nos clients': 'Our clients',
      'Questions fréquentes': 'Frequently asked questions',
      'Contact': 'Contact',
      'Navigation principale': 'Main navigation',
      'Navigation mobile': 'Mobile navigation',
      'Ouvrir le menu': 'Open menu',
      'Fermer le menu': 'Close menu',
      'Choisir la langue': 'Choose language',
      'Wolcons — accueil': 'Wolcons — home',
      'Faire défiler': 'Scroll down',
      'Revenir en haut': 'Back to top',
      'Écrire à Wolcons sur WhatsApp': 'Message Wolcons on WhatsApp',

      /* — Hero — */
      'Constructeur tout corps d’état · Casablanca': 'All-trades contractor · Casablanca',
      "Constructeur tout corps d'état · Casablanca": 'All-trades contractor · Casablanca',
      'Votre projet livré': 'Your project delivered',
      'au prix annoncé,': 'at the price quoted,',
      'à la date annoncée.': 'on the date promised.',
      "Construction clé en main, aménagement TCE et pilotage de projet. Un seul contrat, un seul responsable, un seul numéro à appeler — du premier coup de crayon à la remise des clés.":
        'Turnkey construction, all-trades fit-out and project management. One contract, one person accountable, one number to call — from the first sketch to the handover of keys.',
      'Voir nos réalisations': 'See our projects',
      'MDH de travaux livrés': 'MDH of work delivered',
      'projets référencés': 'referenced projects',
      'm² pour un seul chantier': 'm² on a single site',
      'villes : Casa, Rabat, Kénitra, Marrakech': 'cities: Casablanca, Rabat, Kénitra, Marrakech',
      "Chantier Wolcons : grues et structure béton en cours d'élévation":
        'Wolcons site: tower cranes and concrete structure going up',

      /* — Problème — */
      'Le vrai problème': 'The real problem',
      'Un chantier ne dérape presque jamais': 'A build almost never goes wrong',
      'à cause des murs.': 'because of the walls.',
      "Il dérape à cause du nombre de personnes que vous devez gérer. Dix corps de métier, dix devis, dix plannings, dix excuses. Voilà ce que vous coûte réellement la construction « au moins cher ».":
        'It goes wrong because of how many people you have to manage. Ten trades, ten quotes, ten schedules, ten excuses. That is what building "as cheaply as possible" really costs you.',
      "Personne n'est responsable": 'Nobody is accountable',
      "Le carreleur attend le plombier, qui attend l'électricien. Chacun a raison, personne n'avance. Et c'est vous qui passez vos journées au téléphone à arbitrer des métiers que vous n'exercez pas.":
        'The tiler waits for the plumber, who waits for the electrician. Everyone is right, nothing moves. And you are the one spending your days on the phone refereeing trades you do not practise.',
      'Le budget gonfle par petites touches': 'The budget creeps up, line by line',
      "« Ça, ce n'était pas prévu. » Un avenant ici, un oubli là. Le devis d'appel était bas parce qu'il était incomplet — et l'addition finale arrive quand vous ne pouvez plus reculer.":
        '"That wasn’t in the scope." A variation here, an omission there. The headline quote was low because it was incomplete — and the final bill lands once you can no longer walk away.',
      'La date recule, et elle vous coûte cher': 'The date slips, and it costs you',
      "Chaque semaine de retard, c'est un loyer de plus, une ouverture repoussée, une production qui ne démarre pas. Le retard n'est pas un désagrément : c'est une ligne dans votre compte de résultat.":
        'Every week of delay is another month’s rent, a postponed opening, production that does not start. Delay is not an inconvenience: it is a line in your P&L.',
      'Construire est un investissement.': 'Building is an investment.',
      'Ça ne devrait jamais être un pari.': 'It should never be a gamble.',

      /* — À propos — */
      'Qui vous accompagne': 'Who you work with',
      "Nous avons construit l'ambassade de Belgique et l'usine Novares.":
        'We built the Embassy of Belgium and the Novares plant.',
      'Nous savons ce que coûte une semaine de retard.': 'We know what a week of delay costs.',
      "Wolcons est une entreprise générale basée à Casablanca. Nous construisons et rénovons des biens résidentiels, commerciaux et industriels — de la villa de 100 m² à l'usine de 9 000 m². Toujours avec la même règle : vous ne parlez qu'à une seule entreprise, et cette entreprise répond de tout.":
        'Wolcons is a main contractor based in Casablanca. We build and renovate residential, commercial and industrial property — from a 100 m² villa to a 9,000 m² plant. Always with the same rule: you deal with one company, and that company answers for everything.',
      "Nos équipes travaillent avec les matériaux et les fournisseurs de référence du marché marocain — Lafarge, Knauf, Sonasid, Weber Saint-Gobain, Soprema. Pas par habitude : parce qu'un ouvrage qui doit durer trente ans ne se négocie pas sur la qualité du ciment.":
        'Our teams work with the benchmark materials and suppliers of the Moroccan market — Holcim, Lafarge, Knauf, Sonasid, Weber Saint-Gobain, Sika. Not out of habit: because a structure meant to last thirty years is not negotiated on the quality of its cement.',
      'Un interlocuteur unique, du chiffrage à la levée des réserves':
        'A single point of contact, from pricing to sign-off',
      'Devis détaillé ligne par ligne — vous voyez ce que vous payez':
        'Line-by-line quote — you see exactly what you pay for',
      'Conducteur de travaux dédié et reporting régulier photos + budget':
        'Dedicated site manager and regular photo + budget reporting',
      'Références vérifiables : ambassades, industriels, multinationales':
        'Verifiable references: embassies, manufacturers, multinationals',
      'Parler de mon projet': 'Discuss my project',
      'de travaux livrés': 'of work delivered',
      "Ossature métallique d'un bâtiment industriel réalisé par Wolcons":
        'Steel frame of an industrial building delivered by Wolcons',

      /* — Méthode — */
      'La méthode Wolcons': 'The Wolcons method',
      'Quatre étapes.': 'Four steps.',
      "Aucune zone d'ombre.": 'No grey areas.',
      "Vous n'avez pas à devenir chef de chantier. Vous avez à valider, puis à recevoir. Voici exactement comment ça se passe.":
        'You do not have to become a site manager. You approve, then you take delivery. Here is exactly how it works.',
      'Visite et prise de brief': 'Site visit and brief',
      "Nous venons voir le site, nous écoutons l'usage que vous voulez en faire, et nous vous disons franchement ce qui est réaliste — y compris quand ce n'est pas ce que vous espériez entendre.":
        'We come and see the site, we listen to how you intend to use it, and we tell you honestly what is realistic — including when it is not what you hoped to hear.',
      'Devis détaillé et planning ferme': 'Detailed quote and firm schedule',
      "Un chiffrage lot par lot, avec les quantités et les références de matériaux. Le planning est daté. Ce que vous signez est ce que vous payez, sauf modification demandée par vous et validée par écrit.":
        'Pricing trade by trade, with quantities and material references. The schedule carries dates. What you sign is what you pay, unless you request a change and approve it in writing.',
      'Chantier piloté': 'Managed site',
      "Un conducteur de travaux dédié coordonne tous les corps de métier. Vous recevez un point d'avancement régulier : photos, taux de réalisation, budget consommé. Une seule personne à appeler en cas de question.":
        'A dedicated site manager coordinates every trade. You receive a regular progress report: photos, percentage complete, budget spent. One person to call with any question.',
      'Réception et garanties': 'Handover and warranties',
      "Visite de réception avec vous, liste des réserves, levée des réserves, remise du dossier des ouvrages exécutés. Nous ne partons pas tant que ce n'est pas conforme.":
        'Handover inspection with you, snag list, snags cleared, as-built documentation handed over. We do not leave until it is right.',
      'Sans entreprise générale': 'Without a main contractor',
      '10 devis à comparer, 10 contrats à suivre': '10 quotes to compare, 10 contracts to follow',
      'Coordination des métiers à votre charge': 'Coordinating the trades is on you',
      'Avenants qui apparaissent en cours de route': 'Variations appearing mid-project',
      'Chaque retard renvoyé sur le corps de métier suivant': 'Every delay blamed on the next trade',
      "Aucune garantie globale sur l'ouvrage": 'No overall warranty on the works',
      'Avec Wolcons': 'With Wolcons',
      "Un contrat unique, tout corps d'état": 'One contract, all trades',
      'Coordination assurée par un conducteur de travaux dédié': 'Coordination handled by a dedicated site manager',
      'Budget arrêté, écrit, opposable': 'A budget that is fixed, written and binding',
      'Un seul responsable du planning : nous': 'One party accountable for the schedule: us',
      'Réception, réserves et garanties prises en charge': 'Handover, snagging and warranties taken care of',

      /* — Métiers — */
      'Trois façons de nous confier votre projet': 'Three ways to hand us your project',
      "Que vous partiez d'un terrain nu, d'un plateau brut ou d'un budget à faire respecter, il y a une formule qui correspond à votre situation.":
        'Whether you are starting from bare land, a shell-and-core floor or a budget that has to hold, there is a format that fits your situation.',
      'Aménagement TCE': 'All-trades fit-out',
      'Rénover sans devenir chef de chantier': 'Renovate without becoming a site manager',
      "L'aménagement": 'An',
      "Tout Corps d'État": 'all-trades (TCE) fit-out',
      "est une solution clé en main : vous confiez l'intégralité des travaux à un interlocuteur unique qui gère tous les métiers du bâtiment. Idéal pour un plateau de bureaux, un commerce, un showroom ou un appartement à reprendre entièrement.":
        'is a turnkey solution: you hand the entire works to a single contact who manages every building trade. Ideal for an office floor, a shop, a showroom or an apartment to be stripped back and rebuilt.',
      'Cloisons & faux-plafonds': 'Partitions & ceilings',
      'Électricité': 'Electrical',
      'CVC': 'HVAC',
      'Plomberie': 'Plumbing',
      'Revêtements': 'Floor & wall finishes',
      'Menuiserie': 'Joinery',
      'Peinture': 'Painting',
      'Chiffrer mon aménagement': 'Price my fit-out',
      'Construction clé en main': 'Turnkey construction',
      'Du terrain nu aux clés en main': 'From bare land to the keys',
      "Une solution globale pour les projets publics, privés, résidentiels et industriels : gros œuvre, second œuvre, VRD et finitions. Nous mobilisons nos moyens matériels et un réseau de fournisseurs de confiance, et nous portons la responsabilité de l'ouvrage complet.":
        'A complete solution for public, private, residential and industrial projects: structural works, second fix, external works and finishes. We deploy our own plant and a network of trusted suppliers, and we carry responsibility for the finished building.',
      'Villas & résidentiel': 'Villas & residential',
      'Usines & hangars': 'Plants & warehouses',
      'Showrooms & commerces': 'Showrooms & retail',
      'Bâtiments institutionnels': 'Institutional buildings',
      'Lancer mon projet de construction': 'Start my construction project',
      'Vous investissez, nous pilotons': 'You invest, we run the project',
      "Pour les investisseurs et les promoteurs, nous prenons en charge le suivi technique, budgétaire et calendaire sur l'ensemble du cycle de vie du bâtiment. Le management de projet n'est pas un supplément chez nous : c'est un métier à part entière.":
        'For investors and developers, we take on technical, budget and schedule oversight across the building’s entire life cycle. Project management is not an add-on here: it is a discipline in its own right.',
      'Suivi technique': 'Technical oversight',
      'Contrôle budgétaire': 'Budget control',
      'Maîtrise du planning': 'Schedule control',
      'Reporting investisseur': 'Investor reporting',
      'Réception & réserves': 'Handover & snagging',
      'Confier le pilotage': 'Hand over the management',

      /* — Chiffres — */
      'construits et aménagés': 'built and fitted out',
      'années d’expérience': 'years of experience',

      /* — Réalisations — */
      'Nos projets phares': 'Selected projects',
      'Les preuves, pas les promesses': 'Proof, not promises',
      "Surfaces, lots, budgets et missions réels. Vous pouvez comparer avec votre propre projet — et nous demander les références.":
        'Real areas, trades, budgets and scopes. Compare them with your own project — and ask us for the references.',
      'Tout': 'All',
      'Aménagement': 'Fit-out',
      'Construction': 'Construction',
      'Filtrer les réalisations': 'Filter projects',
      'Lieu': 'Location',
      'Surface': 'Area',
      'Lots': 'Trades',
      'Budget': 'Budget',
      "Tout corps d'état": 'All trades',
      'Gros œuvre': 'Structural works',
      'TCE hors menuiserie alu': 'All trades excl. aluminium joinery',
      'Sur demande': 'On request',
      'Ambassade de Belgique': 'Embassy of Belgium',
      'Usine Novares': 'Novares plant',
      'Riad Pru': 'Riad Pru',
      'Aménagement Saint Louis': 'Saint Louis fit-out',
      'Plateau bureaux Huawei': 'Huawei office floor',
      'Showroom Thomas & Piron': 'Thomas & Piron showroom',
      'Aménagement ISH': 'ISH fit-out',
      'Siège Novares': 'Novares head office',
      'Hangar industriel': 'Industrial warehouse',
      'Un projet comparable au vôtre ? Demandez-nous le détail des lots et le retour du client.':
        'A project comparable to yours? Ask us for the trade breakdown and the client’s feedback.',
      'Nous écrire': 'Write to us',

      /* — Clients & carte — */
      'Ils nous font confiance': 'They trust us',
      'Des industriels, des enseignes et des cabinets': 'Manufacturers, retail brands and firms',
      'qui nous rappellent': 'who call us back',
      'Wolcons — Casablanca': 'Wolcons — Casablanca',
      'Bd Brahim Roudani, résidence les palmiers B9,': 'Bd Brahim Roudani, résidence les palmiers B9,',
      'étage n°33, Casablanca, Maroc': 'floor, no. 33, Casablanca, Morocco',
      'Lundi – vendredi · 09h00 – 17h00': 'Monday – Friday · 9:00 am – 5:00 pm',
      'Itinéraire': 'Directions',
      'Localisation de Wolcons sur Google Maps — Bd Brahim Roudani, Casablanca':
        'Wolcons location on Google Maps — Bd Brahim Roudani, Casablanca',

      /* — Partenaires — */
      'Nos partenaires': 'Our suppliers',
      "Nous ne faisons pas d'économies": 'We do not cut corners',
      'sur ce qui tient le bâtiment': 'on what holds the building up',

      /* — FAQ — */
      'Ce que les clients': 'What clients',
      'nous demandent toujours': 'always ask us',
      "Une question qui n'est pas ici ? Appelez-nous, on répond directement.":
        'A question that is not here? Call us, we answer directly.',
      "Qu'est-ce que le « tout corps d'état » exactement ?": 'What exactly does "all trades" mean?',
      "Le TCE désigne l'ensemble des métiers nécessaires pour rendre un espace utilisable : gros œuvre, cloisons, faux-plafonds, électricité, plomberie, climatisation, revêtements de sol et mur, menuiserie, peinture, vitrerie.":
        'All-trades (TCE) covers every discipline needed to make a space usable: structural works, partitions, suspended ceilings, electrical, plumbing, air conditioning, floor and wall finishes, joinery, painting and glazing.',
      "Confier votre projet en TCE, c'est signer": 'Handing us the project on an all-trades basis means signing',
      'un seul contrat': 'a single contract',
      "au lieu de dix. C'est nous qui recrutons, planifions et contrôlons chaque corps de métier — et qui répondons du résultat final devant vous.":
        'instead of ten. We hire, schedule and check every trade — and we answer to you for the final result.',
      'Combien coûte un aménagement au mètre carré ?': 'How much does a fit-out cost per square metre?',
      'Un aménagement TCE se situe généralement entre': 'An all-trades fit-out generally runs between',
      '2 500 et 12 500 DH/m²': 'MAD 2,500 and 12,500 per m²',
      'selon le niveau de finition et le standing recherché. Un gros œuvre de villa se situe entre':
        'depending on the level of finish and the standard sought. Structural works on a villa run between',
      '1 000 et 1 800 DH/m² HT': 'MAD 1,000 and 1,800 per m² excl. tax',
      "Le prix exact dépend de l'état existant, des contraintes techniques et des matériaux choisis : c'est précisément ce que la visite et le devis détaillé servent à établir.":
        'The exact price depends on the existing condition, the technical constraints and the materials chosen: that is precisely what the site visit and the detailed quote are for.',
      'Travaillez-vous avec les particuliers ?': 'Do you work with private individuals?',
      "Oui. Nous intervenons aussi bien pour des multinationales et des institutions que pour des particuliers : villa, appartement, riad, local commercial. Le plus petit projet de notre portfolio est un aménagement de 56 m² ; le plus grand, une usine de 9 000 m².":
        'Yes. We work for multinationals and institutions as readily as for private clients: villas, apartments, riads, retail units. The smallest project in our portfolio is a 56 m² fit-out; the largest, a 9,000 m² factory.',
      'Même méthode, même exigence, quelle que soit la taille.':
        'Same method, same standard, whatever the size.',
      'Intervenez-vous en dehors de Casablanca ?': 'Do you work outside Casablanca?',
      'Notre siège est à Casablanca, et nous avons livré des projets à':
        'Our head office is in Casablanca, and we have delivered projects in',
      '(ambassade de Belgique, Villa E),': '(Embassy of Belgium, Villa E),',
      '(usine et siège Novares) et': '(Novares plant and head office) and',
      '(Riad Pru). Parlez-nous de votre localisation : nous vous dirons franchement si nous sommes le bon interlocuteur.':
        '(Riad Pru). Tell us where your project is: we will tell you honestly whether we are the right contractor for it.',
      'Le devis peut-il changer en cours de chantier ?': 'Can the quote change once work has started?',
      'Le montant que vous signez est ferme sur le périmètre défini. Il ne bouge que dans deux cas : une modification que':
        'The amount you sign is firm for the defined scope. It moves in two cases only: a change',
      'vous': 'you',
      "demandez, ou un aléa réellement imprévisible (structure existante dégradée, découverte en fondation). Dans les deux cas, un avenant chiffré est présenté et validé":
        'request, or a genuinely unforeseeable event (degraded existing structure, a discovery in the foundations). In both cases a priced variation is presented and approved',
      'avant': 'before',
      'exécution — jamais découvert sur la facture finale.': 'the work is done — never discovered on the final invoice.',
      "Comment suivre l'avancement sans venir sur place ?": 'How can I follow progress without coming to site?',
      "Un conducteur de travaux et un chef de projet dédiés vous transmettent un point d'avancement régulier : photos du chantier, taux de réalisation par lot, budget consommé et prochaines étapes. Beaucoup de nos clients pilotent leur projet depuis l'étranger.":
        'A dedicated site manager and project manager send you a regular progress report: site photos, percentage complete by trade, budget spent and next steps. Many of our clients run their project from abroad.',

      /* — Devis — */
      'Parlons de votre projet': 'Let’s talk about your project',
      'Décrivez votre projet.': 'Describe your project.',
      'Vous recevez un chiffrage, pas un discours.': 'You get a price, not a pitch.',
      "Remplissez le formulaire ou envoyez-nous directement un message WhatsApp. Nous revenons vers vous pour caler une visite et vous remettre un devis détaillé, gratuit et sans engagement.":
        'Fill in the form or send us a WhatsApp message directly. We come back to you to arrange a visit and issue a detailed quote — free and with no obligation.',
      'étage n°33 — Casablanca': 'floor, no. 33 — Casablanca',
      'étage n°33 — Casablanca, Maroc': 'floor, no. 33 — Casablanca, Morocco',
      'Nom complet': 'Full name',
      'Téléphone': 'Phone',
      'Type de projet': 'Project type',
      'Rénovation / réhabilitation': 'Renovation / refurbishment',
      'Je ne sais pas encore': 'Not sure yet',
      'Ville': 'City',
      'Surface approximative': 'Approximate area',
      'Une estimation suffit à ce stade.': 'A rough figure is enough at this stage.',
      'Démarrage souhaité': 'Preferred start',
      'Dès que possible': 'As soon as possible',
      'Dans 1 à 3 mois': 'In 1 to 3 months',
      'Dans 3 à 6 mois': 'In 3 to 6 months',
      'Je me renseigne': 'Just researching',
      'Votre projet en quelques lignes': 'Your project in a few lines',
      'Envoyer ma demande de devis': 'Send my quote request',
      'Gratuit et sans engagement. Vos informations servent uniquement à vous répondre.':
        'Free and with no obligation. Your details are used only to reply to you.',
      'Plateau de bureaux à rénover entièrement, 160 m², cloisons + électricité + climatisation…':
        'Office floor to be fully refitted, 160 m², partitions + electrical + air conditioning…',
      'Karim Benali': 'Karim Benali',
      'Merci d’indiquer votre nom.': 'Please enter your name.',

      /* — Pied de page — */
      "Entreprise générale de construction et d'aménagement tout corps d'état. Casablanca · Rabat · Kénitra · Marrakech.":
        'Main contractor for construction and all-trades fit-out. Casablanca · Rabat · Kénitra · Marrakech.',
      'Rénovation & réhabilitation': 'Renovation & refurbishment',
      'Le site': 'This site',
      'Pourquoi Wolcons': 'Why Wolcons',
      'Wolcons® — La construction, la perfection à son meilleur.':
        'Wolcons® — Construction, perfection at its best.',
      'Tous droits réservés.': 'All rights reserved.',
      'Wolcons sur LinkedIn': 'Wolcons on LinkedIn',
      'Wolcons sur Instagram': 'Wolcons on Instagram',
      'Wolcons sur Facebook': 'Wolcons on Facebook'
    },

    ar: {
      /* — التنقّل — */
      'Aller au contenu principal': 'الانتقال إلى المحتوى الرئيسي',
      'Nous sommes': 'من نحن',
      'La méthode': 'منهجيتنا',
      'Nos métiers': 'خدماتنا',
      'Réalisations': 'إنجازاتنا',
      'Questions': 'أسئلة',
      'Demander un devis': 'اطلب عرض سعر',
      'Demander un devis gratuit': 'اطلب عرض سعر مجاني',
      'Nos clients': 'عملاؤنا',
      'Questions fréquentes': 'الأسئلة الشائعة',
      'Contact': 'اتصل بنا',
      'Navigation principale': 'القائمة الرئيسية',
      'Navigation mobile': 'قائمة الهاتف',
      'Ouvrir le menu': 'فتح القائمة',
      'Fermer le menu': 'إغلاق القائمة',
      'Choisir la langue': 'اختيار اللغة',
      'Wolcons — accueil': 'ولكونس — الصفحة الرئيسية',
      'Faire défiler': 'تابع التمرير',
      'Revenir en haut': 'العودة إلى الأعلى',
      'Écrire à Wolcons sur WhatsApp': 'راسل ولكونس عبر واتساب',

      /* — الواجهة — */
      'Constructeur tout corps d’état · Casablanca': 'مقاول جميع الأشغال · الدار البيضاء',
      "Constructeur tout corps d'état · Casablanca": 'مقاول جميع الأشغال · الدار البيضاء',
      'Votre projet livré': 'مشروعك يُسلَّم',
      'au prix annoncé,': 'بالثمن المتفق عليه،',
      'à la date annoncée.': 'وفي الموعد المحدد.',
      "Construction clé en main, aménagement TCE et pilotage de projet. Un seul contrat, un seul responsable, un seul numéro à appeler — du premier coup de crayon à la remise des clés.":
        'بناء جاهز للتسليم، تهيئة بجميع الأشغال، وإدارة للمشاريع. عقد واحد، مسؤول واحد، ورقم واحد للاتصال — من أول تصميم إلى تسليم المفاتيح.',
      'Voir nos réalisations': 'شاهد إنجازاتنا',
      'MDH de travaux livrés': 'مليون درهم من الأشغال المسلَّمة',
      'projets référencés': 'مشروعاً مرجعياً',
      'm² pour un seul chantier': 'م² في ورش واحد',
      'villes : Casa, Rabat, Kénitra, Marrakech': 'مدن: الدار البيضاء، الرباط، القنيطرة، مراكش',
      "Chantier Wolcons : grues et structure béton en cours d'élévation":
        'ورش ولكونس: رافعات وهيكل خرساني قيد الإنجاز',

      /* — المشكلة — */
      'Le vrai problème': 'المشكلة الحقيقية',
      'Un chantier ne dérape presque jamais': 'الورش لا ينحرف تقريباً أبداً',
      'à cause des murs.': 'بسبب الجدران.',
      "Il dérape à cause du nombre de personnes que vous devez gérer. Dix corps de métier, dix devis, dix plannings, dix excuses. Voilà ce que vous coûte réellement la construction « au moins cher ».":
        'بل ينحرف بسبب عدد الأشخاص الذين عليك تدبيرهم. عشر حرف، وعشرة عروض أسعار، وعشرة برامج زمنية، وعشرة أعذار. هذا هو الثمن الحقيقي للبناء «بأقل تكلفة».',
      "Personne n'est responsable": 'لا أحد يتحمّل المسؤولية',
      "Le carreleur attend le plombier, qui attend l'électricien. Chacun a raison, personne n'avance. Et c'est vous qui passez vos journées au téléphone à arbitrer des métiers que vous n'exercez pas.":
        'صاحب البلاط ينتظر السبّاك، والسبّاك ينتظر الكهربائي. كلٌّ على حق، ولا شيء يتقدّم. وأنت من يقضي يومه في الهاتف يحكم بين حرف لا يمارسها.',
      'Le budget gonfle par petites touches': 'الميزانية تتضخّم شيئاً فشيئاً',
      "« Ça, ce n'était pas prévu. » Un avenant ici, un oubli là. Le devis d'appel était bas parce qu'il était incomplet — et l'addition finale arrive quand vous ne pouvez plus reculer.":
        '«هذا لم يكن ضمن الاتفاق.» ملحق هنا، ونسيان هناك. كان العرض الأول منخفضاً لأنه كان ناقصاً — وتصل الفاتورة النهائية حين لا يعود بإمكانك التراجع.',
      'La date recule, et elle vous coûte cher': 'الموعد يتأخّر، وثمنه غالٍ',
      "Chaque semaine de retard, c'est un loyer de plus, une ouverture repoussée, une production qui ne démarre pas. Le retard n'est pas un désagrément : c'est une ligne dans votre compte de résultat.":
        'كل أسبوع تأخير يعني كراءً إضافياً، وافتتاحاً مؤجَّلاً، وإنتاجاً لا ينطلق. التأخير ليس إزعاجاً: إنه سطر في حسابات نتائجك.',
      'Construire est un investissement.': 'البناء استثمار.',
      'Ça ne devrait jamais être un pari.': 'ولا ينبغي أن يكون مقامرة أبداً.',

      /* — من نحن — */
      'Qui vous accompagne': 'من يرافقك',
      "Nous avons construit l'ambassade de Belgique et l'usine Novares.":
        'أنجزنا سفارة بلجيكا ومصنع نوفاريس.',
      'Nous savons ce que coûte une semaine de retard.': 'نعرف تماماً ثمن أسبوع من التأخير.',
      "Wolcons est une entreprise générale basée à Casablanca. Nous construisons et rénovons des biens résidentiels, commerciaux et industriels — de la villa de 100 m² à l'usine de 9 000 m². Toujours avec la même règle : vous ne parlez qu'à une seule entreprise, et cette entreprise répond de tout.":
        'ولكونس مقاولة عامة مقرّها الدار البيضاء. نبني ونجدّد العقارات السكنية والتجارية والصناعية — من فيلا بمساحة 100 م² إلى مصنع بمساحة 9000 م². وبالقاعدة نفسها دائماً: تتعامل مع مقاولة واحدة، وهذه المقاولة تتحمّل مسؤولية كل شيء.',
      "Nos équipes travaillent avec les matériaux et les fournisseurs de référence du marché marocain — Lafarge, Knauf, Sonasid, Weber Saint-Gobain, Soprema. Pas par habitude : parce qu'un ouvrage qui doit durer trente ans ne se négocie pas sur la qualité du ciment.":
        'تعمل فرقنا بمواد وموردين مرجعيين في السوق المغربية — هولسيم، لافارج، كناوف، سوناسيد، ويبر سان-غوبان، سيكا. ليس بحكم العادة: بل لأن بناءً يُراد له أن يدوم ثلاثين سنة لا يُساوَم على جودة إسمنته.',
      'Un interlocuteur unique, du chiffrage à la levée des réserves':
        'مخاطب واحد، من التسعير إلى رفع التحفّظات',
      'Devis détaillé ligne par ligne — vous voyez ce que vous payez':
        'عرض سعر مفصّل بنداً بنداً — ترى بوضوح ما تدفع مقابله',
      'Conducteur de travaux dédié et reporting régulier photos + budget':
        'مدير ورش مخصّص وتقارير منتظمة بالصور والميزانية',
      'Références vérifiables : ambassades, industriels, multinationales':
        'مراجع قابلة للتحقق: سفارات، صناعيون، شركات متعددة الجنسيات',
      'Parler de mon projet': 'تحدّث عن مشروعي',
      'de travaux livrés': 'من الأشغال المسلَّمة',
      "Ossature métallique d'un bâtiment industriel réalisé par Wolcons":
        'هيكل معدني لبناية صناعية أنجزتها ولكونس',

      /* — المنهجية — */
      'La méthode Wolcons': 'منهجية ولكونس',
      'Quatre étapes.': 'أربع مراحل.',
      "Aucune zone d'ombre.": 'بلا أي منطقة رمادية.',
      "Vous n'avez pas à devenir chef de chantier. Vous avez à valider, puis à recevoir. Voici exactement comment ça se passe.":
        'لست مضطراً لأن تصبح رئيس ورش. عليك أن تصادق، ثم أن تتسلّم. وإليك بالضبط كيف يجري الأمر.',
      'Visite et prise de brief': 'زيارة الموقع وتحديد الحاجيات',
      "Nous venons voir le site, nous écoutons l'usage que vous voulez en faire, et nous vous disons franchement ce qui est réaliste — y compris quand ce n'est pas ce que vous espériez entendre.":
        'نأتي لمعاينة الموقع، ونصغي للاستعمال الذي تريده، ونقول لك بصراحة ما هو واقعي — حتى وإن لم يكن ما كنت تأمل سماعه.',
      'Devis détaillé et planning ferme': 'عرض سعر مفصّل وبرنامج زمني ثابت',
      "Un chiffrage lot par lot, avec les quantités et les références de matériaux. Le planning est daté. Ce que vous signez est ce que vous payez, sauf modification demandée par vous et validée par écrit.":
        'تسعير حرفةً حرفة، مع الكميات ومراجع المواد. البرنامج الزمني مؤرَّخ. وما توقّعه هو ما تدفعه، إلا في حال تعديل تطلبه أنت وتصادق عليه كتابةً.',
      'Chantier piloté': 'ورش مُدار',
      "Un conducteur de travaux dédié coordonne tous les corps de métier. Vous recevez un point d'avancement régulier : photos, taux de réalisation, budget consommé. Une seule personne à appeler en cas de question.":
        'مدير ورش مخصّص ينسّق بين جميع الحرف. وتصلك حصيلة تقدّم منتظمة: صور، ونسبة الإنجاز، والميزانية المستهلكة. شخص واحد تتصل به عند أي سؤال.',
      'Réception et garanties': 'التسليم والضمانات',
      "Visite de réception avec vous, liste des réserves, levée des réserves, remise du dossier des ouvrages exécutés. Nous ne partons pas tant que ce n'est pas conforme.":
        'زيارة تسلّم بحضورك، ولائحة التحفّظات، ثم رفعها، وتسليم ملف الأشغال المنجزة. لا نغادر ما لم يكن كل شيء مطابقاً.',
      'Sans entreprise générale': 'بدون مقاولة عامة',
      '10 devis à comparer, 10 contrats à suivre': '10 عروض أسعار للمقارنة، و10 عقود للمتابعة',
      'Coordination des métiers à votre charge': 'التنسيق بين الحرف على عاتقك',
      'Avenants qui apparaissent en cours de route': 'ملاحق تظهر في منتصف الطريق',
      'Chaque retard renvoyé sur le corps de métier suivant': 'كل تأخير يُلقى على الحرفة التالية',
      "Aucune garantie globale sur l'ouvrage": 'لا ضمانة شاملة على البناء',
      'Avec Wolcons': 'مع ولكونس',
      "Un contrat unique, tout corps d'état": 'عقد واحد يشمل جميع الأشغال',
      'Coordination assurée par un conducteur de travaux dédié': 'التنسيق يتولّاه مدير ورش مخصّص',
      'Budget arrêté, écrit, opposable': 'ميزانية محدَّدة ومكتوبة وملزِمة',
      'Un seul responsable du planning : nous': 'مسؤول واحد عن البرنامج الزمني: نحن',
      'Réception, réserves et garanties prises en charge': 'التسليم والتحفّظات والضمانات على عاتقنا',

      /* — الخدمات — */
      'Trois façons de nous confier votre projet': 'ثلاث صيغ لتعهد إلينا بمشروعك',
      "Que vous partiez d'un terrain nu, d'un plateau brut ou d'un budget à faire respecter, il y a une formule qui correspond à votre situation.":
        'سواء انطلقت من أرض خالية، أو من طابق على الهيكل، أو من ميزانية يجب احترامها، هناك صيغة تناسب وضعك.',
      'Aménagement TCE': 'تهيئة بجميع الأشغال',
      'Rénover sans devenir chef de chantier': 'جدِّد دون أن تصبح رئيس ورش',
      "L'aménagement": 'التهيئة',
      "Tout Corps d'État": 'بجميع الأشغال (TCE)',
      "est une solution clé en main : vous confiez l'intégralité des travaux à un interlocuteur unique qui gère tous les métiers du bâtiment. Idéal pour un plateau de bureaux, un commerce, un showroom ou un appartement à reprendre entièrement.":
        'حلٌّ جاهز للتسليم: تعهد بكامل الأشغال إلى مخاطب واحد يدير جميع حرف البناء. مثالي لطابق مكاتب، أو محل تجاري، أو صالة عرض، أو شقة تُعاد تهيئتها بالكامل.',
      'Cloisons & faux-plafonds': 'حواجز وأسقف مستعارة',
      'Électricité': 'الكهرباء',
      'CVC': 'التدفئة والتكييف',
      'Plomberie': 'السباكة',
      'Revêtements': 'التلبيسات',
      'Menuiserie': 'النجارة',
      'Peinture': 'الصباغة',
      'Chiffrer mon aménagement': 'سعِّر تهيئتي',
      'Construction clé en main': 'بناء جاهز للتسليم',
      'Du terrain nu aux clés en main': 'من الأرض الخالية إلى تسليم المفاتيح',
      "Une solution globale pour les projets publics, privés, résidentiels et industriels : gros œuvre, second œuvre, VRD et finitions. Nous mobilisons nos moyens matériels et un réseau de fournisseurs de confiance, et nous portons la responsabilité de l'ouvrage complet.":
        'حلٌّ شامل للمشاريع العمومية والخاصة والسكنية والصناعية: الأشغال الكبرى، والأشغال الثانوية، والتهيئة الخارجية، والتشطيبات. نعبّئ وسائلنا المادية وشبكة موردين موثوقين، ونتحمّل مسؤولية البناء كاملاً.',
      'Villas & résidentiel': 'فيلات وسكن',
      'Usines & hangars': 'مصانع ومستودعات',
      'Showrooms & commerces': 'صالات عرض ومحلات',
      'Bâtiments institutionnels': 'بنايات مؤسساتية',
      'Lancer mon projet de construction': 'أطلق مشروع البناء',
      'Vous investissez, nous pilotons': 'أنت تستثمر، ونحن ندير',
      "Pour les investisseurs et les promoteurs, nous prenons en charge le suivi technique, budgétaire et calendaire sur l'ensemble du cycle de vie du bâtiment. Le management de projet n'est pas un supplément chez nous : c'est un métier à part entière.":
        'للمستثمرين والمنعشين العقاريين، نتولّى التتبع التقني والمالي والزمني على امتداد دورة حياة البناء. إدارة المشاريع ليست خدمة إضافية عندنا: إنها مهنة قائمة بذاتها.',
      'Suivi technique': 'تتبع تقني',
      'Contrôle budgétaire': 'مراقبة الميزانية',
      'Maîtrise du planning': 'التحكم في البرنامج الزمني',
      'Reporting investisseur': 'تقارير للمستثمر',
      'Réception & réserves': 'التسليم والتحفّظات',
      'Confier le pilotage': 'أسنِد إلينا الإدارة',

      /* — الأرقام — */
      'construits et aménagés': 'م² مبنية ومهيّأة',
      'années d’expérience': 'سنة من الخبرة',

      /* — الإنجازات — */
      'Nos projets phares': 'أبرز مشاريعنا',
      'Les preuves, pas les promesses': 'الأدلّة، لا الوعود',
      "Surfaces, lots, budgets et missions réels. Vous pouvez comparer avec votre propre projet — et nous demander les références.":
        'مساحات وحرف وميزانيات ومهام حقيقية. يمكنك مقارنتها بمشروعك — وطلب المراجع منّا.',
      'Tout': 'الكل',
      'Aménagement': 'تهيئة',
      'Construction': 'بناء',
      'Filtrer les réalisations': 'تصفية الإنجازات',
      'Lieu': 'المكان',
      'Surface': 'المساحة',
      'Lots': 'الحرف',
      'Budget': 'الميزانية',
      "Tout corps d'état": 'جميع الأشغال',
      'Gros œuvre': 'الأشغال الكبرى',
      'TCE hors menuiserie alu': 'جميع الأشغال عدا نجارة الألمنيوم',
      'Sur demande': 'عند الطلب',
      'Ambassade de Belgique': 'سفارة بلجيكا',
      'Usine Novares': 'مصنع نوفاريس',
      'Riad Pru': 'رياض برو',
      'Aménagement Saint Louis': 'تهيئة سان لوي',
      'Plateau bureaux Huawei': 'طابق مكاتب هواوي',
      'Showroom Thomas & Piron': 'صالة عرض توماس آند بيرون',
      'Aménagement ISH': 'تهيئة ISH',
      'Siège Novares': 'مقر نوفاريس',
      'Hangar industriel': 'مستودع صناعي',
      'Casablanca': 'الدار البيضاء',
      'Rabat': 'الرباط',
      'Kénitra': 'القنيطرة',
      'Marrakech': 'مراكش',
      'Un projet comparable au vôtre ? Demandez-nous le détail des lots et le retour du client.':
        'مشروع شبيه بمشروعك؟ اطلب منّا تفصيل الحرف ورأي العميل.',
      'Nous écrire': 'راسلنا',

      /* — العملاء والخريطة — */
      'Ils nous font confiance': 'يثقون بنا',
      'Des industriels, des enseignes et des cabinets': 'صناعيون وعلامات تجارية ومكاتب',
      'qui nous rappellent': 'يعودون إلينا',
      'Wolcons — Casablanca': 'ولكونس — الدار البيضاء',
      'Bd Brahim Roudani, résidence les palmiers B9,': 'شارع إبراهيم الروداني، إقامة النخيل B9،',
      'étage n°33, Casablanca, Maroc': 'الطابق الرابع، رقم 33، الدار البيضاء، المغرب',
      'Lundi – vendredi · 09h00 – 17h00': 'الاثنين – الجمعة · 09:00 – 17:00',
      'Itinéraire': 'الاتجاهات',
      'Localisation de Wolcons sur Google Maps — Bd Brahim Roudani, Casablanca':
        'موقع ولكونس على خرائط جوجل — شارع إبراهيم الروداني، الدار البيضاء',

      /* — الموردون — */
      'Nos partenaires': 'شركاؤنا',
      "Nous ne faisons pas d'économies": 'لا نقتصد أبداً',
      'sur ce qui tient le bâtiment': 'على ما يحمل البناء',

      /* — الأسئلة — */
      'Ce que les clients': 'ما يسأله',
      'nous demandent toujours': 'العملاء دائماً',
      "Une question qui n'est pas ici ? Appelez-nous, on répond directement.":
        'سؤال غير موجود هنا؟ اتصل بنا، نجيب مباشرة.',
      "Qu'est-ce que le « tout corps d'état » exactement ?": 'ما معنى «جميع الأشغال» بالضبط؟',
      "Le TCE désigne l'ensemble des métiers nécessaires pour rendre un espace utilisable : gros œuvre, cloisons, faux-plafonds, électricité, plomberie, climatisation, revêtements de sol et mur, menuiserie, peinture, vitrerie.":
        'يقصد بـ TCE مجموع الحرف اللازمة لجعل الفضاء صالحاً للاستعمال: الأشغال الكبرى، والحواجز، والأسقف المستعارة، والكهرباء، والسباكة، والتكييف، وتلبيس الأرضيات والجدران، والنجارة، والصباغة، والزجاج.',
      "Confier votre projet en TCE, c'est signer": 'أن تعهد بمشروعك بصيغة TCE يعني أن توقّع',
      'un seul contrat': 'عقداً واحداً',
      "au lieu de dix. C'est nous qui recrutons, planifions et contrôlons chaque corps de métier — et qui répondons du résultat final devant vous.":
        'بدل عشرة. نحن من يوظّف ويبرمج ويراقب كل حرفة — ونحن من يتحمّل أمامك مسؤولية النتيجة النهائية.',
      'Combien coûte un aménagement au mètre carré ?': 'كم تكلفة التهيئة للمتر المربع؟',
      'Un aménagement TCE se situe généralement entre': 'تتراوح تهيئة بجميع الأشغال عادةً بين',
      '2 500 et 12 500 DH/m²': '2500 و12500 درهم للمتر المربع',
      'selon le niveau de finition et le standing recherché. Un gros œuvre de villa se situe entre':
        'حسب مستوى التشطيب والمستوى المطلوب. أما الأشغال الكبرى لفيلا فتتراوح بين',
      '1 000 et 1 800 DH/m² HT': '1000 و1800 درهم للمتر المربع دون احتساب الضريبة',
      "Le prix exact dépend de l'état existant, des contraintes techniques et des matériaux choisis : c'est précisément ce que la visite et le devis détaillé servent à établir.":
        'يتوقّف الثمن الدقيق على الحالة القائمة، والإكراهات التقنية، والمواد المختارة: وهذا بالضبط ما تخدمه الزيارة الميدانية وعرض السعر المفصّل.',
      'Travaillez-vous avec les particuliers ?': 'هل تشتغلون مع الأفراد؟',
      "Oui. Nous intervenons aussi bien pour des multinationales et des institutions que pour des particuliers : villa, appartement, riad, local commercial. Le plus petit projet de notre portfolio est un aménagement de 56 m² ; le plus grand, une usine de 9 000 m².":
        'نعم. نتدخّل لفائدة الشركات متعددة الجنسيات والمؤسسات كما لفائدة الأفراد: فيلا، شقة، رياض، محل تجاري. أصغر مشروع في سجلّنا تهيئة بمساحة 56 م²، وأكبره مصنع بمساحة 9000 م².',
      'Même méthode, même exigence, quelle que soit la taille.':
        'المنهجية نفسها، والمستوى نفسه، مهما كان الحجم.',
      'Intervenez-vous en dehors de Casablanca ?': 'هل تتدخّلون خارج الدار البيضاء؟',
      'Notre siège est à Casablanca, et nous avons livré des projets à':
        'مقرّنا في الدار البيضاء، وقد سلّمنا مشاريع في',
      '(ambassade de Belgique, Villa E),': '(سفارة بلجيكا، فيلا E)،',
      '(usine et siège Novares) et': '(مصنع ومقر نوفاريس) و',
      '(Riad Pru). Parlez-nous de votre localisation : nous vous dirons franchement si nous sommes le bon interlocuteur.':
        '(رياض برو). أخبرنا بموقع مشروعك: وسنقول لك بصراحة إن كنّا المخاطب المناسب.',
      'Le devis peut-il changer en cours de chantier ?': 'هل يمكن أن يتغيّر عرض السعر أثناء الأشغال؟',
      'Le montant que vous signez est ferme sur le périmètre défini. Il ne bouge que dans deux cas : une modification que':
        'المبلغ الذي توقّعه ثابت ضمن النطاق المحدَّد. ولا يتغيّر إلا في حالتين: تعديل',
      'vous': 'تطلبه أنت',
      "demandez, ou un aléa réellement imprévisible (structure existante dégradée, découverte en fondation). Dans les deux cas, un avenant chiffré est présenté et validé":
        '، أو طارئ غير متوقّع فعلاً (هيكل قائم متضرّر، اكتشاف في الأساسات). وفي الحالتين يُقدَّم ملحق مسعَّر ويُصادق عليه',
      'avant': 'قبل',
      'exécution — jamais découvert sur la facture finale.': 'التنفيذ — ولا يُكتشف أبداً في الفاتورة النهائية.',
      "Comment suivre l'avancement sans venir sur place ?": 'كيف أتابع التقدّم دون الحضور إلى الورش؟',
      "Un conducteur de travaux et un chef de projet dédiés vous transmettent un point d'avancement régulier : photos du chantier, taux de réalisation par lot, budget consommé et prochaines étapes. Beaucoup de nos clients pilotent leur projet depuis l'étranger.":
        'مدير ورش ورئيس مشروع مخصّصان يوافيانك بحصيلة تقدّم منتظمة: صور من الورش، ونسبة الإنجاز لكل حرفة، والميزانية المستهلكة، والمراحل المقبلة. كثير من عملائنا يديرون مشاريعهم من الخارج.',

      /* — طلب عرض السعر — */
      'Parlons de votre projet': 'لنتحدّث عن مشروعك',
      'Décrivez votre projet.': 'صِف مشروعك.',
      'Vous recevez un chiffrage, pas un discours.': 'تتوصّل بتسعيرة، لا بخطاب.',
      "Remplissez le formulaire ou envoyez-nous directement un message WhatsApp. Nous revenons vers vous pour caler une visite et vous remettre un devis détaillé, gratuit et sans engagement.":
        'املأ الاستمارة أو راسلنا مباشرة عبر واتساب. نعود إليك لتحديد موعد زيارة وتسليمك عرض سعر مفصّلاً، مجاناً ودون أي التزام.',
      'étage n°33 — Casablanca': 'الطابق الرابع، رقم 33 — الدار البيضاء',
      'étage n°33 — Casablanca, Maroc': 'الطابق الرابع، رقم 33 — الدار البيضاء، المغرب',
      'Nom complet': 'الاسم الكامل',
      'Téléphone': 'الهاتف',
      'Type de projet': 'نوع المشروع',
      'Rénovation / réhabilitation': 'تجديد / إعادة تأهيل',
      'Je ne sais pas encore': 'لم أحدّد بعد',
      'Ville': 'المدينة',
      'Surface approximative': 'المساحة التقريبية',
      'Une estimation suffit à ce stade.': 'تقدير تقريبي يكفي في هذه المرحلة.',
      'Démarrage souhaité': 'تاريخ الانطلاق المرغوب',
      'Dès que possible': 'في أقرب وقت ممكن',
      'Dans 1 à 3 mois': 'خلال شهر إلى 3 أشهر',
      'Dans 3 à 6 mois': 'خلال 3 إلى 6 أشهر',
      'Je me renseigne': 'أستعلم فقط',
      'Votre projet en quelques lignes': 'مشروعك في بضعة أسطر',
      'Envoyer ma demande de devis': 'أرسل طلب عرض السعر',
      'Gratuit et sans engagement. Vos informations servent uniquement à vous répondre.':
        'مجاناً ودون أي التزام. تُستعمل معطياتك للرد عليك فقط.',
      'Plateau de bureaux à rénover entièrement, 160 m², cloisons + électricité + climatisation…':
        'طابق مكاتب يُجدَّد بالكامل، 160 م²، حواجز + كهرباء + تكييف…',
      'Karim Benali': 'كريم بنعلي',
      'Merci d’indiquer votre nom.': 'يرجى إدخال اسمك.',

      /* — التذييل — */
      "Entreprise générale de construction et d'aménagement tout corps d'état. Casablanca · Rabat · Kénitra · Marrakech.":
        'مقاولة عامة للبناء والتهيئة بجميع الأشغال. الدار البيضاء · الرباط · القنيطرة · مراكش.',
      'Rénovation & réhabilitation': 'التجديد وإعادة التأهيل',
      'Le site': 'الموقع',
      'Pourquoi Wolcons': 'لماذا ولكونس',
      'Wolcons® — La construction, la perfection à son meilleur.':
        'ولكونس® — البناء، الإتقان في أبهى صوره.',
      'Tous droits réservés.': 'جميع الحقوق محفوظة.',
      'Wolcons sur LinkedIn': 'ولكونس على لينكدإن',
      'Wolcons sur Instagram': 'ولكونس على إنستغرام',
      'Wolcons sur Facebook': 'ولكونس على فيسبوك'
    }
  };

  /* ------------------------------------------------------------------ */

  var SPLIT_SEL = '.hero__title span, .h2, .statement';
  var SKIP_SEL  = 'script,style,.preloader,[data-count],[data-year],[data-status],[data-error],.lang';
  var ATTRS     = ['placeholder', 'aria-label', 'title', 'alt'];

  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };

  var htmlEls = [];   // {el, fr}
  var texts   = [];   // {node, fr}
  var attrs   = [];   // {el, name, fr}
  var current = 'fr';

  function collect() {
    $$(SPLIT_SEL).forEach(function (el) { htmlEls.push({ el: el, fr: el.innerHTML }); });

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!norm(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = node.parentElement;
        if (!p || p.closest(SKIP_SEL) || p.closest(SPLIT_SEL)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) texts.push({ node: n, fr: n.nodeValue });

    $$('[placeholder],[aria-label],[title],[alt]').forEach(function (el) {
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && norm(v)) attrs.push({ el: el, name: a, fr: v });
      });
    });
  }

  function tr(fr, lang) {
    if (lang === 'fr') return fr;
    var table = DICT[lang] || {};
    var key = norm(fr);
    if (!Object.prototype.hasOwnProperty.call(table, key)) return fr;
    var out = table[key];
    // On restitue les espaces de bord d'origine pour ne pas coller les mots
    var lead = /^\s*/.exec(fr)[0];
    var tail = /\s*$/.exec(fr)[0];
    return lead + out + tail;
  }

  function trHTML(fr, lang) {
    if (lang === 'fr') return fr;
    var box = document.createElement('div');
    box.innerHTML = fr;
    var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (norm(n.nodeValue)) n.nodeValue = tr(n.nodeValue, lang);
    }
    return box.innerHTML;
  }

  function apply(lang) {
    var root = document.documentElement;
    root.classList.add('lang-switching');

    texts.forEach(function (t) { t.node.nodeValue = tr(t.fr, lang); });
    attrs.forEach(function (a) { a.el.setAttribute(a.name, tr(a.fr, lang)); });

    htmlEls.forEach(function (h) {
      h.el.innerHTML = trHTML(h.fr, lang);
      if (typeof window.__wolconsSplit === 'function') window.__wolconsSplit(h.el);
    });

    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    markButtons(lang);
    closePanels();

    current = lang;
    try { window.localStorage.setItem('wolcons-lang', lang); } catch (e) {}

    window.setTimeout(function () { root.classList.remove('lang-switching'); }, 60);
  }

  /* ---- sélecteur repliable ---- */
  function markButtons(lang) {
    $$('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-lang-current]').forEach(function (el) { el.textContent = lang.toUpperCase(); });
  }

  function closePanels(except) {
    $$('[data-lang-switch]').forEach(function (box) {
      if (box === except) return;
      var panel = box.querySelector('[data-lang-panel]');
      var toggle = box.querySelector('[data-lang-toggle]');
      if (panel) panel.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function togglePanel(box) {
    var panel = box.querySelector('[data-lang-panel]');
    var toggle = box.querySelector('[data-lang-toggle]');
    if (!panel || !toggle) return;
    var open = panel.hidden;
    closePanels(box);
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }

  collect();

  var saved = 'fr';
  try { saved = window.localStorage.getItem('wolcons-lang') || 'fr'; } catch (e) {}
  if (saved !== 'fr' && DICT[saved]) {
    apply(saved);
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    markButtons('fr');
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;

    var choice = e.target.closest('.lang__btn');
    if (choice) {
      var lang = choice.getAttribute('data-lang');
      if (lang && lang !== current) apply(lang);
      else closePanels();
      return;
    }

    var toggle = e.target.closest('[data-lang-toggle]');
    if (toggle) {
      togglePanel(toggle.closest('[data-lang-switch]'));
      return;
    }

    closePanels();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('[data-lang-toggle][aria-expanded="true"]');
    if (!open) return;
    closePanels();
    open.focus();
  });

  window.WOLCONS_LANG = { apply: apply, get: function () { return current; } };
})();
