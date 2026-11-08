import { render } from '@testing-library/react';
import markLanguages from './markLanguages';

test('wraps Nahuatl words with the lang attribute', () => {
  const { container } = render(<p>{markLanguages('Caldo Xóchitl')}</p>);

  const span = container.querySelector('span[lang="nah"]');
  expect(span).toHaveTextContent('Xóchitl');
  expect(container.querySelector('p')).toHaveTextContent('Caldo Xóchitl');
});

test('leaves text without foreign terms untouched', () => {
  const { container } = render(<p>{markLanguages('Zacahuil')}</p>);

  expect(container.querySelector('[lang]')).toBeNull();
});
