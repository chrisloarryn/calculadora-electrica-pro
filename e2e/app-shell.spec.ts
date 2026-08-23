import { expect, test } from '@playwright/test';

test.describe('app shell mobile-first', () => {
  test('muestra la entrada principal sin desbordamiento horizontal', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('app-shell')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Calculadora Eléctrica Pro' }),
    ).toBeVisible();
    await expect(page.getByTestId('create-project')).toHaveAccessibleName('Crear proyecto');
    await expect(page.getByTestId('mobile-navigation')).toHaveAttribute(
      'aria-label',
      'Navegación principal',
    );
    await expect(page.getByText('Tus proyectos eléctricos, claros y ordenados.')).toBeVisible();

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1);
  });

  test('mantiene el shell disponible después de quedar sin conexión', async ({ context, page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-shell')).toBeVisible();

    await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Este navegador no admite service workers');
      }
      await navigator.serviceWorker.ready;
    });

    await page.reload();
    await expect
      .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
      .toBe(true);

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByTestId('app-shell')).toBeVisible();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Calculadora Eléctrica Pro' }),
      ).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
