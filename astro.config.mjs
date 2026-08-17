import { defineConfig } from "astro/config";

const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
const repository = process.env.GITHUB_REPOSITORY || "";
const repositoryName = repository.includes("/") ? repository.split("/")[1] : "";

const isUserSite = repositoryName.endsWith(".github.io");
const base =
  process.env.BASE_PATH ||
  (isGitHubActions && repositoryName && !isUserSite ? `/${repositoryName}` : "");

const site =
  process.env.SITE_URL ||
  (isUserSite ? `https://${repositoryName}` : undefined);

export default defineConfig({
  site,
  base,
});
