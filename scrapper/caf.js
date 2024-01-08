import puppeteer from "puppeteer";

const url = "https://connect.caf.fr/connexionappli/dist/#/login";
const identifiant = "*****";
const password = "***";
const attribId = "#nir";
const attribPass = "#inputMotDePasse";
const btnGo = ".btn.btn-form-cnaf.btn-majeur-cnaf";
const btnPop = ".center-block.agree-button-caf.btn.btn-primary-cnaf";
const messagerie = "a>span.picto.picto-enveloppe-blanc";
const historique =
  "#ns_Z7_NA6AH30209SO20Q3L5JUAC00D4_angularApp > app-root > div > div > div > courriers-courriels > div > div:nth-child(2) > ul > li:nth-child(2) > button";
const containerCourrier =
  "#ns_Z7_NA6AH30209SO20Q3L5JUAC00D4_angularApp > app-root > div > div > div > courriers-courriels > courriers-courriels-historique > div > div > div:nth-child(1) > ul";
const containerCourrierNonLu =
  "#ns_Z7_NA6AH30209SO20Q3L5JUAC00D4_angularApp > app-root > div > div > div > courriers-courriels > courriers-courriels-non-lus > div > div > div:nth-child(1)";
const nonLu =
  "#ns_Z7_NA6AH30209SO20Q3L5JUAC00D4_angularApp > app-root > div > div > div > courriers-courriels > div > div:nth-child(2) > ul > li:nth-child(1) > button";
(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  console.log('\x1b[31m%s\x1b[0m',"bienvenue dans le bot messagerie caf");

  // Create a page
  const page = await browser.newPage();

  await page.setBypassCSP(true);

  page.on("dialog", async (dialog) => {
    console.log(`Popup ouverte: ${dialog.message()}`);
    await dialog.accept();
  });

  // Go to your site
  await page.goto(url);

  // Query for an element handle.
  const elementId = await page.waitForSelector(attribId);
  const elementPass = await page.waitForSelector(attribPass);
  const elementBtn = await page.waitForSelector(btnGo);

  await elementId.type(identifiant, attribId);
  await elementPass.type(password, attribPass);
  await elementBtn.click();

  const elementBtnPop = await page.waitForSelector(btnPop);
  await elementBtnPop.click();
  const spanMessagerie = await page.waitForSelector(messagerie);
  // await spanMessagerie.click();
  await page.waitForTimeout(2000);

  await spanMessagerie.click();
  await page.waitForTimeout(2000);

  const ongletsHistorique = await page.waitForSelector(historique, {
    timeout: 20000,
  });
  const messNonLu = await page.waitForSelector(nonLu);
  await page.waitForTimeout(2000);

  await ongletsHistorique.click();
  await page.waitForTimeout(2000);

  // Attendre que la liste soit présente dans le DOM
  await page.waitForTimeout(3000);

  const courriersElements = await page.$$(containerCourrier + " li");

  console.log(
    "----------------------------------------------------------------------------------"
  );
  console.log('\x1b[34m%s\x1b[0m',"PLACE A L'HISTORIQUE !..");
  for (const courrierElement of courriersElements) {
    const childElements = await courrierElement.$$("div.row");

    for (const childElement of childElements) {
      // Récupérez le contenu de l'élément courrier avant de cliquer sur les boutons
      const content = await childElement.evaluate((node) =>
        node.textContent.trim()
      );
      console.log('\x1b[32m%s\x1b[0m',"Contenu de la liste des messages:", content);
      console.log(
        "----------------------------------------------------------------------------------"
      );

      // Cliquez sur le bouton "Télécharger" si présent
      const downloadButton = await childElement.$(
        "button.btn.btn-form-cnaf.btn-pdf-cnaf.btn-lien-cnaf.btn-courrierscourriels",
        { timeout: 30000 }
      );
      if (downloadButton) {
        await downloadButton.click();
        console.log('\x1b[31m%s\x1b[0m',"il y a un document a récupéré (modifier headless a new).");
      } else {
        console.error("pas de document a télécharger.");
      }

      const lireButton = await childElement.$(
        "button.btn.btn-form-cnaf.btn-lien-cnaf.pull-right.btn-courrierscourriels"
      );

      // if (lireButton) {
      //   // Récupérer le code onclick du bouton "Lire"
      //   const lireButtonCode = await childElement.evaluate(node => {
      //       const btn = node.querySelector('span.btn-block');
      //       return btn ? btn.getAttribute('onclick') : 'non trouvé!';
      //   });

      // if (lireButtonCode) {
      //     console.log('Bouton "Lire" trouvé. Code onclick:', lireButtonCode);

      //     // Exécuter le code onclick dans le contexte de la page
      //     await page.evaluate(lireButtonCode);
      // } else {
      //     console.error('Code onclick du bouton "Lire" non trouvé.');
      // }
      // } else {
      //     console.error('Bouton "Lire" non trouvé.');
      // }
    }
  }
  await page.waitForTimeout(10000);
  if (messNonLu) {
    messNonLu.click();
  } else {
    console.log("bt non trouvée");
  }
  console.log(
    "----------------------------------------------------------------------------------"
  );
  console.log('\x1b[34m%s\x1b[0m',"PLACE AUX COURRIEES RECU !.....");
  const mainPage = (await browser.pages())[1];
  await mainPage.bringToFront();
  const elementNonLu = await page.waitForSelector(containerCourrierNonLu, {
    timeout: 10000,
  });
  if (elementNonLu) {
    const textContent = await elementNonLu.evaluate((node) =>
      node.textContent.trim()
    );
    console.log('\x1b[32m%s\x1b[0m',"Contenu de l'élément non lu:", textContent);
  } else {
    console.error("Élément non lu inexistant.");
  }
  await browser.close();
})();
