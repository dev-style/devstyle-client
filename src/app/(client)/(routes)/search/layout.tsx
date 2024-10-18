import { Metadata } from "next";
import Page from "./page";

export const metadata: Metadata = {
  title: "Recherche | DevStyle",
  description:
    "Trouvez vos articles tech préférés sur DevStyle. Explorez notre collection de T-shirts, stickers, hoodies et plus encore pour les passionnés de développement. #EtreDeveloppeurPlusQu'unMetierC'estUnStyleDeVie #devStyle #devAttitude",
};

const Layout = () => {
  return <Page />;
};

export default Layout;
