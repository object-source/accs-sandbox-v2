#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple glob implementation to avoid external dependency
function simpleGlob(pattern, basePath) {
  const files = [];
  const dir = path.dirname(pattern);
  const filename = path.basename(pattern);

  if (filename.includes('*')) {
    const fullDir = path.resolve(basePath, dir);
    if (fs.existsSync(fullDir)) {
      const dirFiles = fs.readdirSync(fullDir);
      const regex = new RegExp(filename.replace('*', '.*'));
      dirFiles.forEach((file) => {
        if (regex.test(file)) {
          files.push(path.join(fullDir, file));
        }
      });
    }
  } else {
    const fullPath = path.resolve(basePath, pattern);
    if (fs.existsSync(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Resolves JSON references in the format { "...": "./path/to/file.json#/property" }
 */
function resolveReferences(obj, basePath) {
  if (Array.isArray(obj)) {
    const result = [];
    obj.forEach((item) => {
      if (item && typeof item === 'object' && item['...']) {
        const refPath = item['...'];
        const [filePath, jsonPath] = refPath.split('#');

        if (filePath.includes('*')) {
          // Handle glob patterns
          const files = simpleGlob(filePath, basePath);

          files.forEach((file) => {
            try {
              const content = JSON.parse(fs.readFileSync(file, 'utf8'));
              const property = jsonPath.substring(1); // Remove leading '/'
              if (content[property]) {
                result.push(...content[property]);
              }
            } catch (error) {
              // Silently ignore files that can't be processed
            }
          });
        } else {
          // Handle single file reference
          const fullPath = path.resolve(basePath, filePath);
          try {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const property = jsonPath.substring(1); // Remove leading '/'
            if (content[property]) {
              result.push(...content[property]);
            }
          } catch (error) {
            // Silently ignore files that can't be processed
          }
        }
      } else {
        result.push(resolveReferences(item, basePath));
      }
    });
    return result;
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = resolveReferences(value, basePath);
    });
    return result;
  }
  return obj;
}

/**
 * Build UE configuration files
 */
function buildUEConfig() {
  const ueModelsPath = path.join(__dirname, '..', 'ue', 'models');
  const rootPath = path.join(__dirname, '..');

  // Build component-definition.json
  const definitionTemplate = JSON.parse(
    fs.readFileSync(path.join(ueModelsPath, 'component-definition.json'), 'utf8'),
  );
  const resolvedDefinitions = resolveReferences(definitionTemplate, ueModelsPath);
  fs.writeFileSync(
    path.join(rootPath, 'component-definition.json'),
    JSON.stringify(resolvedDefinitions, null, 2),
  );

  // Build component-models.json
  const modelsTemplate = JSON.parse(
    fs.readFileSync(path.join(ueModelsPath, 'component-models.json'), 'utf8'),
  );
  const resolvedModels = resolveReferences(modelsTemplate, ueModelsPath);
  fs.writeFileSync(
    path.join(rootPath, 'component-models.json'),
    JSON.stringify(resolvedModels, null, 2),
  );

  // Build component-filters.json
  const filtersTemplate = JSON.parse(
    fs.readFileSync(path.join(ueModelsPath, 'component-filters.json'), 'utf8'),
  );
  const resolvedFilters = resolveReferences(filtersTemplate, ueModelsPath);
  fs.writeFileSync(
    path.join(rootPath, 'component-filters.json'),
    JSON.stringify(resolvedFilters, null, 2),
  );

  // eslint-disable-next-line no-console
  console.log('✅ UE configuration files built successfully');
}

if (require.main === module) {
  buildUEConfig();
}

module.exports = { buildUEConfig };
