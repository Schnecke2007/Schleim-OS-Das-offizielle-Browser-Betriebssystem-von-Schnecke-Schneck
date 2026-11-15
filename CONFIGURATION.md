# Configuration guide

This folder is a neutral source template. Its manifest is named **manifest.template.json** so Chromium does not detect it as an installable extension while the original extension remains in the main repository.

## 1. Product identity

Edit **manifest.template.json**:

- **name**: your extension name
- **short_name**: short display name
- **description**: a short description
- **version**: your release version

Update the visible title, brand text, demo profile and sample pages in **pages/newtab.html** and **scripts/app.js**. Replace the sample artwork in **assets/demo/** and **assets/icons/** with your own images.

**Do not rename the manifest yet.** First complete the configuration below. Once the template is ready to test as an extension, rename **manifest.template.json** to **manifest.json** inside this folder.

## 2. Profile and demo links

Edit **scripts/app.js**:

- Set SITE to your own public website.
- Replace the URLS entries with your own destinations.
- Update the demo creator profile, sample projects and demo shop.
- Remove any sample page or link you do not intend to publish.

Edit **scripts/personalization.js** if you want the Store's GitHub issue, catalog and ratings links to point to a different repository.

## 3. GitHub repository integration

In **scripts/update-center.js**, set:

- OWNER to your GitHub username or organization
- REPOSITORY to your repository name

After you rename the manifest to **manifest.json** and publish the extension files at your repository root, the update center can read that root-level manifest.

In **scripts/slime-store-admin.js**, set OWNER, REPO and keep CATALOG aligned with **data/store-apps.json**.

## 4. GitHub App and private cloud

The account and backup features require your own GitHub App. Create and configure it in GitHub, then edit **scripts/schleim-account.js**:

- GITHUB_APP_CLIENT_ID
- GITHUB_APP_SLUG
- GITHUB_APP_INSTALL_URL
- REPO_NAME for the private backup repository

Set the same media repository name in **scripts/schleim-account.js** (PHOTOS_REPO_NAME) and **scripts/schleim-photos-cloud.js** (REPO_NAME). Test login, private backup and media upload with a separate test account first.

Only the public Client ID belongs in the extension. **Never embed a Client Secret, private key, personal access token or other secret.**

## 5. Store content and ratings

- Edit sample entries in **data/store-apps.json**.
- **data/store-ratings.json** starts empty. Do not copy real user ratings or personal data into a public template.
- Change the Store issue and catalog URLs in **scripts/personalization.js**.
- Verify that your repository's issue template and Store automation match your own repository before enabling public submissions.

## 6. Legal information and privacy

The legal-information screens contain placeholders such as **[YOUR NAME]**, **[YOUR STREET AND HOUSE NUMBER]** and **your-email@example.com**. Replace them with legally reviewed information that applies to your project and jurisdiction. Do not publish placeholders as if they were valid legal notices.

## 7. Test and package

After configuration and renaming the manifest, run the navigation tests from this directory:

**node --test tests/app-navigation.test.js**

Load the folder containing the renamed **manifest.json** as an unpacked extension in a Chromium desktop browser. Test all configured links, permissions, account flows and cloud features before publishing.
