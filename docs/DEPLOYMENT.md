# Deploying nagasurya.com

Everything needed to put the portfolio online, connect the domain, and keep it deploying after
Vercel's GitHub connection is removed.

## At a glance

|                 |                                                                           |
| --------------- | ------------------------------------------------------------------------- |
| Code            | GitHub `snss10/Portfolio`, branch `main`                                  |
| Hosting         | Vercel, free Hobby plan                                                   |
| Domain          | `nagasurya.com`, registered at Hostinger                                  |
| Main address    | `https://nagasurya.com` (`www.nagasurya.com` redirects to it)             |
| Build           | `npm ci`, then `npm run build`, output folder `dist` (set in vercel.json) |
| Checks          | GitHub Actions: formatting, types and build, on every push                |
| Deploys (later) | GitHub Actions job "Deploy to Vercel", after the checks pass              |

The order:

1. First deploy, using Vercel's GitHub connection (part 1).
2. Connect `nagasurya.com` (parts 2 and 3).
3. Move deploys to GitHub Actions, then disconnect GitHub from Vercel (part 4). From then on,
   every push to `main` still deploys.

## Part 1: first deploy

1. Go to [vercel.com](https://vercel.com) and choose **Continue with GitHub**, using the `snss10`
   account.
2. Choose **Add New → Project** and import **snss10/Portfolio**. If it isn't listed, choose **Adjust
   GitHub App Permissions** and allow that repository.
3. Keep the project name `portfolio`. The framework (Astro) and build settings come from
   `vercel.json`, so don't change them, and don't add environment variables.
4. Choose **Deploy**. When it finishes, open the `….vercel.app` address and check the site.

## Part 2: add the domain in Vercel

1. In the project, open **Settings → Domains**, enter `nagasurya.com` and choose **Add**.
2. When asked, also add `www.nagasurya.com` and set it to **redirect to `nagasurya.com`**. Keep
   `nagasurya.com` as the primary domain: it is the address the site gives to Google and LinkedIn.
3. Both domains show **Invalid Configuration** with the records to create. Note them down:

   | Type  | Name  | Value                                                          |
   | ----- | ----- | -------------------------------------------------------------- |
   | A     | `@`   | copy from Vercel (for example `76.76.21.21` or `216.198.79.1`) |
   | CNAME | `www` | copy from Vercel                                               |

   Always use the values Vercel shows for this project, not values from a tutorial.

## Part 3: point nagasurya.com at Vercel (Hostinger)

1. In hPanel, open **Domains → nagasurya.com → DNS / Nameservers → DNS records**. Keep Hostinger's
   nameservers.
2. If **Hostinger CDN** is on for this domain, turn it off.
3. Delete the records that still point at Hostinger:
   - every **A** record named `@` (there can be more than one),
   - every **AAAA** record named `@` or `www` (IPv6). Vercel doesn't serve IPv6, so a leftover AAAA
     record sends visitors on IPv6 networks (common on Indian mobile data) to Hostinger's server,
     which shows a "Not secure" warning,
   - any **CNAME** or **A** record named `www`.

   Leave **MX** and **TXT** records alone: they handle email. If there are **CAA** records, keep
   them only if one of them allows `letsencrypt.org` (Vercel's certificates come from Let's
   Encrypt); otherwise delete them.

4. Add an **A** record: name `@`, points to Vercel's value, default TTL.
5. Add a **CNAME** record: name `www`, target Vercel's value, default TTL. Save.
6. Back in Vercel, refresh **Settings → Domains** until both domains show **Valid Configuration**.
   This usually takes minutes, occasionally a few hours. Vercel then sets up HTTPS on its own.
7. Check these addresses:
   - `https://nagasurya.com`
   - `https://www.nagasurya.com` (should land on `https://nagasurya.com`)
   - `https://nagasurya.com/work/itaf/` and `https://nagasurya.com/projects/vfabit/`
   - `https://nagasurya.com/S-Naga-Surya-Resume.pdf`
   - `https://nagasurya.com/missing/` (should show the "Page not found" page)
8. Paste `https://nagasurya.com` into the
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to check the preview card.

## Part 4: keep deploying after disconnecting GitHub from Vercel

After this part, Vercel no longer needs access to GitHub. Instead, the "Deploy to Vercel" job in
`.github/workflows/ci.yml` deploys with a Vercel token stored in GitHub. Follow the steps in order:
the last one switches the job on, so a push never deploys twice.

### 4.1 Create a Vercel token

In Vercel, open **Account Settings → Tokens** and create a token named `github-actions-portfolio`.
Pick an expiry you'll remember (for example one year) and copy the token: it's shown once.

### 4.2 Find the two IDs

- **Project ID:** project → **Settings → General → Project ID** (starts with `prj_`).
- **Team ID:** the team that owns the project (every Vercel account has one, even on Hobby). Open
  the team from the top-left switcher, then **Settings → General → Team ID** (starts with `team_`).
  Don't use **Your ID** from Account Settings: that's your user ID, and the deploy then fails with
  `Project not found`.

Another way to get both: run `npx vercel link` in the project folder on your computer, then open
`.vercel/project.json`. `orgId` is the Team ID and `projectId` is the Project ID.

### 4.3 Store them in GitHub

On github.com/snss10/Portfolio, open **Settings → Secrets and variables → Actions**:

1. **Secrets** tab → **New repository secret**: name `VERCEL_TOKEN`, value the token.
2. **Variables** tab → **New repository variable**: name `VERCEL_ORG_ID`, value the Team ID
   (`team_…`).

Don't add `VERCEL_PROJECT_ID` yet. It is the switch, and comes last.

### 4.4 Disconnect GitHub in Vercel

Project → **Settings → Git → Disconnect**. The live site stays up; only automatic deploys stop.

Optional: to remove Vercel's access on GitHub's side too, open **github.com → Settings →
Applications → Installed GitHub Apps → Vercel → Configure**, then remove Portfolio or uninstall.

### 4.5 Switch on deploys from GitHub Actions

**Variables** tab → **New repository variable**: name `VERCEL_PROJECT_ID`, value the project ID.

### 4.6 Test once

1. Open github.com/snss10/Portfolio/actions, choose **CI → Run workflow**, branch `main`.
2. Both jobs should pass: **Format, type-check and build**, then **Deploy to Vercel**.
3. In Vercel, **Deployments** shows a new production deployment. Open `https://nagasurya.com`.

## Part 5: get found on Google

The site already gives search engines what they need: a sitemap, `robots.txt`, a canonical address
and structured data (Person, WebSite, breadcrumbs) on every page, plus `llms.txt` for AI assistants.
What's left is telling Google the site exists.

1. Open [Google Search Console](https://search.google.com/search-console) and add a **Domain**
   property for `nagasurya.com`.
2. Google shows a **TXT** record. In hPanel → **DNS records**, add it: type `TXT`, name `@`, value
   the text Google gave you. Back in Search Console, choose **Verify** (it can take a few minutes).
3. In **Sitemaps**, submit `https://nagasurya.com/sitemap-index.xml`.
4. In **URL inspection**, enter `https://nagasurya.com/` and choose **Request indexing**.
5. Optional: in [Bing Webmaster Tools](https://www.bing.com/webmasters), choose **Import from Google
   Search Console**. Bing's index also feeds DuckDuckGo.
6. Put `https://nagasurya.com` on your LinkedIn and GitHub profiles: links from them help Google
   connect the site to your name.

Search results take a few days to a few weeks to appear.

## Day to day

- Edit content in `src/data/` and push to `main`. The checks run, then the site deploys, in about
  two minutes.
- Follow a deploy in GitHub's **Actions** tab or Vercel's **Deployments** list.
- To undo a bad deploy: Vercel → **Deployments** → pick the previous one → **Instant Rollback**.
- Pull requests and other branches only run the checks; they never deploy.
- If you ever reconnect Vercel's GitHub connection, delete the `VERCEL_PROJECT_ID` variable so
  pushes don't deploy twice.

## If something goes wrong

| What you see                                                      | What to do                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| The browser says "Not secure" or "Your connection is not private" | See [the HTTPS checklist](#https-checklist) below.                                    |
| A domain shows "Invalid Configuration" in Vercel                  | Compare the Hostinger records with Vercel's values; remove old `@` and `www` records. |
| Deploy fails with `Project not found`                             | `VERCEL_ORG_ID` must be the **Team ID** (`team_…`), not your user ID. See 4.2.        |
| `www.nagasurya.com` doesn't redirect                              | Vercel → Domains: set `www.nagasurya.com` to redirect to `nagasurya.com`.             |
| "Deploy to Vercel" shows as skipped                               | The `VERCEL_PROJECT_ID` variable is missing, or the run wasn't on `main`.             |
| Deploy fails at "Check the deploy settings"                       | Add the secret or variable named in the error.                                        |
| Deploy fails with an invalid or expired token                     | Create a new Vercel token and replace the `VERCEL_TOKEN` secret.                      |
| You pushed but the site didn't change                             | Open the Actions run: the deploy only runs after the checks pass.                     |
| LinkedIn shows an old preview                                     | Paste the address into the LinkedIn Post Inspector to refresh it.                     |

### HTTPS checklist

The site itself loads nothing over plain `http://`, so a "Not secure" warning always comes from the
domain setup. Check these in order:

1. **Type the address with `https://`.** Browsers label any `http://` page "Not secure". Once
   Vercel has a certificate, it redirects `http://` to `https://` by itself.
2. **Vercel → project → Settings → Domains.** Both domains should show **Valid Configuration** and
   no certificate error. A fresh domain can take up to an hour to get its certificate.
3. **Hostinger DNS records:** no **AAAA** records on `@` or `www`, exactly one **A** record on `@`
   (Vercel's value), the `www` **CNAME** pointing at Vercel, no CAA record that leaves out
   `letsencrypt.org`, and Hostinger CDN off.
4. **Check from outside:** [whatsmydns.net](https://www.whatsmydns.net/#AAAA/nagasurya.com) should
   find no AAAA record, and [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=nagasurya.com)
   should show a valid certificate for `nagasurya.com`.
5. **Still stuck after fixing DNS?** In Vercel → Domains, remove `nagasurya.com` and add it again to
   restart the certificate. Then test in a private window or on mobile data, since browsers cache the
   warning.
