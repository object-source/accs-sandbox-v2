# Edge Delivery Services + Adobe Commerce Boilerplate

This project boilerplate is for Edge Delivery Services projects that integrate with Adobe Commerce.

## Documentation

Before using the boilerplate, we recommend you to go through the documentation on <https://experienceleague.adobe.com/developer/commerce/storefront/> and more specifically:

1. [Storefront Developer Tutorial](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/)
1. [AEM Docs](https://www.aem.live/docs/)
1. [AEM Developer Tutorial](https://www.aem.live/developer/tutorial)
1. [The Anatomy of an AEM Project](https://www.aem.live/developer/anatomy-of-a-project)
1. [Web Performance](https://www.aem.live/developer/keeping-it-100)
1. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Getting Started

Use the [Site Creator Tool](https://da.live/app/adobe-commerce/storefront-tools/tools/site-creator/site-creator) to quickly spin up your own copy of code and content.

Alternatively, you can follow our [Guide](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/) for a more detailed walkthrough.

## Updating Drop-in dependencies

You may need to update one of the drop-in components, or `@adobe/magento-storefront-event-collector` or `@adobe/magento-storefront-events-sdk` to a new version. Besides checking the release notes for any breaking changes, ensure you also execute the `postinstall` script so that the dependenices in your `scripts/__dropins__` directory are updated to the latest build. This should be run immediately after you update the component, for example:

```bash
npm install @dropins/storefront-cart@2.0. # Updates the storefront-cart dependency in node_modules/
npm run postinstall # Copies scripts from node_modules into scripts/__dropins__
```

This is a custom script which copies files out of `node_modules` and into a local directory which EDS can serve. You must manually run `postinstall` due to a design choice in `npm` which does not execute `postinstall` after you install a _specific_ package.

## Changelog

Major changes are described and documented as part of pull requests and tracked via the `changelog` tag. To keep your project up to date, please follow this list:

<https://github.com/hlxsites/aem-boilerplate-commerce/issues?q=label%3Achangelog+is%3Aclosed>


Site Details
- Site: https://main--accs-sandbox-v2--object-source.aem.live
- Code: https://github.com/object-source/accs-sandbox-v2
- Content: https://da.live/#/object-source/accs-sandbox-v2
- Commerce Config: https://github.com/object-source/accs-sandbox-v2/blob/main/config.json

For next steps, including how to customize your storefront and make it your own, check out the Adobe Commerce Storefront Docs: https://experienceleague.adobe.com/developer/commerce/storefront/

⚠️ Important: Secure Your Site
Warning: Your site is not protected by default. Anyone can access and modify your content and code.

To secure your site, please follow these steps:

Content protection: Configure permissions for your content in Document Authoring
Site authentication: Set up authentication for your EDS site
🔧 Configuration Check Required
Important: Since you provided a custom Commerce GraphQL endpoint, a config.json has been automatically generated to match your environment.

Please review the following configuration details:

Headers: Ensure that all required Commerce headers are set correctly.
Analytics: Verify that store details, currency codes, and environment settings align with your Commerce instance
Endpoints: Confirm that GraphQL endpoints point to the correct services
For more information about required configuration values, see the Commerce Configuration documentation.

Note: Incorrect configuration values can prevent your storefront from connecting to your Commerce backend properly.