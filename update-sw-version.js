const fs = require('fs');
const path = require('path');

/**
 * Custom semantic-release plugin to update VERSION and DATETIME in service worker
 */
module.exports = {
  prepare: async (pluginConfig, context) => {
    const { nextRelease, logger } = context;
    const swPath = path.join(process.cwd(), 'sw.js');

    try {
      // Check if sw.js exists
      if (!fs.existsSync(swPath)) {
        throw new Error(`Service worker file not found at ${swPath}`);
      }

      // Read the current service worker file
      let swContent = fs.readFileSync(swPath, 'utf8');

      // Get current datetime in ISO format
      const currentDateTime = new Date().toISOString();

      // Backup original content for verification
      const originalContent = swContent;

      // Update VERSION
      const versionRegex = /const VERSION = '[^']*';/;
      if (!versionRegex.test(swContent)) {
        throw new Error('VERSION constant not found in sw.js');
      }
      swContent = swContent.replace(versionRegex, `const VERSION = '${nextRelease.version}';`);

      // Update DATETIME
      const datetimeRegex = /const DATETIME = '[^']*';/;
      if (!datetimeRegex.test(swContent)) {
        throw new Error('DATETIME constant not found in sw.js');
      }
      swContent = swContent.replace(datetimeRegex, `const DATETIME = '${currentDateTime}';`);

      // Verify changes were made
      if (swContent === originalContent) {
        throw new Error('No changes were made to sw.js - check VERSION and DATETIME constants');
      }

      // Write the updated content back to the file
      fs.writeFileSync(swPath, swContent, 'utf8');

      logger.log(`✅ Updated sw.js successfully:`);
      logger.log(`   VERSION: ${nextRelease.version}`);
      logger.log(`   DATETIME: ${currentDateTime}`);

    } catch (error) {
      logger.error('❌ Failed to update sw.js:', error.message);
      throw error;
    }
  }
};
