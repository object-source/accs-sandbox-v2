export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const [image, description, buttonText] = row.children;

    // Create the promotional card structure
    const card = document.createElement('div');
    card.className = 'promotional-hero-card';

    // Handle image
    if (image && image.querySelector('picture, img')) {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'promotional-hero-image';
      imageContainer.innerHTML = image.innerHTML;
      card.appendChild(imageContainer);
    }

    // Create white box for content
    const whiteBox = document.createElement('div');
    whiteBox.className = 'promotional-hero-whitebox';

    // Handle description
    if (description) {
      const descriptionElement = document.createElement('p');
      descriptionElement.className = 'promotional-hero-description';
      descriptionElement.textContent = description.textContent;
      whiteBox.appendChild(descriptionElement);
    }

    // Handle button - always create one
    const buttonElement = document.createElement('a');
    buttonElement.className = 'promotional-hero-button';

    if (buttonText) {
      const link = buttonText.querySelector('a');
      if (link) {
        buttonElement.href = link.href;
        buttonElement.textContent = link.textContent;
        buttonElement.target = link.target || '_self';
      } else {
        buttonElement.href = '#';
        buttonElement.textContent = buttonText.textContent;
      }
    } else {
      buttonElement.href = '#';
      buttonElement.textContent = '';
    }

    whiteBox.appendChild(buttonElement);

    card.appendChild(whiteBox);

    // Replace the row with the card
    row.replaceWith(card);
  });

  // Wrap all cards in a container
  const container = document.createElement('div');
  container.className = 'promotional-hero-container';
  container.append(...block.children);

  // Create outer wrapper for centering
  const wrapper = document.createElement('div');
  wrapper.className = 'promotional-hero';
  wrapper.appendChild(container);

  block.replaceChildren(wrapper);
}
