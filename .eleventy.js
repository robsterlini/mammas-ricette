const pluginRss = require("@11ty/eleventy-plugin-rss");

const recipes = require('./src/_data/recipes');
const i18n = require('./src/_data/i18n.js');

const input = 'src';
const output = 'dist';

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  const LOCALE_MAP = {
    'en': 'en-GB',
    'it': 'it-IT',
  };
  const MONTHS_MAP = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    it: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  };
  
  // Filters
  eleventyConfig.addNunjucksFilter('formatDate', (date, locale = 'en') => {
    if (!date) return '';

    date = new Date(date);
    
    const month = MONTHS_MAP[locale][date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  });
  eleventyConfig.addNunjucksFilter('i18n', (string, locale = 'en') => {
    return i18n[locale][string] || string;
  });

  // Collections
  const getRecipes = (collectionApi, locale) => Object.keys(recipes)
    .map(slug => {
      return {
        slug,
        locale,
        url: `/${locale}/recipes/${slug}`,
        permalink: `/${locale}/recipes/${slug}`,
        ...recipes[slug],
      };
    });

  eleventyConfig.addCollection('recipesEn', collectionApi => getRecipes(collectionApi, 'en'));
  eleventyConfig.addCollection('recipesIt', collectionApi => getRecipes(collectionApi, 'it'));

  // Layout Aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('list', 'layouts/list.njk');
  eleventyConfig.addLayoutAlias('recipe', 'layouts/recipe.njk');

  // Pass through files
  const filesToCopy = [
    `${input}/images`,
  ];

  filesToCopy.forEach(file => {
    eleventyConfig.addPassthroughCopy(file);
  });

  return {
    dir: {
      input,
      output,
    },
    templateFormats : ['njk', 'md'],
    htmlTemplateEngine : 'njk',
    markdownTemplateEngine : 'njk',
    passthroughFileCopy: true,
  };
};
