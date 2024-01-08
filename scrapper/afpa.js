import puppeteer from "puppeteer";
// document.getElementById('submit').addEventListener('click', async () => {
console.log("btngood");

// Variables pour la configuration
const url = "https://territoiredigital.afpa.fr/fr";
const identifiant = "djbannik@gmail.com";
const password = "Superyoyo62**afpa";
const attribId = "#email";
const attribPass = "#password";
const btnGo = ".btn";
const blacklist = [
  "https://www.afpa.fr/c/portal/login?service=https://www.afpa.fr/",
  "https://www.linkedin.com/company/afpa/",
  // Ajoutez d'autres liens à éviter ici
];
const motsCles = ["dwwm", "DWWM", "passboc", "claire"]; // Ajoutez vos mots-clés ici

// Fonction de scraping de la page


// Fonction principale
const main = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  if (identifiant && password) {
    await page.goto(url);

    // await page.waitForSelector("#axeptio_btn_dismiss", {timeout: 30000});
    // await page.click("#axeptio_btn_dismiss");
    await page.waitForSelector("#login-connexion");
    await page.click("#login-connexion");

    await page.waitForSelector("#rowModalConnexion");

    page.on("dialog", async (dialog) => {
      console.log(`Popup ouverte: ${dialog.message()}`);

      // Exemple: Accepter tous les popups
      await dialog.dismiss();

      // Vous pouvez également rejeter le popup avec dialog.dismiss(),
      // ou effectuer une action spécifique en fonction du contenu du popup.
    });
    await page.waitForSelector(attribId);
    await page.type(attribId, identifiant);
    await page.type(attribPass, password);
    await page.click(btnGo);
    await page.waitForNavigation();
  }

  await page.goto(url);
  await page.waitForTimeout(5000);

  const liens = await page.evaluate(() => {
    const anchors = document.querySelectorAll("a");
    return Array.from(anchors, (anchor) => anchor.href);
  });

  for (const lien of liens) {
    await navigateAndScrap(page, lien);
    console.log("Page visitée : " + lien);
  }

  await browser.close();
};

const scrappingPage = async (page) => {
  const content = await page.content();

  // Faire du scraping sur le contenu
  const emails = content.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  );
  console.log("Emails trouvés:", emails);

  const numeros = content.match(/\+\d+/g);
  console.log("Numéros de téléphone trouvés:", numeros);

  const liens = content.match(/<a [^>]*href=["']([^"']+)/g);
  console.log("Liens trouvés:");
  liens.forEach((lien) => {
    console.log(lien.replace(/<a [^>]*href=["']/, ""));
  });
};

// Fonction de navigation et de scraping
const navigateAndScrap = async (page, lien) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(lien)) {
    console.log(`L'URL n'est pas valide : ${lien}`);
    return;
  }

  if (blacklist.includes(lien)) {
    console.log(`L'URL est dans la liste noire, ignorée : ${lien}`);
    return;
  }

  console.log(`Navigation vers : ${lien}`);
  await page.goto(lien);
  await scrappingPage(page);
};

// Exécutez la fonction principale
await main();
// });
