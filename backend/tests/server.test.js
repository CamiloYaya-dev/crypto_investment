describe('server', () => {
  afterEach(() => {
    jest.resetModules(); // Limpia cache para simular distintos escenarios
  });

  it('debería iniciar el servidor con env.PORT', () => {
    jest.doMock('../src/config/env', () => ({ PORT: 1234 }));
    const app = require('express')();
    const listenMock = jest.fn((port, cb) => cb());
    app.listen = listenMock;
    jest.doMock('../src/app', () => app);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    require('../src/server');

    expect(listenMock).toHaveBeenCalledWith(1234, expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith(
      'Servidor backend corriendo en http://localhost:1234'
    );

    consoleSpy.mockRestore();
  });

  it('debería usar puerto 3001 si env.PORT no está definido', () => {
    jest.doMock('../src/config/env', () => ({})); // Simula env vacío
    const app = require('express')();
    const listenMock = jest.fn((port, cb) => cb());
    app.listen = listenMock;
    jest.doMock('../src/app', () => app);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    require('../src/server');

    expect(listenMock).toHaveBeenCalledWith(3001, expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith(
      'Servidor backend corriendo en http://localhost:3001'
    );

    consoleSpy.mockRestore();
  });
});
