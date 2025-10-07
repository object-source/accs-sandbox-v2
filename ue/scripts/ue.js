/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { showSlide } from '../../blocks/carousel/carousel.js';
import { moveInstrumentation } from './ue-utils.js';

const setupObservers = () => {
  const mutatingBlocks = document.querySelectorAll('div.cards, div.carousel, div.accordion, div.luxury-events, div.newsletter, div.footer-columns');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.tagName === 'DIV') {
        const addedElements = mutation.addedNodes;
        const removedElements = mutation.removedNodes;

        // detect the mutation type of the block or picture (for cards)
        const type = mutation.target.classList.contains('cards-card-image') ? 'cards-image' : mutation.target.attributes['data-aue-model']?.value;

        switch (type) {
          case 'cards':
            // handle card div > li replacements
            if (addedElements.length === 1 && addedElements[0].tagName === 'UL') {
              const ulEl = addedElements[0];
              const removedDivEl = [...mutation.removedNodes].filter((node) => node.tagName === 'DIV');
              removedDivEl.forEach((div, index) => {
                if (index < ulEl.children.length) {
                  moveInstrumentation(div, ulEl.children[index]);
                }
              });
            }
            break;
          case 'cards-image':
            // handle card-image picture replacements
            if (mutation.target.classList.contains('cards-card-image')) {
              const addedPictureEl = [...mutation.addedNodes].filter((node) => node.tagName === 'PICTURE');
              const removedPictureEl = [...mutation.removedNodes].filter((node) => node.tagName === 'PICTURE');
              if (addedPictureEl.length === 1 && removedPictureEl.length === 1) {
                const oldImgEL = removedPictureEl[0].querySelector('img');
                const newImgEl = addedPictureEl[0].querySelector('img');
                if (oldImgEL && newImgEl) {
                  moveInstrumentation(oldImgEL, newImgEl);
                }
              }
            }
            break;
          case 'accordion':
            if (addedElements.length === 1 && addedElements[0].tagName === 'DETAILS') {
              moveInstrumentation(removedElements[0], addedElements[0]);
              moveInstrumentation(removedElements[0].querySelector('div'), addedElements[0].querySelector('summary'));
            }
            break;
          case 'carousel':
            if (removedElements.length === 1 && removedElements[0].attributes['data-aue-model']?.value === 'carousel-item') {
              const resourceAttr = removedElements[0].getAttribute('data-aue-resource');
              if (resourceAttr) {
                const itemMatch = resourceAttr.match(/item-(\d+)/);
                if (itemMatch && itemMatch[1]) {
                  const slideIndex = parseInt(itemMatch[1], 10);
                  const slides = mutation.target.querySelectorAll('li.carousel-slide');
                  const targetSlide = Array.from(slides).find((slide) => parseInt(slide.getAttribute('data-slide-index'), 10) === slideIndex);
                  if (targetSlide) {
                    moveInstrumentation(removedElements[0], targetSlide);
                  }
                }
              }
            }
            break;
          case 'luxury-events':
            // handle luxury-events: preserve instrumentation when rows are removed
            // and cards are created
            if (mutation.target.classList.contains('luxury-events')) {
              const cardsContainer = mutation.target.querySelector('.luxury-events-cards');
              if (cardsContainer) {
                const removedRows = [...removedElements].filter(
                  (node) => node.tagName === 'DIV' && node.children.length === 4,
                );
                const cards = [...cardsContainer.querySelectorAll('.luxury-events-card')];
                removedRows.forEach((row, index) => {
                  if (cards[index]) {
                    moveInstrumentation(row, cards[index]);
                    const [imageCell, titleCell, descriptionCell, linkCell] = row.children;
                    const card = cards[index];
                    const cardImage = card.querySelector('.luxury-events-card-image img');
                    const cardTitle = card.querySelector('.luxury-events-card-title');
                    const cardDesc = card.querySelector('.luxury-events-card-description');
                    const cardLink = card.querySelector('.luxury-events-link');
                    if (imageCell && cardImage) {
                      moveInstrumentation(imageCell.querySelector('img'), cardImage);
                    }
                    if (titleCell && cardTitle) {
                      moveInstrumentation(titleCell, cardTitle);
                    }
                    if (descriptionCell && cardDesc) {
                      moveInstrumentation(descriptionCell, cardDesc);
                    }
                    if (linkCell && cardLink) {
                      moveInstrumentation(linkCell.querySelector('a'), cardLink);
                    }
                  }
                });
              }
            }
            break;
          case 'newsletter':
            // handle newsletter: preserve instrumentation when block content is replaced
            if (mutation.target.classList.contains('newsletter')) {
              const contentWrapper = mutation.target.querySelector('.newsletter-content');
              if (contentWrapper && removedElements.length > 0) {
                const removedRows = [...removedElements].filter((node) => node.tagName === 'DIV');
                if (removedRows.length >= 4) {
                  const [headerRow, dropdown1Row, _dropdown2Row, footerRow] = removedRows;
                  if (headerRow) {
                    const [titleCell, descriptionCell] = headerRow.children;
                    const titleDiv = contentWrapper.querySelector('.newsletter-title');
                    const descDiv = contentWrapper.querySelector('.newsletter-description');
                    if (titleCell && titleDiv) {
                      moveInstrumentation(titleCell, titleDiv);
                    }
                    if (descriptionCell && descDiv) {
                      moveInstrumentation(descriptionCell, descDiv);
                    }
                  }
                  if (dropdown1Row) {
                    const [labelCell, optionsCell] = dropdown1Row.children;
                    const label = contentWrapper.querySelector('.newsletter-field-label');
                    const select = contentWrapper.querySelector('.newsletter-select');
                    if (labelCell && label) moveInstrumentation(labelCell, label);
                    if (optionsCell && select) {
                      moveInstrumentation(optionsCell, select);
                    }
                  }
                  if (footerRow) {
                    const [privacyCell, buttonCell] = footerRow.children;
                    const privacyDiv = contentWrapper.querySelector('.newsletter-privacy');
                    const button = contentWrapper.querySelector('.newsletter-button');
                    if (privacyCell && privacyDiv) {
                      moveInstrumentation(privacyCell, privacyDiv);
                    }
                    if (buttonCell && button) {
                      moveInstrumentation(buttonCell, button);
                    }
                  }
                }
              }
            }
            break;
          case 'footer-columns':
            // handle footer-columns: preserve instrumentation when table structure
            // is transformed to grid/list structure
            if (mutation.target.classList.contains('footer-columns')) {
              const columnsGrid = mutation.target.querySelector('.footer-columns-grid');
              if (columnsGrid && removedElements.length > 0) {
                const removedRows = [...removedElements].filter((node) => node.tagName === 'DIV');
                if (removedRows.length > 0) {
                  const headerRow = removedRows[0];
                  const columns = [...columnsGrid.querySelectorAll('.footer-column')];
                  if (headerRow && headerRow.children) {
                    [...headerRow.children].forEach((headerCell, colIndex) => {
                      if (columns[colIndex]) {
                        const columnHeader = columns[colIndex].querySelector('.footer-column-header');
                        if (columnHeader) {
                          moveInstrumentation(headerCell, columnHeader);
                        }
                      }
                    });
                  }
                  removedRows.slice(1).forEach((row, rowIndex) => {
                    [...row.children].forEach((cell, colIndex) => {
                      if (columns[colIndex]) {
                        const linksList = columns[colIndex].querySelector('.footer-column-links');
                        if (linksList && linksList.children[rowIndex]) {
                          moveInstrumentation(cell, linksList.children[rowIndex]);
                        }
                      }
                    });
                  });
                }
              }
            }
            break;
          default:
            break;
        }
      }
    });
  });

  mutatingBlocks.forEach((cardsBlock) => {
    observer.observe(cardsBlock, { childList: true, subtree: true });
  });
};

const setupUEEventHandlers = () => {
  // For each img source change, update the srcsets of the parent picture sources
  document.addEventListener('aue:content-patch', (event) => {
    if (event.detail.patch.name.match(/img.*\[src\]/)) {
      const newImgSrc = event.detail.patch.value;
      const picture = event.srcElement.querySelector('picture');

      if (picture) {
        picture.querySelectorAll('source').forEach((source) => {
          source.setAttribute('srcset', newImgSrc);
        });
      }
    }
  });

  document.addEventListener('aue:ui-select', (event) => {
    const { detail } = event;
    const resource = detail?.resource;

    if (resource) {
      const element = document.querySelector(`[data-aue-resource="${resource}"]`);
      if (!element) {
        return;
      }
      const blockEl = element.parentElement?.closest('.block[data-aue-resource]') || element?.closest('.block[data-aue-resource]');
      if (blockEl) {
        const block = blockEl.getAttribute('data-aue-model');
        const index = element.getAttribute('data-slide-index');

        switch (block) {
          case 'accordion':
            blockEl.querySelectorAll('details').forEach((details) => {
              details.open = false;
            });
            element.open = true;
            break;
          case 'carousel':
            if (index) {
              showSlide(blockEl, index);
            }
            break;
          case 'tabs':
            if (element === block) {
              return;
            }
            blockEl.querySelectorAll('[role=tabpanel]').forEach((panel) => {
              panel.setAttribute('aria-hidden', true);
            });
            element.setAttribute('aria-hidden', false);
            blockEl.querySelector('.tabs-list').querySelectorAll('button').forEach((btn) => {
              btn.setAttribute('aria-selected', false);
            });
            blockEl.querySelector(`[aria-controls=${element?.id}]`).setAttribute('aria-selected', true);
            break;
          default:
            break;
        }
      }
    }
  });
};

export default () => {
  setupObservers();
  setupUEEventHandlers();
};
