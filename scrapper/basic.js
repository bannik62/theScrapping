import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://www.cdiscount.com';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const regexCommentaires = /<!--([\s\S]*?)-->/g;
    const commentairesTrouves = html.match(regexCommentaires);

    console.log('Commentaires trouvés :', commentairesTrouves);

    // Exemple de recherche d'emails
    const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    console.log('Emails trouvés:', emails);

    // Exemple de recherche de numéros de téléphone
    let tel = /^0[1-9]([-. ]?[0-9]{2}){4}$/;
    const numeros = html.match(tel);
    console.log('Numéros de téléphone trouvés:', numeros);

    // Exemple de recherche de liens
    const liens = [];

    $('a').each((index, element) => {
      const lien = $(element).attr('href');
      if (lien) {
        liens.push(lien);
      }
    });

    console.log('Liens trouvés:', liens);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération de la page :', error.message);
  });
